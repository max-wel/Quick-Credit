const usersTableQuery = `CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  email TEXT UNIQUE NOT NULL, 
  first_name TEXT NOT NULL, 
  last_name TEXT NOT NULL, 
  password TEXT NOT NULL, 
  address TEXT NOT NULL, 
  status VARCHAR(30) DEFAULT('unverified'), 
  is_admin BOOLEAN DEFAULT false,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`;

const loansTableQuery = `CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY, 
  user_email TEXT REFERENCES users(email), 
  status VARCHAR DEFAULT('pending'), 
  repaid BOOLEAN DEFAULT false, 
  tenor SMALLINT NOT NULL CHECK(tenor >=0 AND tenor <=12), 
  amount NUMERIC(20,2) NOT NULL, 
  payment_installment NUMERIC(20,2) NOT NULL, 
  balance NUMERIC(20,2) NOT NULL, 
  interest NUMERIC(20,2) NOT NULL, 
  created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`;

const repaymentsTableQuery = `CREATE TABLE IF NOT EXISTS repayments (
  id SERIAL PRIMARY KEY, 
  loan_id INTEGER REFERENCES loans(id), 
  balance NUMERIC(20,2) NOT NULL, 
  created_on TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`;

const createTables = `${usersTableQuery}${loansTableQuery}${repaymentsTableQuery}`;
export default createTables;
