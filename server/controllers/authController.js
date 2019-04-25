import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Users from '../models/users';
import passwordEncrypt from '../helpers/bcrypt';

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
  const token = jwt.sign({ userId: newUser.id }, jwtSecret, { expiresIn: '1h' });

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
  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
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

export default { userSignup, userSignin };
