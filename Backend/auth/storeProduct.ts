import express from "express";
const router = express.Router();
import pool from "../pool";

router.post('/orders', async (req, res) => {
  const client = await pool.connect();

  try {
    const { user_id, total_amount, cart } = req.body;

    await client.query('BEGIN');
    console.log("233");
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id`,
      [user_id, total_amount]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of cart) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, item.price]
      );
    }
    console.log("233");
    await client.query('COMMIT');
    res.status(201).json({ message: 'Order created successfully', orderId });
        console.log("233");
  } catch (err) {
    await client.query('ROLLBACK');
        console.log("233");
    if (err instanceof Error) {
      console.error('Order insert failed:', err.message);
    } else {
      console.error('Order insert failed:', err);
    }

    res.status(500).json({ error: 'Failed to create order' });

  } finally {
    client.release();
  }
});

export default router;
