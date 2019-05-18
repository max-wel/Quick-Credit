/**
 * @function loanValidator
 * @description Validates loan application
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const loanValidator = (req, res, next) => {
  // const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  const tenorRegex = /^([2-9]|1[0-2]?)$/;
  const amountRegex = /^\d+(\.\d{0,2})?$/;
  const { tenor, amount } = req.body;

  if (!tenor) {
    return res.status(400).json({
      status: 400,
      error: 'Tenor is required',
    });
  }
  if (!tenorRegex.test(tenor)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid tenor',
    });
  }
  if (!amount) {
    return res.status(400).json({
      status: 400,
      error: 'Amount is required',
    });
  }
  if (!amountRegex.test(amount)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid amount',
    });
  }
  return next();
};

/**
 * @function signupValidator
 * @description Validates user signup
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const signupValidator = (req, res, next) => {
  const {
    email, firstName, lastName, password, address,
  } = req.body;
  if (!email || email.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Email is required',
    });
  }
  if (!firstName || firstName.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'First name is required',
    });
  }
  if (!lastName || lastName.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Last name is required',
    });
  }
  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Password is required',
    });
  }
  if (!address || address.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Address is required',
    });
  }
  return next();
};

/**
 * @function signinValidator
 * @description Validates user signin
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const signinValidator = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || email.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Email is required',
    });
  }
  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Password is required',
    });
  }
  return next();
};

/**
 * @function updateLoanValidator
 * @description Validates request status property
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const updateLoanValidator = (req, res, next) => {
  const { status } = req.body;
  if (status === 'approved' || status === 'rejected') {
    return next();
  }
  return res.status(400).json({
    status: 400,
    error: 'Invalid status',
  });
};

/**
 * @function repayLoanValidator
 * @description Validates request paidAmount property
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const repayLoanValidator = (req, res, next) => {
  const { paidAmount } = req.body;
  const regex = /^\d+(\.\d{0,2})?$/;
  console.log(paidAmount.toString());
  if (!regex.test(paidAmount)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid amount',
    });
  }
  return next();
};

/**
 * @function verifyClientValidator
 * @description Validates request status property
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const verifyClientValidator = (req, res, next) => {
  const { status } = req.body;
  if (status === 'verified') {
    return next();
  }
  return res.status(400).json({
    status: 400,
    error: 'Invalid status',
  });
};

/**
 * @function passwordResetValidator
 * @description Validates password reset request body
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const passwordResetValidator = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Password is required',
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      error: 'Password does not match',
    });
  }
  return next();
};

export default {
  loanValidator, signupValidator, updateLoanValidator, repayLoanValidator, verifyClientValidator, passwordResetValidator, signinValidator,
};
