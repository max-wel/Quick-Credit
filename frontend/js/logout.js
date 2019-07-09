const logoutBtn = document.querySelector('#logout-btn');

const handleLogout = (e) => {
  e.preventDefault();
  window.localStorage.removeItem('token');
  window.location.href = 'login.html';
};

logoutBtn.addEventListener('click', handleLogout);
