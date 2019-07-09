const apiUrl = 'https://quick-credit-max.herokuapp.com/api/v1/loans?status=approved&repaid=true';
const adminName = document.querySelector('.admin-name');
const loanRecord = document.querySelector('.loans-record');
const loanTable = document.querySelector('.table-wrapper');

const getRepaidLoans = async () => {
  const token = window.localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
  adminName.textContent = window.localStorage.getItem('username');
  const request = new Request(apiUrl, {
    method: 'GET',
    headers: {
      'x-access-token': token,
    },
    mode: 'cors',
  });
  const response = await fetch(request);
  const result = await response.json();
  if (result.status !== 200) {
    window.location.href = 'login.html';
  }
  const loans = result.data;
  if (loans.length === 0) {
    loanTable.innerHTML = `<p style='font-size: 1.3em; text-align: center'>There are no repaid loans</p>`;
  }
  loans.forEach((loan) => {
    loanRecord.innerHTML += `
        <tr>
        <td class="loan-cell">${loan.firstName}</td>
        <td class="loan-cell">&#8358;${loan.amount}</td>
        <td class="loan-cell">${loan.tenor} months</td>
        <td class="loan-cell">&#8358;${loan.balance}</td>
        <td class="loan-cell">${loan.status}</td>
        <td class="loan-cell"><a href="#" class="details-link" onClick='getLoanId(${loan.id})'>Details</a></td>
        </tr>`;
  });
};

const getLoanId = (id) => {
  localStorage.setItem('loanId', id);
  window.location.href = 'details.html';
};

window.addEventListener('load', getRepaidLoans);
