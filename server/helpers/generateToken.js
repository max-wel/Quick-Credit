import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

/**
 * @function signToken
 * @description Creates token
 * @param {Object} payload User email
 * @param {String} secret JWT secret
 * @param {String} time Token expiration duration
 * @returns {String} Token
 */
const signToken = (payload, secret = jwtSecret, time = '24h') => jwt.sign(payload, secret, { expiresIn: time });

export default { signToken };
