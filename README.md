AuraTerm is a Next.js site with locally maintained content.

## Content and enquiries

Prices, package descriptions, features, additional services, and reviews are hardcoded in
[`lib/site-content.ts`](lib/site-content.ts) and rendered into the page HTML. Prices follow
`Cjenik usluga 2026.docx`: 3 mono-split packages and 13 additional services, with the 2 existing
multi-split prices retained. Prices include 25% VAT; net prices and separately stored historical
baseline prices are labelled alongside them. Reviews retain the published snapshot from 2026-11-19.
No CMS URL, token, or connection is required.

See [the pricing review](docs/pricing-review.md) for legal sources, owner confirmations, and
publication instructions. After changing current prices, update the publication revision/date,
run `npm run prices:update`, and commit the generated current CSV and archive files before
rebuilding and deploying. Keep historical baseline amounts unchanged unless correcting evidence.

Contact and quote forms submit to `/api/quote`. The Next.js server sends email through
`mail.auraterm.hr:465` with authenticated TLS using Nodemailer. Messages go from and to
`info@auraterm.hr`; Reply-To is the visitor's email. Contact details, system type, message,
and selected package are included. Success is shown after the SMTP server accepts the email;
failed submissions retain the visitor's input. The old `/contact` endpoint remains removed.

## Email configuration

Copy `.env.example` to `.env.local` and fill in `SMTP_PASSWORD` with the email account's password.
The host, port, and username are already filled in. Restart the local server after changing it.
Keep `.env.local` private; it is ignored by Git. Do not prefix SMTP variables with `NEXT_PUBLIC_`.

For the live Vercel site, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASSWORD` in the
project's environment variables and redeploy. Missing credentials return an error instead of
claiming a message was sent. The deployment must be able to reach the mail server on port 465.
No Strapi connection is used.

Run `npm test` for submission validation, SMTP configuration, and failure-path checks.

### SMTP connection troubleshooting

The server log includes Nodemailer's `code`, `originalCode`, and connection stage without
logging passwords or enquiry contents. `ESOCKET` with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
means TLS certificate validation failed before authentication, not that the mailbox password
was rejected. Check the hosting provider's SMTP certificate, hostname, and full intermediate
chain, as well as any local antivirus mail interception. Do not disable certificate validation.

On 19 November 2026, local probes found an Avast Web/Mail Shield certificate explicitly
issued by its **Untrusted Root** for `mail.auraterm.hr`. Ports 465 and 587 both failed TLS
validation; adding Windows system CAs did not resolve port 465. This requires resolving the
certificate/interception issue with the hosting provider or local Avast configuration. It is
not evidence that the same certificate is served to the production hosting environment.
No authentication or email sending was performed during those probes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Development output is stored in `.next-dev`; production builds use `.next`.
This allows `npm run build` while the development server is running without replacing its CSS or JavaScript assets.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Typography uses the system font stack defined in `src/app/globals.css`. Builds do not download Google Fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
