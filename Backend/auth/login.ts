import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pool from '../pool'; 


const router = express.Router();

router.post('/login' , async(req,res) => {
    const { email, password } = req.body;
    try{
        const result = await pool.query("SELECT * FROM \"user\" WHERE \"email\" = $1", [email])
        if(result.rows.length === 0){
            return res.status(404).json({ message: 'User not Found' });
        }
        const user = result.rows[0];
        console.log("Here");

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(404).json({ message: 'Wrong Password' });
        }
        const token = jwt.sign({ id: user.id , role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log("Here");

        console.log('Saving token:', token);

        const data = await pool.query(
        'UPDATE "user" SET "Token" = $1 WHERE "email" = $2 RETURNING *',
        [token, email]
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000, 
        });
        res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        });
        console.log("Here");
    }catch(error){
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export const authRoutes = router;
