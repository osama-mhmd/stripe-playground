require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:4242";
const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook error: ${err.message}`);
    return res.sendStatus(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // console.log(session);
    console.log("✅ Payment received for:", session.customer_details.email);
  }

  res.sendStatus(200);
});

app.listen(4242, () => console.log("Running on port 4242"));
