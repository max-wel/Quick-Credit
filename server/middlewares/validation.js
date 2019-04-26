const loanValidator = (req, res, next) => {
  // const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  const tenorRegex = /^([2-9]|1[0-2]?)$/;
  const { user, tenor, amount } = req.body;

  if (!user || user.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'User email is required',
    });
  }
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
export default { loanValidator, signupValidator };