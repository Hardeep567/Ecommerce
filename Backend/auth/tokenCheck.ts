import { Request } from 'express';
import pool from '../pool'; 
import { Console } from 'console';

export const CheckToken = async (req: Request): Promise<boolean> => {
  try {
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    const result = await pool.query('SELECT * FROM "user" WHERE "Token" = $1', [token]);

    console.log('Checking token:', token);


    if(!result.rows[0]){
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};
