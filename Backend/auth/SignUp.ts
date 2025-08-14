import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pool from '../pool'; 


const router = express.Router();

router.post('/signup' , async(req,res) => {
    const { name , email , password  } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Here");
        const result = await pool.query(
            "INSERT INTO \"user\" (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );
        console.log("Here");
        const user = result.rows[0];

        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({
            message: 'Signup successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export const signUpRoute  = router;
