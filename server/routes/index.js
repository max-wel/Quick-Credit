import { Router } from 'express';
import loansController from '../controllers/loansController';
import validation from '../middlewares/validation';

const router = Router();
router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to quick-credit api',
  });
});
router.post('/loans', validation.loanValidator, loansController.createLoan);

export default router;
