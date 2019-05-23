const email = document.querySelector('#email');
const forgotPasswordForm = document.querySelector('.forgot-password-form');
const modal = document.querySelector('.modal');
const successModal = document.querySelector('.modal.success-modal');
const apiUrl = 'https://quick-credit-max.herokuapp.com/api/v1/auth/forgot_password';

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

const sendResetToken = (e) => {
  e.preventDefault();
  const body = {
    email: email.value,
  };
  const request = new Request(apiUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  fetch(request).then(res => res.json())
    .then((result) => {
      if (result.status !== 200) {
        createModal(result);
        return;
      }
      createSuccessModal();
    })
    .catch(error => console.log(error));
};
forgotPasswordForm.addEventListener('submit', sendResetToken);
