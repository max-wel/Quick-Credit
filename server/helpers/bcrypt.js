import bcrypt from 'bcryptjs';

const hashPassword = password => bcrypt.hashSync(password, 8);
const comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export default { hashPassword, comparePassword };
