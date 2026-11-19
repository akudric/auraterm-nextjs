const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Small Node-side loader for the shared, pure price-list modules (no bundler needed).
function loadTypeScript(filename) {
  const absolute = path.resolve(filename);
  const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  const localRequire = name => {
    if (!name.startsWith('.')) throw new Error(`Unexpected dependency: ${name}`);
    return loadTypeScript(path.resolve(path.dirname(absolute), name + '.ts'));
  };
  new Function('require', 'exports', 'module', source)(localRequire, module.exports, module);
  return module.exports;
}

module.exports = { loadTypeScript };
