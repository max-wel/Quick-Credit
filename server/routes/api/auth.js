import { Router } from 'express';
import authController from '../../controllers/authController';
import validation from '../../middlewares/validation';

const authRoutes = Router();

authRoutes.post('/auth/signup', validation.signupValidator, authController.userSignup);
authRoutes.post('/auth/signin', validation.signinValidator, authController.userSignin);
authRoutes.post('/auth/forgot_password', validation.forgotPasswordValidator, authController.forgotPassword);
authRoutes.post('/auth/reset_password/:token', validation.passwordResetValidator, authController.resetPassword);

export default authRoutes;
