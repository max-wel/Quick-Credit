import { Router } from 'express';
import validator from 'express-validator';
import authRoutes from './api/auth';
import userRoutes from './api/user';
import loanRoutes from './api/loan';

const router = Router();
router.use(validator());
router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to quick-credit api',
  });
});
router.use(authRoutes);
router.use(userRoutes);
router.use(loanRoutes);

export default router;
