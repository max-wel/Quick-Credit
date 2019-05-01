import Loans from '../models/loans';
import Repayments from '../models/repayments';
import Users from '../models/users';
import mailer from '../helpers/mailer';

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
  if (status === 'approved' && repaid === 'true') {
    const repaidLoans = Loans.filter(loan => loan.status === status && loan.repaid);
    return res.json({
      status: 200,
      data: repaidLoans,
    });
  }

  return res.json({
    status: 200,
    data: Loans,
  });
};

const getSpecificLoan = (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const loan = Loans.find(item => item.id === loanId);
  if (!loan) {
    return res.status(404).json({
      status: 404,
      error: 'No loan found',
    });
  }
  return res.json({
    status: 200,
    data: loan,
  });
};

const updateLoanStatus = (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const { status } = req.body;

  const loan = Loans.find(item => item.id === loanId);
  if (!loan) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid id parameter',
    });
  }
  // update loan status
  loan.status = status;
  // get user and send notification mail
  const user = Users.find(item => item.email === loan.user);
  mailer.sendLoanNotificationMail(user, status);
  return res.json({
    status: 200,
    data: loan,
  });
};

const repayLoan = (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const paidAmount = Number(req.body.paidAmount);

  const loan = Loans.find(item => item.id === loanId);
  if (!loan) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid id parameter',
    });
  }
  // check if loan has been approved
  if (loan.status !== 'approved') {
    return res.status(400).json({
      status: 400,
      error: 'Loan is not approved',
    });
  }
  // check if loan has been repaid
  if (loan.repaid) {
    return res.status(400).json({
      status: 400,
      error: 'Loan already repaid',
    });
  }
  // compute new balance
  const newBalance = Number((loan.balance - paidAmount).toFixed(2));
  loan.balance = newBalance;
  if (newBalance === 0) {
    loan.repaid = true;
  }
  // create repayment record
  const repayment = {
    id: Repayments.length + 1,
    loanId,
    createdOn: new Date(),
    paidAmount,
    amount: loan.amount,
    monthlyInstallment: loan.paymentInstallment,
    balance: loan.balance,
  };
  Repayments.push(repayment);

  return res.status(201).json({
    status: 201,
    data: repayment,
  });
};

const getRepayments = (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const repayments = Repayments.filter(repayment => repayment.loanId === loanId);
  return res.json({
    status: 200,
    data: repayments,
  });
};

export default {
  createLoan, getAllLoans, getSpecificLoan, updateLoanStatus, repayLoan, getRepayments,
};
