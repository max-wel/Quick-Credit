import { Router } from 'express';
import loansController from '../controllers/loansController';
import authController from '../controllers/authController';
import validation from '../middlewares/validation';
import verify from '../middlewares/verify';

const router = Router();
router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to quick-credit api',
  });
});

router.route('/loans')
  .post(verify.isLoggedIn, validation.loanValidator, loansController.createLoan)
  .get(verify.isLoggedIn, verify.adminOnly, loansController.getAllLoans);
router.route('/loans/:id')
  .get(verify.isLoggedIn, verify.adminOnly, loansController.getSpecificLoan)
  .patch(verify.isLoggedIn, verify.adminOnly, validation.updateLoanValidator, loansController.updateLoan);
router.post('/loans/:id/repayment', verify.isLoggedIn, verify.adminOnly, validation.repayLoanValidator, loansController.repayLoan);

// auth routes
router.post('/auth/signup', validation.signupValidator, authController.userSignup);
router.post('/auth/signin', authController.userSignin);
export default router;
