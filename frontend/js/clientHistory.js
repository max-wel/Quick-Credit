const clientName = document.querySelector('.user-name');
const repaymentsContainer = document.querySelector('.repayments-container');

const getRepaymentHistory = async () => {
  const token = window.localStorage.getItem('token');
  const loanId = window.localStorage.getItem('loanId');
  const currentUser = window.localStorage.getItem('username');
  if (!token) {
    window.location.href = 'login.html';
  }
  if (!loanId) {
    window.location.href = 'client-dashboard.html';
  }
  // set client name
  clientName.textContent = currentUser;

  const url = `https://quick-credit-max.herokuapp.com/api/v1/loans/${loanId}/repayments`;

  const request = new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
  });
  const response = await fetch(request);
  const result = await response.json();
  const repayments = result.data;

  if (repayments.length === 0) {
    repaymentsContainer.innerHTML = `<p style='font-size: 1.3em; text-align: center'>You do not have any repayments</p>`;
  }

  repayments.map((repayment) => {
    const dateCreated = moment(repayment.createdOn);
    repaymentsContainer.innerHTML += `<div class="loan-wrapper">
    <div class="loan-date">
      <p class="loan-date__month">${dateCreated
        .format('MMM')
        .toUpperCase()} ${dateCreated.format('DD')}</p>
      <p class="loan-date__year">${dateCreated.format('YYYY')}</p>
    </div>

    <div class="loan-details">
      <div class="loan-details-row">
        <div class="loan-history-balance">
          <p class="text loan-balance__text">Balance</p>
          <p class="loan-balance__number">&#8358;${repayment.balance}</p>
        </div>
        <div class="loan-repaid">
          <p class="text loan-repaid__text">Paid</p>
          <p class="loan-repaid__number">&#8358;${repayment.paidAmount}</p>
        </div>
      </div>
    </div>
  </div>`;
  });
};

window.addEventListener('load', getRepaymentHistory);
