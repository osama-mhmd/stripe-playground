# Stripe Playground

## Running the sample

1. Download the [Stripe CLI](https://stripe.com/docs/stripe-cli), and login.

2. Then, run `stripe listen --forward-to localhost:4242/webhook`.

3. Take the printed webhook secret (e.g. `whsec_***`) and set it as the `STRIPE_WEBHOOK_KEY` environment variable.

4. Run `NODE_OPTIONS=--openssl-legacy-provider yarn start`, and that's it!
