const email = document.querySelector('#email');
const password = document.querySelector('#password');
const form = document.querySelector('form');
const modal = document.querySelector('.modal');
const loginBtn = document.querySelector('.form-btn');
const apiUrl = 'https://quick-credit-max.herokuapp.com/api/v1/auth/signin';

const createModal = ({ error }) => {
  modal.innerHTML = `<p>${error}</p>`;
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000);
};

const login = (e) => {
  e.preventDefault();
  loginBtn.textContent = 'Loading...';
  loginBtn.style.backgroundColor = '#747A80';
  // populate body
  const body = {
    email: email.value,
    password: password.value,
  };
  fetch(apiUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then((response) => {
      loginBtn.textContent = 'Login';
      loginBtn.style.backgroundColor = 'rgb(28, 55, 206)';
      if (response.status !== 200) {
        createModal(response);
        return;
      }
      window.localStorage.setItem('token', response.data.token);
      window.localStorage.setItem('username', response.data.firstName);
      // check if it's admin
      if (response.data.isAdmin) {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'client-dashboard.html';
      }
    });
};
form.addEventListener('submit', login);
