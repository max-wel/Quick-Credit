import { Router } from 'express';
import loansController from '../../controllers/loansController';
import validation from '../../middlewares/validation';
import verify from '../../middlewares/verify';

const loanRoutes = Router();

loanRoutes.route('/loans')
  .post(verify.isLoggedIn, validation.loanValidator, loansController.createLoan)
  .get(verify.isLoggedIn, verify.adminOnly, loansController.getAllLoans);
loanRoutes.route('/loans/:id')
  .get(verify.isLoggedIn, verify.adminOnly, validation.loanIdValidator, loansController.getSpecificLoan)
  .patch(verify.isLoggedIn, verify.adminOnly, validation.updateLoanValidator, loansController.updateLoanStatus);
loanRoutes.post('/loans/:id/repayment', verify.isLoggedIn, verify.adminOnly, validation.repayLoanValidator, loansController.repayLoan);
loanRoutes.get('/loans/:id/repayments', verify.isLoggedIn, validation.loanIdValidator, loansController.getRepayments);

export default loanRoutes;
