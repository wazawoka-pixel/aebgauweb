# aebgauweb

Next.js backend with Supabase auth, token balance, and Stripe webhooks.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/balance?email=`
- `POST /api/user/use-token`
- `POST /api/stripe/webhook`

## Env vars

Set in `.env.local`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
