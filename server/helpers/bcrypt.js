import bcrypt from 'bcryptjs';

/**
 * @function hashPassword
 * @description Creates password hash
 * @param {String} password User password
 * @returns {String} Password hash
 */
const hashPassword = password => bcrypt.hashSync(password, 8);

/**
 * @function comparePassword
 * @description Returns a boolean based on password comparison
 * @param {String} password User password
 * @param {String} password User password hash gotten from database
 * @returns {Boolean} Password comparison result
 */
const comparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export default { hashPassword, comparePassword };
