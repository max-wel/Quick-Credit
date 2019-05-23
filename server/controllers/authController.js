import jwt from 'jsonwebtoken';
import generateToken from '../helpers/generateToken';
import passwordEncrypt from '../helpers/bcrypt';
import mailer from '../helpers/mailer';
import pool from '../db/config';

/**
 * @function userSignup
 * @description Creates new user
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const userSignup = async (req, res) => {
  const {
    email, firstName, lastName, password, address,
  } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows[0]) {
      return res.status(409).json({
        status: 409,
        error: 'A user with this email exist',
      });
    }
    const query = {
      text: 'INSERT INTO users (email, "firstName", "lastName", password, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [email, firstName, lastName, passwordEncrypt.hashPassword(password), address],
    };
    const result = await pool.query(query);
    const token = generateToken.signToken({ email: result.rows[0].email, isAdmin: result.rows[0].isAdmin });
    // send welcome mail
    mailer.sendWelcomeMail(result.rows[0]);
    return res.status(201).json({
      status: 201,
      data: {
        token,
        id: result.rows[0].id,
        firstName: result.rows[0].firstName,
        lastName: result.rows[0].lastName,
        email: result.rows[0].email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function userSignin
 * @description Logs in user
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const userSignin = async (req, res) => {
  const { email, password } = req.body;
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  // make asynchronous call to db
  try {
    const result = await pool.query(query);
    if (!result.rows[0]) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid login credentials',
      });
    }
    if (!passwordEncrypt.comparePassword(password, result.rows[0].password)) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid login credentials',
      });
    }
    const token = generateToken.signToken({ email: result.rows[0].email, isAdmin: result.rows[0].isAdmin });
    return res.json({
      status: 200,
      data: {
        token,
        id: result.rows[0].id,
        firstName: result.rows[0].firstName,
        lastName: result.rows[0].lastName,
        email: result.rows[0].email,
        isAdmin: result.rows[0].isAdmin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function verifyClient
 * @description Marks client as verified
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const verifyClient = async (req, res) => {
  const { email } = req.params;
  const { status } = req.body;

  try {
    const client = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!client.rows[0]) {
      return res.status(404).json({
        status: 404,
        error: 'Client does not exist',
      });
    }
    if (client.rows[0].status === 'verified') {
      return res.status(409).json({
        status: 409,
        error: 'User is already verified',
      });
    }
    const query = {
      text: 'UPDATE users SET status = $1 WHERE email = $2 RETURNING *',
      values: [status, email],
    };
    const result = await pool.query(query);
    return res.json({
      status: 200,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function forgotPassword
 * @description Sends password reset mail
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'Email does not exist',
      });
    }
    const resetSecret = user.password;
    const resetToken = generateToken.signToken({ email: user.email }, resetSecret, '1h');
    console.log(resetToken);
    mailer.sendResetMail(user, resetToken);
    return res.json({
      status: 200,
      data: {
        message: 'Password reset mail sent',
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function resetPassword
 * @description Resets user's password
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const resetPassword = async (req, res) => {
  const resetToken = req.params.token;
  const { password } = req.body;

  // get user email from token
  const { email } = jwt.decode(resetToken) || {};
  try {
    const result = await pool.query('SELECT password FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }
    const resetSecret = user.password;
    // no promise based implementation
    jwt.verify(resetToken, resetSecret);
    const query = {
      text: 'UPDATE users SET password = $1 WHERE email = $2',
      values: [passwordEncrypt.hashPassword(password), email],
    };
    await pool.query(query);
    return res.json({
      status: 200,
      data: {
        message: 'Password reset successful',
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        status: 400,
        error: 'Expired reset link',
      });
    }
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE "isAdmin" = false');
    const users = result.rows;
    return res.json({
      status: 200,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

export default {
  userSignup, userSignin, verifyClient, forgotPassword, resetPassword, getAllUsers,
};
