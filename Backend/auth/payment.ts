// routes/checkoutRoutes.ts
import express, { Request, Response } from 'express';
import Stripe from 'stripe';

const router = express.Router();

const stripe = new Stripe('{Put you payment api' as string, {
  apiVersion: "2025-07-30.basil" // latest supported
});
  console.log(222);
router.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: 'usd',
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error(err);
    console.log(222);
    res.status(500).send({ error: err.message });
  }
});
export default router;
