import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;
const verifyLogin = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      status: 401,
      error: 'No token found',
    });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid token',
      });
    }
    req.userId = decoded.userId;
    return next();
  });
};

export default { verifyLogin };
