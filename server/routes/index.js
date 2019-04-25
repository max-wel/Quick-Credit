import { Router } from 'express';
import loansController from '../controllers/loansController';
import authController from '../controllers/authController';
import validation from '../middlewares/validation';
import verifyToken from '../middlewares/verifyToken';

const router = Router();
router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to quick-credit api',
  });
});
router.post('/loans', validation.loanValidator, loansController.createLoan);

// auth routes
router.post('/auth/signup', validation.signupValidator, authController.userSignup);
router.post('/auth/signin', authController.userSignin);
export default router;
