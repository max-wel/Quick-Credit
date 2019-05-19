const loginForm = document.querySelector('.login-form');
const inputEmail = document.querySelector('#email');

const login = (e) => {
  e.preventDefault();
  const email = inputEmail.value;
  if (email === 'admin@gmail.com') {
    window.location.href = 'admin-dashboard.html';
  } else {
    window.location.href = 'client-dashboard.html';
  }
};
loginForm.addEventListener('submit', login);
