import express from 'express';
import pool from '../pool';
import { CheckToken } from './tokenCheck';

const router = express.Router();

router.get('/users', async (req, res) => {
    
    const flag = CheckToken(req);
    if(!flag){
        res.json(null);
    }
    try {
        const result = await pool.query('SELECT id, name, email, password FROM \"user\" ORDER BY id');
        res.json(result.rows); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export const users = router;
