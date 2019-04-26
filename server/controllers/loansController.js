import Loans from '../models/loans';

const createLoan = (req, res) => {
  const { user } = req.body;
  const amount = Number(req.body.amount);
  const tenor = Number(req.body.tenor);
  const interest = Number(((5 / 100) * amount).toFixed(2));
  const paymentInstallment = Number(((amount + interest) / tenor).toFixed(2));

  const newLoan = {
    id: Loans.length + 1,
    user,
    createdOn: new Date(),
    status: 'pending',
    repaid: false,
    tenor,
    amount,
    paymentInstallment,
    balance: Number((amount + interest).toFixed(2)),
    interest,
  };

  const existingLoans = Loans.filter(loan => loan.user === user);

  const repaidLoan = existingLoans.filter(loan => loan.repaid === false);
  if (repaidLoan.length !== 0) {
    return res.status(400).json({
      status: 400,
      error: 'Unsettle',
    });
  }

  Loans.push(newLoan);
  return res.status(201).json({
    status: 201,
    data: newLoan,
  });
};

const getAllLoans = (req, res) => {
  const { status, repaid } = req.query;

  if (status === 'approved' && repaid === 'false') {
    const currentLoans = Loans.filter(loan => loan.status === status && !loan.repaid);
    return res.json({
      status: 200,
      data: currentLoans,
    });
  }

  return res.json({
    status: 200,
    data: Loans,
  });
};
export default { createLoan, getAllLoans };
