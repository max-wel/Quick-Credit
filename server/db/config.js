import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
// eslint-disable-next-line import/no-mutable-exports
let pool;
if (process.env.NODE_ENV === 'test') {
  pool = new Pool({
    connectionString: process.env.DB_TEST_URL,
  });
} else if (process.env.NODE_ENV === 'dev') {
  pool = new Pool({
    connectionString: process.env.DB_DEV_URL,
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}
export default pool;
