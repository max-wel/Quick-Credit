import passwordEncrypt from '../helpers/bcrypt';

const users = [
  {
    id: 1,
    email: 'rigatoni@gmail.com',
    firstName: 'Rigatoni',
    lastName: 'Pochettino',
    password: passwordEncrypt.hashPassword('qwerty'),
    address: '21, Vicarage road Watford',
    status: 'unverified',
    isAdmin: false,
  },
  {
    id: 2,
    email: 'sneaky@gmail.com',
    firstName: 'Max',
    lastName: 'Well',
    password: passwordEncrypt.hashPassword('admin'),
    address: '21, Vicarage road Watford',
    status: 'unverified',
    isAdmin: true,
  },
];
export default users;
