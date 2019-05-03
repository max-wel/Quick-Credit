import jwt from 'jsonwebtoken';
import generateToken from '../helpers/generateToken';
import Users from '../models/users';
import passwordEncrypt from '../helpers/bcrypt';
import mailer from '../helpers/mailer';

/**
 * @function userSignup
 * @description Creates new user
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
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
  const token = generateToken.signToken({ email: newUser.email, isAdmin: newUser.isAdmin });

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

/**
 * @function userSignin
 * @description Logs in user
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
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
  const token = generateToken.signToken({ email: user.email, isAdmin: user.isAdmin });
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

/**
 * @function verifyClient
 * @description Marks client as verified
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
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

/**
 * @function forgotPassword
 * @description Sends password reset mail
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
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
  const resetToken = generateToken.signToken({ email: user.email }, resetSecret, '1h');
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

/**
 * @function resetPassword
 * @description Resets user's password
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const resetPassword = (req, res) => {
  const resetToken = req.params.token;
  const { password } = req.body;

  // get user email from token
  const { email } = jwt.decode(resetToken) || {};
  const user = Users.find(item => item.email === email);
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
