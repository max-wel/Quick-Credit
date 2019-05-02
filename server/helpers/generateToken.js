import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const signToken = (payload, secret = jwtSecret, time = '24h') => {
  return jwt.sign(payload, secret, { expiresIn: time });
}

export default { signToken };