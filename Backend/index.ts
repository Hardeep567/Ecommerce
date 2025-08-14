import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {authRoutes} from './auth/login';
import {signUpRoute} from './auth/SignUp';
import { users } from './auth/user';
import uploadRoute from './auth/productUpload'; 
import { token } from './auth/Token';
import path from 'path';
import Product from './auth/Product'
import SinglePage from './auth/SiglePage'
import payment from './auth/payment';
import { cart } from './auth/cart';
import cookieParser from 'cookie-parser';
import UserProduct from './auth/UserProduct'
import StoreProduct from './auth/storeProduct'


const app = express();
const PORT = 3001;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002'], credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', signUpRoute);
app.use('/api', users );
app.use('/api', token);
app.use('/api', Product);
app.use('/api', SinglePage);
app.use('/api' , payment );
app.use('/api' , cart );
app.use('/api' , UserProduct );
app.use('/api', StoreProduct);
app.use(uploadRoute);


app.get('/', (req, res) => res.send('✅ Server is running'));

try {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('❌ Error starting server:', error);
}

