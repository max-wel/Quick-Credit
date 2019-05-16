import passwordEncrypt from '../helpers/bcrypt';

const createAdminQuery = {
  text: 'INSERT INTO users(email, "firstName", "lastName", password, address, status, "isAdmin") VALUES($1, $2, $3, $4, $5, $6, $7)',
  values: ['sneaky@gmail.com', 'Maxwell', 'Boogeyman', passwordEncrypt.hashPassword('admin'), '21, Vicarage road Watford', 'verified', true],
};
export default createAdminQuery;
