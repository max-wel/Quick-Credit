const clientName = document.querySelector('.user-name');
const loanContainer = document.querySelector('.loan-container');

const getUserLoans = async () => {
  const token = window.localStorage.getItem('token');
  const currentUser = window.localStorage.getItem('username');
  if (!token) {
    window.location.href = 'login.html';
  }
  // set client name
  clientName.textContent = currentUser;

  const url = 'https://quick-credit-max.herokuapp.com/api/v1/user/loans';

  const request = new Request(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
  });
  const response = await fetch(request);
  const result = await response.json();

  const loans = result.data;
  if (loans.length === 0) {
    loanContainer.innerHTML = `<p style='font-size: 1.3em; text-align: center'>You do not have any loans</p>`;
  }
  loans.map((loan) => {
    const dateCreated = moment(loan.createdOn);
    loanContainer.innerHTML += `<div class="loan-wrapper">
        <div class="loan-date">
          <p class="loan-date__month">${dateCreated
        .format('MMM')
        .toUpperCase()} ${dateCreated.format('DD')}</p>
          <p class="loan-date__year">${dateCreated.format('YYYY')}</p>
        </div>
        <div class="loan-details">
          <div class="loan-details-row">
            <div class="loan-amount">
              <p class="text loan-amount__text">Loan Amount</p>
              <p class="loan-amount__number">&#8358;${loan.amount}</p>
            </div>
            <div class="loan-balance">
              <p class="text loan-balance__text">Balance</p>
              <p class="loan-balance__number">&#8358;${loan.balance}</p>
            </div>
          </div>
          <div class="loan-details-row">
              <div class="loan-installment">
                <p class="text loan-installment__text">Installment</p>
                <p class="loan-installment__number">&#8358;${
      loan.paymentInstallment
      }</p>
              </div>
              <div class="action"><span class="loan-status">${
      loan.status
      }</span></div>                
            <div class="action"><a href="#" class="btn-details" onclick="getHistory(${
      loan.id
      })">History</a></div>
          </div>
        </div>
      </div>`;
  });
};

const getHistory = (id) => {
  localStorage.setItem('loanId', id);
  window.location.href = 'history.html';
};

window.addEventListener('load', getUserLoans);
