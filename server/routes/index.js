import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../docs/swagger.json';
import loansController from '../controllers/loansController';
import authController from '../controllers/authController';
import validation from '../middlewares/validation';
import verify from '../middlewares/verify';

const router = Router();
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
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
  .patch(verify.isLoggedIn, verify.adminOnly, validation.updateLoanValidator, loansController.updateLoanStatus);
router.post('/loans/:id/repayment', verify.isLoggedIn, verify.adminOnly, validation.repayLoanValidator, loansController.repayLoan);
router.get('/loans/:id/repayments', verify.isLoggedIn, loansController.getRepayments);

// auth routes
router.post('/auth/signup', validation.signupValidator, authController.userSignup);
router.post('/auth/signin', validation.signinValidator, authController.userSignin);
router.patch('/users/:email/verify', verify.isLoggedIn, verify.adminOnly, validation.verifyClientValidator, authController.verifyClient);

// reset routes
router.post('/auth/forgot_password', authController.forgotPassword);
router.post('/auth/reset_password/:token', validation.passwordResetValidator, authController.resetPassword);
export default router;
