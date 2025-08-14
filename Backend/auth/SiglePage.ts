import express from 'express';
import pool from '../pool';

const router = express.Router();

// GET single product by ID with variants
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get product details
    const productResult = await pool.query('SELECT * FROM "product" WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = productResult.rows[0];

    // Get product variants
    const variantsResult = await pool.query(
      'SELECT * FROM "product_variant" WHERE product_id = $1',
      [id]
    );

    product.variants = variantsResult.rows;

    res.status(200).json(product); // No nested `product` key here
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
