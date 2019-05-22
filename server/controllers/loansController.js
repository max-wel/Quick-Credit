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
    const loanResult = await pool.query('SELECT * FROM loans WHERE "userEmail" = $1 AND repaid = false', [email]);
    if (loanResult.rows[0]) {
      return res.status(400).json({
        status: 400,
        error: 'You have an unsettled loan',
      });
    }
    const query = {
      text: 'INSERT INTO loans ("userEmail", tenor, amount, "paymentInstallment", balance, interest) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, "userEmail", status, repaid, tenor, amount::float, "paymentInstallment"::float, balance::float, interest::float, "createdOn"',
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
        text: `SELECT loans.id, "firstName", "userEmail", loans.status, repaid, tenor, amount::float, "paymentInstallment"::float, balance::float, interest::float, loans."createdOn"
        FROM loans 
        JOIN users ON loans."userEmail" = users.email
        WHERE loans.status = $1 AND repaid = $2`,
        values: [status, repaid],
      };
      const result = await pool.query(query);
      return res.json({
        status: 200,
        data: result.rows,
      });
    }
    const query = {
      text: `SELECT loans.id, "firstName", "userEmail", loans.status, repaid, tenor, amount::float, "paymentInstallment"::float, balance::float, interest::float, loans."createdOn"
      FROM loans 
      JOIN users ON loans."userEmail" = users.email`,
    };
    const result = await pool.query(query);
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
    text: `SELECT loans.id, "firstName", "userEmail", loans.status, repaid, tenor, amount::float, "paymentInstallment"::float, balance::float, interest::float, loans."createdOn"
    FROM loans 
    JOIN users ON loans."userEmail" = users.email
    WHERE loans.id = $1`,
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
const updateLoanStatus = async (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const { status } = req.body;

  try {
    const loan = await pool.query('SELECT * FROM loans WHERE id = $1 ', [loanId]);
    if (!loan.rows[0]) {
      return res.status(404).json({
        status: 404,
        error: 'Loan does not exist',
      });
    }
    // check if user if verified
    const userResult = await pool.query('SELECT status FROM users WHERE email = $1', [loan.rows[0].userEmail]);
    if (userResult.rows[0].status !== 'verified') {
      return res.status(400).json({
        status: 400,
        error: 'User is not verified',
      });
    }
    // update loan status
    const query = {
      text: 'UPDATE loans SET status = $1 WHERE id = $2 RETURNING id, "userEmail", status, repaid, tenor, amount::float, "paymentInstallment"::float, balance::float, interest::float, "createdOn"',
      values: [status, loanId],
    };
    const updatedLoan = await pool.query(query);
    // get user object and send notification mail
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [updatedLoan.rows[0].userEmail]);
    mailer.sendLoanNotificationMail(user.rows[0], status);
    return res.json({
      status: 200,
      data: updatedLoan.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function repayLoan
 * @description Creates new Loan repayment
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const repayLoan = async (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const paidAmount = Number(req.body.paidAmount);

  try {
    const loan = await pool.query('SELECT id, "userEmail", status, repaid, tenor, amount::float, "paymentInstallment"::float, balance::float, interest::float, "createdOn" FROM loans WHERE id = $1', [loanId]);
    if (loan.rowCount < 1) {
      return res.status(404).json({
        status: 404,
        error: 'Loan does not exist',
      });
    }
    // check if loan has been approved
    if (loan.rows[0].status !== 'approved') {
      return res.status(400).json({
        status: 400,
        error: 'Loan is not approved',
      });
    }
    // check if loan has been repaid
    if (loan.rows[0].repaid) {
      return res.status(400).json({
        status: 400,
        error: 'Loan already repaid',
      });
    }
    // check if paidAmount exceeds balance
    if (paidAmount > loan.rows[0].balance) {
      return res.status(400).json({
        status: 400,
        error: 'Paid amount exceeds current balance',
      });
    }
    // compute new balancce
    const newBalance = Number((loan.rows[0].balance - paidAmount).toFixed(2));
    // update balance
    const updatedLoan = await pool.query('UPDATE loans SET balance = $1 WHERE id = $2 RETURNING amount::float, "paymentInstallment"::float', [newBalance, loanId]);
    // update repaid
    if (newBalance === 0) {
      await pool.query('UPDATE loans SET repaid = $1 WHERE id = $2', [true, loanId]);
    }
    // create repayment record
    const query = {
      text: 'INSERT INTO repayments ("loanId", "paidAmount", balance) VALUES ($1, $2, $3) RETURNING id, "loanId", "createdOn", "paidAmount"::float, balance::float',
      values: [loanId, paidAmount, newBalance],
    };
    const result = await pool.query(query);
    const repayment = { ...result.rows[0], ...updatedLoan.rows[0] };
    return res.status(201).json({
      status: 201,
      data: repayment,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

/**
 * @function getRepayments
 * @description Returns user repayment history
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @returns {object} JSON Response
 */
const getRepayments = async (req, res) => {
  const loanId = parseInt(req.params.id, 10);
  const { email } = req.user;
  try {
    // check if loan exists and belongs to user
    const loanResult = await pool.query('SELECT * FROM loans WHERE id = $1', [loanId]);
    const loan = loanResult.rows[0];
    if (!loan) {
      return res.status(404).json({
        status: 404,
        error: 'Loan does not exist',
      });
    }
    if (loan.userEmail !== email) {
      return res.status(403).json({
        status: 403,
        error: 'Loan does not belong to you',
      });
    }
    // get repayments
    const query = {
      text: `SELECT repayments.id, "loanId", "paidAmount"::float, repayments.balance::float, repayments."createdOn", amount::float, "paymentInstallment"::float 
      FROM repayments
      JOIN loans ON loans.id = "loanId"
      WHERE "loanId" = $1`,
      values: [loanId],
    };
    const repayments = await pool.query(query);
    return res.json({
      status: 200,
      data: repayments.rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

// get user loan
const getUserLoan = async (req, res) => {
  const { email } = req.user;
  // check if loan exists and belongs to user
  try {
    const query = {
      text: `SELECT loans.id, "userEmail", "firstName", "lastName", users.status AS "userStatus", loans.status, repaid, tenor, amount::float, "paymentInstallment"::float, balance::float, interest::float, loans."createdOn"
      FROM loans 
      JOIN users ON users.email = "userEmail"
      WHERE email = $1`,
      values: [email],
    };
    const result = await pool.query(query);
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
export default {
  createLoan, getAllLoans, getSpecificLoan, updateLoanStatus, repayLoan, getRepayments, getUserLoan,
};
