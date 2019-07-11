import { Router } from 'express';
import authController from '../../controllers/authController';
import loansController from '../../controllers/loansController';
import validation from '../../middlewares/validation';
import verify from '../../middlewares/verify';

const userRoutes = Router();

userRoutes.patch('/users/:email/verify', verify.isLoggedIn, verify.adminOnly, validation.verifyClientValidator, authController.verifyClient);
userRoutes.get('/user/loans', verify.isLoggedIn, loansController.getUserLoan);
userRoutes.get('/users', verify.isLoggedIn, verify.adminOnly, authController.getAllUsers);

export default userRoutes;
