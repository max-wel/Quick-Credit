const loanDetails = document.querySelector('.loan-details');
const clientName = document.querySelector('.repay-modal__name');
const paidAmount = document.querySelector('#repay-amount');
const repayForm = document.querySelector('form');
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
      'x-access-token': token,
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
      <p class="details-value">${loan.status}</p>
    </div>
    <div class="details-row">
      <p class="details-name">Balance</p>
      <p class="details-value balance">&#8358;${loan.balance}</p>
    </div>
    <div class="details-row">
      <p class="details-name">Repaid</p>
      <p class="details-value">${loan.repaid ? 'YES' : 'NO'}</p>
    </div>
    `;
};

const repayLoan = async (e) => {
  e.preventDefault();
  const url = `https://quick-credit-max.herokuapp.com/api/v1/loans/${loanId}/repayment`;
  const body = { paidAmount: paidAmount.value };
  const request = new Request(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const response = await fetch(request);
  const { status, error } = await response.json();
  if (status !== 201) {
    alert(error);
    return;
  }
  alert('Payment Successful');
};

window.addEventListener('load', getLoanDetails);
repayForm.addEventListener('submit', repayLoan);
