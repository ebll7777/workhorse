# Deploy Workhorse On Render

This project is ready to be hosted as one Node web service on Render.

## 1. Push the project to GitHub

Render deploys from a Git repository, so the `D:\Workhorse` project needs to be in GitHub, GitLab, or Bitbucket.

## 2. Create the Render service

1. Sign in to Render.
2. Choose `New` -> `Blueprint`.
3. Connect the repository that contains this project.
4. Render will detect the `render.yaml` file in the repo root.
5. Deploy the `workhorse` web service.

## 3. Add environment variables

Set these in the Render dashboard before the first real payment test:

- `PUBLIC_SITE_URL`
- `SERVER_PUBLIC_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

For production, set both URL variables to the final public domain, for example:

```text
PUBLIC_SITE_URL=https://yourdomain.com
SERVER_PUBLIC_URL=https://yourdomain.com
```

## 4. Point the Squarespace domain to Render

Keep the domain registered at Squarespace. In Squarespace DNS settings:

- Point the root domain to the Render service using the DNS records Render gives you.
- Point `www` to the same Render service if you want both versions to work.

Do not cancel Squarespace before the new site is live.

## 5. Persistent data

The Render blueprint attaches a persistent disk at:

```text
/var/data
```

The app writes its production data file to:

```text
/var/data/workhorse/workhorse-store.json
```

That file stores users, sessions, subscribers, and order records. Keep the disk attached before accepting real payments, otherwise order/account data can be lost on deploy or restart.

For higher traffic later, this file-backed store can be migrated to Postgres without changing the checkout UI.

## 6. Stripe webhook

After adding live Stripe keys, create a Stripe webhook endpoint pointing to:

```text
https://yourdomain.com/api/stripe/webhook
```

Listen for:

```text
payment_intent.succeeded
payment_intent.payment_failed
payment_intent.canceled
```

Then set the webhook signing secret in Render as `STRIPE_WEBHOOK_SECRET`.
