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

  Loans.push(newLoan);
  res.status(201).json({
    status: 201,
    data: newLoan,
  });
};

export default { createLoan };
