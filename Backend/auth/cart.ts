import express from 'express';
import pool from '../pool';


const router = express.Router();

router.get('/cart', async (req, res) => {

    console.log(req.cookies);

    const token = req.cookies.token;

    const result = await pool.query('SELECT * FROM "user" WHERE "Token" = $1', [token]);

    console.log('Checking token:', token);
    if(!result.rows[0]){
        res.json(null);
    }
    else{
        res.json(true);
    }
});

export const cart = router;
