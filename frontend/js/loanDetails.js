const loanDetails = document.querySelector('.loan-details');
const clientName = document.querySelector('.repay-modal__name');
const paidAmount = document.querySelector('#repay-amount');
const repayForm = document.querySelector('form');
const approveBtn = document.querySelector('.btn-approve');
const rejectBtn = document.querySelector('.btn-reject');
const loanId = window.localStorage.getItem('loanId');
const token = window.localStorage.getItem('token');

const getLoanDetails = async () => {
  if (!token) {
    window.location.href = 'login.html';
  }
  if (!loanId) {
    window.location.href = 'admin-dashboard.html';
  }

  const url = `https://quick-credit-max.herokuapp.com/api/v1/loans/${loanId}`;
  const request = new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
  });
  const response = await fetch(request);
  const { status, error, data: loan } = await response.json();

  clientName.textContent = loan.firstName;
  if (status !== 200) {
    alert(error);
    return;
  }
  loanDetails.innerHTML = `
    <p class="username">${loan.firstName}</p>
    <div class="details-row">
      <p class="details-name">Loan Amount</p>
      <p class="details-value">&#8358;${loan.amount}</p>
    </div>
    <div class="details-row">
      <p class="details-name">Duration</p>
      <p class="details-value">${loan.tenor} months</p>
    </div>
    <div class="details-row">
      <p class="details-name">Installment</p>
      <p class="details-value">&#8358;${loan.paymentInstallment}</p>
    </div>
    <div class="details-row">
      <p class="details-name">Interest</p>
      <p class="details-value">&#8358;${loan.interest}</p>
    </div>
    <div class="details-row">
      <p class="details-name">Status</p>
      <p class="details-value" id="loan-status">${loan.status}</p>
    </div>
    <div class="details-row">
      <p class="details-name">Balance</p>
      <p class="details-value balance">&#8358;<span id="loan-balance" style='color:inherit'>${loan.balance}</span></p>
    </div>
    <div class="details-row">
      <p class="details-name">Repaid</p>
      <p class="details-value" id="loan-repaid-status">${loan.repaid ? 'YES' : 'NO'}</p>
    </div>
    `;
};

const repayLoan = async (e) => {
  e.preventDefault();
  const loanBalance = document.querySelector('#loan-balance');
  const loanRepaidStatus = document.querySelector('#loan-repaid-status');
  const url = `https://quick-credit-max.herokuapp.com/api/v1/loans/${loanId}/repayment`;
  const body = { paidAmount: paidAmount.value };
  const request = new Request(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const response = await fetch(request);
  const { status, error, data: loan } = await response.json();
  if (status !== 201) {
    alert(error);
    return;
  }
  alert('Payment Successful');
  loanBalance.textContent = loan.balance;
  loanRepaidStatus.textContent = loan.balance === 0 ? 'YES' : 'NO';
};

const handleLoanApproval = async () => {
  const loanStatus = document.querySelector('#loan-status');
  const url = `https://quick-credit-max.herokuapp.com/api/v1/loans/${loanId}`;
  const body = { status: 'approved' };
  const request = new Request(url, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const response = await fetch(request);
  const { status, error } = await response.json();
  if (status !== 200) {
    alert(error);
  }
  loanStatus.textContent = 'approved';
};

const handleLoanRejection = async () => {
  const loanStatus = document.querySelector('#loan-status');
  const url = `https://quick-credit-max.herokuapp.com/api/v1/loans/${loanId}`;
  const body = { status: 'rejected' };
  const request = new Request(url, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const response = await fetch(request);
  const { status, error } = await response.json();
  if (status !== 200) {
    alert(error);
  }
  loanStatus.textContent = 'rejected';
};

window.addEventListener('load', getLoanDetails);
repayForm.addEventListener('submit', repayLoan);
approveBtn.addEventListener('click', handleLoanApproval);
rejectBtn.addEventListener('click', handleLoanRejection);
