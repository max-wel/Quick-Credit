import passwordEncrypt from '../helpers/bcrypt';

const createAdminQuery = {
  text: 'INSERT INTO users(email, first_name, last_name, password, address, status, is_admin) VALUES($1, $2, $3, $4, $5, $6, $7)',
  values: ['sneaky@gmail.com', 'Maxwell', 'Boogeyman', passwordEncrypt.hashPassword('admin'), '21, Vicarage road Watford', 'verified', true],
};
export default createAdminQuery;
