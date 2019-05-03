import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

/**
 * @function isLoggedIn
 * @description Verifies user signin token
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const isLoggedIn = (req, res, next) => {
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
    req.user = { email: decoded.email, isAdmin: decoded.isAdmin };
    return next();
  });
};

/**
 * @function adminOnly
 * @description Verifies that user is an admin
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const adminOnly = (req, res, next) => {
  const { isAdmin } = req.user;
  if (!isAdmin) {
    return res.status(403).json({
      status: 403,
      error: 'Access forbidden, admin only',
    });
  }
  return next();
};

export default { isLoggedIn, adminOnly };
