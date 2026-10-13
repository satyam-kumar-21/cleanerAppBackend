# Cleaner App - Backend API

Production-ready backend architecture for the Cleaner cross-platform application.

## 📁 Project Structure

```
cleaner-backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── validators/
│   ├── integrations/
│   │   ├── stripe/
│   │   ├── googlePlay/
│   │   └── apple/
│   ├── utils/
│   ├── jobs/
│   ├── docs/
│   ├── app.js
│   └── server.js
│
├── tests/
├── .env
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

```bash
npm install
npm start
```

## Stripe Premium subscriptions

Set these values in the backend environment. Keep Stripe secrets on the server;
never place them in the mobile app or commit real credentials:

- `STRIPE_SECRET_KEY` — Stripe secret test/live API key.
- `STRIPE_WEBHOOK_SECRET` — signing secret for the webhook endpoint.
- `STRIPE_RETURN_URL` — app deep link, matching the `myapp` scheme in `Mobile-App/app.json`
  (default: `myapp://upgrade`).

Register a Stripe webhook at
`POST /api/v1/subscriptions/stripe/webhook` for
`checkout.session.completed` and `customer.subscription.created`,
`customer.subscription.updated`, and `customer.subscription.deleted`. For local
testing, forward Stripe CLI events to that URL and set its generated
`whsec_...` value as `STRIPE_WEBHOOK_SECRET`.

The plan catalog creates recurring Checkout prices in USD from the backend
reference prices: $99 every six months and $179 every twelve months. Update
`getSubscriptionPlans` in `src/services/subscription.service.js` to change them.
The app opens Stripe-hosted Checkout and the backend verifies the completed
session before activating Premium. Authenticated routes:

- `GET /api/v1/plans` — returns the plan catalog.
- `GET /api/v1/subscriptions/me` — refreshes and returns the signed-in user's
  Stripe-backed `free` or `premium` status.
- `POST /api/v1/subscriptions/stripe/checkout` — creates a Checkout Session for
  the requested `planId`.
- `POST /api/v1/subscriptions/stripe/confirm` — verifies a Checkout Session
  against Stripe and links the subscription to the signed-in account.

Before deploying over a database used by the old Google Play implementation,
remove its legacy token index and token data. In MongoDB, inspect the
`subscriptions` collection, then run:

```javascript
db.subscriptions.dropIndex("purchaseTokenHash_1")
db.subscriptions.updateMany(
  {},
  { $unset: { purchaseToken: "", purchaseTokenHash: "" } }
)
```

Existing Google Play subscriptions are not migrated to Stripe and will no
longer grant Premium. Review Google Play's payments policy for the app's
distribution regions before enabling external Stripe checkout for digital
subscriptions.
