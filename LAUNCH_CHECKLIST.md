# Jonathan Jaffrey Website Launch Checklist

## Free checks already supported

- Run `npm run audit:products` before deploy.
- Run `npm run build` before deploy.
- Verify `https://jonjaff.com/healthz` returns `{ "ok": true }`.
- Review product titles, material lines, dimensions lines, prices, and categories.
- Test checkout validation with an empty cart and incomplete address fields.
- Test mobile homepage, product page pinch zoom, cart, checkout, and about page.
- Export stored orders/subscribers from `/api/admin/export` after setting `ADMIN_EXPORT_TOKEN`.

## Paid/live switches still required

- Replace Stripe test keys with live Stripe keys.
- Add a Stripe live webhook secret for `/api/stripe/webhook`.
- Replace PayPal sandbox credentials with live PayPal credentials.
- Set `PAYPAL_ENVIRONMENT=live`.
- Configure `RESEND_API_KEY` and verified sending domain for real order emails.
- Configure a production database if moving beyond Render disk storage.
- Create `info@jonjaff.com` or another domain email inbox.

## Legal/commercial review

- Review Privacy, Terms, Shipping, Returns, and Impressum text before public commerce launch.
- Confirm shipping prices and destinations.
- Confirm tax/VAT handling.
- Run one real low-value payment test and refund it.
