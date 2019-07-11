const loanForm = document.querySelector('form');
const loanAmount = document.querySelector('#loan-amount');
const loanDuration = document.querySelector('#loan-duration');
const clientName = document.querySelector('.user-name');
const modal = document.querySelector('.modal');
const url = 'https://quick-credit-max.herokuapp.com/api/v1/loans';
const token = window.localStorage.getItem('token');

const createModal = ({ error }) => {
  modal.innerHTML = `<p>${error}</p>`;
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000);
};

const loanApply = async (e) => {
  e.preventDefault();
  const body = {
    amount: loanAmount.value,
    tenor: loanDuration.value,
  };
  const request = new Request(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // make post request
  const response = await fetch(request);
  const result = await response.json();
  if (result.status !== 201) {
    createModal(result);
    return;
  }
  window.location.href = 'client-dashboard.html';
};

const displayUsername = () => {
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  const currentUser = localStorage.getItem('username');
  clientName.textContent = currentUser;
};

window.addEventListener('load', displayUsername);
loanForm.addEventListener('submit', loanApply);
