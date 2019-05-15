import pool from './config';
import createTables from './createTables';
import createAdmin from './seed';

const migrate = async () => {
  try {
    await pool.query(createTables);
    const result = await pool.query('SELECT * FROM users WHERE is_admin = true');
    console.log(result);
    if (!result.rows[0]) {
      await pool.query(createAdmin);
    }
  } catch (error) {
    console.log(error);
  }
};
migrate();
