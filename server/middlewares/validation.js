/**
 * @function loanValidator
 * @description Validates loan application
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const loanValidator = (req, res, next) => {
  req.checkBody('tenor')
    .not().isEmpty()
    .withMessage('Tenor is required')
    .trim()
    .isInt({ min: 1, max: 12 })
    .withMessage('Tenor should be between 1 to 12 months');
  req.checkBody('amount')
    .not().isEmpty()
    .withMessage('Amount is required')
    .trim()
    .matches(/^\d+(\.\d{0,2})?$/)
    .withMessage('Invalid amount format')
    .custom(value => value > 50)
    .withMessage('Amount should be greater than 50 naira');

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
    });
  }
  return next();
};

/**
 * @function LoanIdValidator
 * @description Validates loan id
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {function} next Next middleware function
 * @returns {function} Next function
 */
const loanIdValidator = (req, res, next) => {
  req.checkParams('id')
    .isInt()
    .withMessage('Invalid id parameter');
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
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
  req.checkBody('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .trim();

  req.checkBody('firstName')
    .not().isEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name should contain only letters')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('First name should contain 2 to 30 letters');

  req.checkBody('lastName')
    .not().isEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name should contain only letters')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Last name should contain 2 to 30 letters');

  req.checkBody('password')
    .not().isEmpty()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 5, max: 25 })
    .withMessage('Password should be between 5 to 25 characters');

  req.checkBody('address')
    .not().isEmpty()
    .withMessage('Address is required')
    .trim()
    .isLength({ min: 5, max: 60 })
    .withMessage('Address should be between 5 to 60 characters');

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
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
  req.checkBody('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .trim();

  req.checkBody('password')
    .not().isEmpty()
    .withMessage('Password is required');

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
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
  req.checkParams('id')
    .isInt()
    .withMessage('Invalid id parameter');
  req.checkBody('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Invalid status');

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
    });
  }
  return next();
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
  req.checkParams('id')
    .isInt()
    .withMessage('Invalid id parameter');
  req.checkBody('paidAmount')
    .not().isEmpty()
    .withMessage('Amount is required')
    .trim()
    .matches(/^\d+(\.\d{0,2})?$/)
    .withMessage('Invalid amount format')
    .custom(value => value > 0)
    .withMessage('Amount should be greater than zero');

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
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
  req.checkParams('email')
    .isEmail()
    .withMessage('Invalid email parameter');
  req.checkBody('status')
    .isIn(['verified'])
    .withMessage('Invalid status');
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
    });
  }
  return next();
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
  req.checkBody('password')
    .not().isEmpty()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 5, max: 25 })
    .withMessage('Password should be between 5 to 25 characters');
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      error: 'Passwords do not match',
    });
  }
  return next();
};

const forgotPasswordValidator = (req, res, next) => {
  req.checkBody('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .trim();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: errors[0].msg,
    });
  }
  return next();
};

export default {
  loanValidator, signupValidator, updateLoanValidator, repayLoanValidator, verifyClientValidator, passwordResetValidator, signinValidator, loanIdValidator, forgotPasswordValidator,
};
