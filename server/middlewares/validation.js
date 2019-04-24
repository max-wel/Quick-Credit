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
export default { loanValidator };
