import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../pool';
import fs from 'fs';

const router = express.Router();

const uploadDir = path.join(__dirname, '../../fontend/public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/api/products/upload', upload.array('images'), async (req, res) => {
  try {
    const { name, description, category, brand } = req.body;
    const variants = JSON.parse(req.body.variants);

    const productResult = await pool.query(
      'INSERT INTO product (name, description, category, brand) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, description, category, brand]
    );

    const productId = productResult.rows[0].id;

    const imageFiles = req.files as Express.Multer.File[];

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const imageFile = imageFiles[i];
      const imagePath = `/uploads/${imageFile.filename}`;

      await pool.query(
        `INSERT INTO product_variant (product_id, color, size, quantity, price, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [productId, variant.color, variant.size, variant.quantity, variant.price, imagePath]
      );
    }

    res.json({ message: '✅ Product uploaded successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Server error uploading product.' });
  }
});

export default router;
