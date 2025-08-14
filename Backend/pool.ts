import {Pool} from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'E-commerce',
  password: "123456",
  port: 5000,
});

export default pool;