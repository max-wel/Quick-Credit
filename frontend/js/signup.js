const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const address = document.querySelector('#address');
const password = document.querySelector('#password');
const form = document.querySelector('form');
const modal = document.querySelector('.modal');
const signupBtn = document.querySelector('.form-btn');
const apiUrl = 'https://quick-credit-max.herokuapp.com/api/v1/auth/signup';

const createModal = ({ error }) => {
  modal.innerHTML = `<p>${error}</p>`;
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000);
};

const signup = (e) => {
  e.preventDefault();
  signupBtn.textContent = 'Loading...';
  signupBtn.style.backgroundColor = '#747A80';
  // populate post body

  const body = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    address: address.value,
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
      signupBtn.textContent = 'Sign Up';
      signupBtn.style.backgroundColor = 'rgb(28, 55, 206)';
      if (response.status !== 201) {
        createModal(response);
        return;
      }
      window.localStorage.setItem('token', response.data.token);
      window.localStorage.setItem('username', response.data.firstName);
      window.location.href = 'client-dashboard.html';
    })
    .catch(error => console.log(error));
};
form.addEventListener('submit', signup);
