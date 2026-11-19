const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// Load the real route with only the SMTP boundary mocked; no emails leave these tests.
const compiled = ts.transpileModule(fs.readFileSync('src/app/api/quote/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;

function setup({ env = { SMTP_PASSWORD: 'test-password' }, sendMail } = {}) {
  const calls = [];
  const logs = [];
  let config;
  let closed = false;
  const dependencies = {
    'server-only': {},
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    nodemailer: {
      createTransport(options) {
        config = options;
        return {
          async sendMail(message) {
            calls.push(message);
            return sendMail ? sendMail(message) : { accepted: ['info@auraterm.hr'] };
          },
          close() { closed = true; },
        };
      },
    },
  };
  const module = { exports: {} };
  new Function('require', 'exports', 'module', 'process', 'console', compiled)(
    (name) => {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency: ${name}`);
      return dependencies[name];
    }, module.exports, module, { env }, { error: (...args) => logs.push(args) },
  );
  return { POST: module.exports.POST, calls, logs, get config() { return config; }, get closed() { return closed; } };
}

const valid = { name: 'Željko & Ana', email: 'visitor@example.com', phone: '+385 99 123', message: 'Želim ponudu.\nHvala!', system_type: 'hlađenje', source: '2.5kW do 3.5kW' };
const request = (data = valid, headers = {}) => new Request('https://www.auraterm.hr/api/quote', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://www.auraterm.hr', ...headers }, body: JSON.stringify(data),
});

test('uses authenticated TLS and sends all fields to a fixed mailbox with visitor Reply-To', async () => {
  const app = setup();
  const response = await app.POST(request({ ...valid, to: 'attacker@example.com', from: 'fake@example.com' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(app.config.host, 'mail.auraterm.hr');
  assert.equal(app.config.port, 465);
  assert.equal(app.config.secure, true);
  assert.equal(app.config.requireTLS, true);
  assert.deepEqual(app.config.auth, { user: 'info@auraterm.hr', pass: 'test-password' });
  assert.equal(app.calls.length, 1);
  const mail = app.calls[0];
  assert.equal(mail.from.address, 'info@auraterm.hr');
  assert.equal(mail.to, 'info@auraterm.hr');
  assert.deepEqual(mail.replyTo, { name: valid.name, address: valid.email });
  assert.equal(mail.subject, `Upit za: ${valid.source}`);
  for (const value of Object.values(valid)) assert.ok(mail.text.includes(value));
  assert.equal(app.closed, true);
});

test('general enquiries work without optional fields', async () => {
  const app = setup();
  assert.equal((await app.POST(request({ name: valid.name, email: valid.email, message: valid.message }))).status, 200);
  assert.equal(app.calls[0].subject, 'Upit za besplatnu procjenu');
});

test('rejects invalid fields and header injection without contacting SMTP', async () => {
  for (const data of [null, [], {}, { ...valid, name: '  ' }, { ...valid, email: 'invalid' }, { ...valid, email: 'a@b.hr,c@d.hr' }, { ...valid, email: 'a@b.hr\r\nBcc: x@y.hr' }, { ...valid, source: 'Plan\nBcc: x@y.hr' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, phone: {} }]) {
    const app = setup();
    assert.equal((await app.POST(request(data))).status, 400);
    assert.equal(app.calls.length, 0);
  }
});

test('rejects foreign origins, wrong content types, malformed JSON, and oversized bodies', async () => {
  const app = setup();
  assert.equal((await app.POST(request(valid, { Origin: 'https://example.com' }))).status, 403);
  assert.equal((await app.POST(request(valid, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await app.POST(new Request('https://www.auraterm.hr/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal((await app.POST(request({ ...valid, message: 'x'.repeat(25000) }))).status, 413);
  assert.equal(app.calls.length, 0);
});

test('honeypot submissions do not send mail', async () => {
  const app = setup();
  assert.equal((await app.POST(request({ ...valid, company_website: 'spam' }))).status, 200);
  assert.equal(app.calls.length, 0);
});

test('missing credentials report unavailability instead of success', async () => {
  const app = setup({ env: {} });
  const response = await app.POST(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(app.calls.length, 0);
});

test('SMTP failures and recipient rejection return an error without leaking credentials', async () => {
  for (const sendMail of [async () => { throw Object.assign(new Error('secret SMTP details'), { code: 'EAUTH' }); }, async () => ({ accepted: [] })]) {
    const app = setup({ sendMail });
    const response = await app.POST(request());
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.ok(!body.includes('secret'));
    assert.ok(!JSON.stringify(app.logs).includes('secret'));
    assert.equal(app.closed, true);
  }
});

test('success waits for SMTP acceptance', async () => {
  let accept;
  let completed = false;
  const app = setup({ sendMail: () => new Promise(resolve => { accept = resolve; }) });
  const sending = app.POST(request()).then(response => { completed = true; return response; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(completed, false);
  accept({ accepted: ['info@auraterm.hr'] });
  assert.equal((await sending).status, 200);
});

test('TLS failures retain the underlying diagnostic without exposing private error details', async () => {
  const app = setup({ sendMail: async () => {
    throw Object.assign(new Error('private mailbox details'), {
      code: 'ESOCKET', originalCode: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', command: 'CONN',
      response: 'private SMTP response',
    });
  } });
  const response = await app.POST(request());
  assert.equal(response.status, 502);
  assert.deepEqual(app.logs[0], ['Contact email failed:', {
    code: 'ESOCKET', originalCode: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', command: 'CONN',
  }]);
  assert.ok(!(await response.text()).includes('UNABLE_TO_VERIFY'));
  assert.ok(!JSON.stringify(app.logs).includes('private'));
  assert.notEqual(app.config.tls?.rejectUnauthorized, false);
});
