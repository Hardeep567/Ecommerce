import express from 'express'
import pool from '../pool';

const router = express.Router();

router.post('/verify-token', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.split(' ')[1];

    try {
        const result = await pool.query('SELECT * FROM "user" WHERE "Token" = $1', [token]);
    if (result.rows.length === 0) {
        return res.status(401).json({ valid: false }); 
    }
        return res.json({ valid: true });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

export const token = router;
