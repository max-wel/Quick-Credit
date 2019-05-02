const loanValidator = (req, res, next) => {
  // const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  const tenorRegex = /^([2-9]|1[0-2]?)$/;
  const amountRegex = /^\d+\.\d{2}$/;
  const { tenor, amount } = req.body;

  if (!tenor || tenor.trim() === '') {
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
  if (!amount || amount.trim() === '') {
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

const repayLoanValidator = (req, res, next) => {
  const { paidAmount } = req.body;
  const regex = /^\d+\.\d{2}$/;
  if (!regex.test(paidAmount)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid amount',
    });
  }
  return next();
};

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
  loanValidator, signupValidator, updateLoanValidator, repayLoanValidator, verifyClientValidator, passwordResetValidator,
};
