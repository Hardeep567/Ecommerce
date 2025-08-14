import express from 'express';
import pool from '../pool';
import { CheckToken } from './tokenCheck';

const router = express.Router();

// GET /api/products
router.get('/products', async (req, res) => {
  const isAuthorized = await CheckToken(req);

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        p.id AS product_id,
        p.name,
        p.description,
        p.category,
        p.brand,
        v.id AS variant_id,
        v.color,
        v.size,
        v.price,
        v.quantity,
        v.image_url
      FROM product p
      LEFT JOIN product_variant v ON p.id = v.product_id
      ORDER BY p.id, v.id
    `);

    const productsMap: any = {};

    for (const row of result.rows) {
      const productId = row.product_id;
      if (!productsMap[productId]) {
        productsMap[productId] = {
          id: productId,
          name: row.name,
          description: row.description,
          category: row.category,
          brand: row.brand,
          variants: []
        };
      }

      if (row.variant_id) {
        productsMap[productId].variants.push({
          id: row.variant_id,
          color: row.color,
          size: row.size,
          price: row.price,
          quantity: row.quantity,
          image_url: row.image_url
        });
      }
    }

    res.json(Object.values(productsMap));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

export default router;
