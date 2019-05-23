const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');
const resetPasswordForm = document.querySelector('.reset-password-form');
const modal = document.querySelector('.modal');
const successModal = document.querySelector('.modal.success-modal');
const apiUrl = 'https://quick-credit-max.herokuapp.com/api/v1/auth/reset_password';

// get reset token
const urlParams = new URLSearchParams(window.location.search);
const resetToken = urlParams.get('reset_token');

const createModal = ({ error }) => {
  modal.innerHTML = `<p>${error}</p>`;
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 5000);
};

const createSuccessModal = () => {
  successModal.innerHTML = '<p>Password reset mail sent. Please check email</p>';
  successModal.style.display = 'block';
  successModal.style.backgroundColor = '#00FC18';
  setTimeout(() => {
    successModal.style.display = 'none';
  }, 5000);
};

const resetPassword = (e) => {
  e.preventDefault();
  const body = {
    password: password.value,
    confirmPassword: confirmPassword.value,
  };
  const request = new Request(`${apiUrl}/${resetToken}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  fetch(request).then(res => res.json())
    .then((result) => {
      console.log('here');
      if (result.status !== 200) {
        createModal(result);
        return;
      }
      createSuccessModal();
    })
    .catch(error => console.log(error));
};

resetPasswordForm.addEventListener('submit', resetPassword);
