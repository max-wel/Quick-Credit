import Loans from '../models/loans';
import Repayments from '../models/repayments';
import Users from '../models/users';
import mailer from '../helpers/mailer';
import pool from '../db/config';

/**
 * @function createLoan
 * @description Creates new loan
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const createLoan = async (req, res) => {
  const { email } = req.user;
  const amount = Number(req.body.amount);
  const tenor = Number(req.body.tenor);
  const interest = Number(((5 / 100) * amount).toFixed(2));
  const paymentInstallment = Number(((amount + interest) / tenor).toFixed(2));
  const balance = Number((amount + interest).toFixed(2));
  try {
    const loanResult = await pool.query('SELECT * FROM loans WHERE user_email = $1 AND repaid = false', [email]);
    if (loanResult.rows[0]) {
      return res.status(400).json({
        status: 400,
        error: 'You have an unsettled loan',
      });
    }
    const query = {
      text: 'INSERT INTO loans (user_email, tenor, amount, payment_installment, balance, interest) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [email, tenor, amount, paymentInstallment, balance, interest],
    };
    const result = await pool.query(query);
    return res.status(201).json({
      status: 201,
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function getAllLoans
 * @description Returns all loans
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const getAllLoans = async (req, res) => {
  const { status, repaid } = req.query;
  try {
    if (status === 'approved' && (repaid === 'true' || repaid === 'false')) {
      const query = {
        text: 'SELECT * FROM loans WHERE status = $1 AND repaid = $2',
        values: [status, repaid],
      };
      const result = await pool.query(query);
      return res.json({
        status: 200,
        data: result.rows,
      });
    }
    const result = await pool.query('SELECT * FROM loans');
    console.log(result);
    return res.json({
      status: 200,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function getSpecificLoan
 * @description Returns a specific loan
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const getSpecificLoan = async (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const query = {
    text: 'SELECT * FROM loans WHERE id = $1',
    values: [loanId],
  };
  try {
    const result = await pool.query(query);
    if (!result.rows[0]) {
      return res.status(404).json({
        status: 404,
        error: 'No loan found',
      });
    }
    return res.json({
      status: 200,
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function updateLoanStatus
 * @description Approves/Rejects loan application
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const updateLoanStatus = (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  console.log(loanId);
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

/**
 * @function repayLoan
 * @description Creates new Loan repayment
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
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

/**
 * @function getRepayments
 * @description Returns user repayment history
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const getRepayments = (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const { email } = req.user;
  // check if loan belongs to user (get user email from loan db)
  const loan = Loans.find(item => item.id === loanId);
  if (!loan) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid loan id',
    });
  }
  if (loan.user !== email) {
    return res.status(403).json({
      status: 403,
      error: 'Access forbidden',
    });
  }
  const repayments = Repayments.filter(repayment => repayment.loanId === loanId);
  return res.json({
    status: 200,
    data: repayments,
  });
};

export default {
  createLoan, getAllLoans, getSpecificLoan, updateLoanStatus, repayLoan, getRepayments,
};
