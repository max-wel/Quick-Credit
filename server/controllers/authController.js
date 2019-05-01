import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Users from '../models/users';
import passwordEncrypt from '../helpers/bcrypt';
import mailer from '../helpers/mailer';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const userSignup = (req, res) => {
  const {
    email, firstName, lastName, password, address,
  } = req.body;
  const isEmailUnique = Users.some((user => user.email === email));

  if (isEmailUnique) {
    return res.status(400).json({
      status: 400,
      error: 'A user with this email exists',
    });
  }
  const newUser = {
    id: Users.length + 1,
    email,
    firstName,
    lastName,
    password: passwordEncrypt.hashPassword(password),
    address,
    status: 'unverified',
    isAdmin: false,
  };
  Users.push(newUser);
  // create token
  const token = jwt.sign({ id: newUser.id, isAdmin: newUser.isAdmin }, jwtSecret, { expiresIn: '1h' });

  return res.status(201).json({
    status: 201,
    data: {
      token,
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
  });
};

const userSignin = (req, res) => {
  const { email, password } = req.body;
  const user = Users.find(item => item.email === email);
  if (!user) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid login credentials',
    });
  }
  if (!passwordEncrypt.comparePassword(password, user.password)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid login credentials',
    });
  }
  // create token
  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '1h' });
  return res.json({
    status: 200,
    data: {
      token,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

const verifyClient = (req, res) => {
  const { email } = req.params;
  const { status } = req.body;

  const client = Users.find(user => user.email === email);
  if (!client) {
    return res.status(404).json({
      status: 404,
      error: 'Client does not exist',
    });
  }
  // modify client status
  client.status = status;
  return res.json({
    status: 200,
    data: client,
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  // check if user with the email exists
  const user = Users.find(item => item.email === email);
  if (!user) {
    return res.status(404).json({
      status: 404,
      error: 'Email does not exist',
    });
  }
  // create reset token (sign with user password hash)
  const resetSecret = user.password;
  const resetToken = jwt.sign({ id: user.id }, resetSecret, { expiresIn: '1h' });
  console.log(resetToken);
  // send reset mail with password reset link
  mailer.sendResetMail(user, resetToken);
  return res.json({
    status: 200,
    data: {
      message: 'Password reset mail sent',
    },
  });
};

const resetPassword = (req, res) => {
  const resetToken = req.params.token;
  const { password } = req.body;

  // get user id from token
  const { id } = jwt.decode(resetToken) || {};
  const user = Users.find(item => item.id === id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      error: 'User not found',
    });
  }
  // get user password and use as secret for one time token use
  const resetSecret = user.password;

  jwt.verify(resetToken, resetSecret, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        error: 'Expired reset link',
      });
    }
    // update password
    user.password = passwordEncrypt.hashPassword(password);
    return res.json({
      status: 200,
      data: {
        message: 'Password reset successful',
      },
    });
  });
};

export default {
  userSignup, userSignin, verifyClient, forgotPassword, resetPassword,
};
