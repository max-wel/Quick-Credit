const apiUrl = 'https://quick-credit-max.herokuapp.com/api/v1/users';
const adminName = document.querySelector('.admin-name');
const userRecords = document.querySelector('tbody');
const usersTable = document.querySelector('.table-wrapper');
const token = window.localStorage.getItem('token');

const checkUserVerification = (status) => {
  if (status === 'verified') {
    return `'background-color: blue'`;
  }
};
const getUsers = async () => {
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
  const users = result.data;
  if (users.length === 0) {
    usersTable.innerHTML = `<p style='font-size: 1.3em; text-align: center'>There are no users yet</p>`;
  }
  users.forEach((user) => {
    const { id, firstName, email, address, status } = user;
    userRecords.innerHTML += `
    <tr>
    <td class="client-cell"><span>${firstName}</span></td>
    <td class="client-cell">${email}</td>
    <td class="client-cell">${address}</td>
    <td class="client-cell client-table__verify">
    <button id='btn${id}' style=${checkUserVerification(status)} 
    onclick="handleUserVerification('${email}', ${id})">
    ${status === 'verified' ? 'Verified' : 'Verify'}
    </button>
    </td>
  </tr > `;
  });
};

const handleUserVerification = async (email, id) => {
  const url = `https://quick-credit-max.herokuapp.com/api/v1/users/${email}/verify`;
  const body = { status: 'verified' };
  const request = new Request(url, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'x-access-token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const response = await fetch(request);
  const { status, error, data } = await response.json();
  if (status !== 200) {
    alert(error);
    return;
  }
  const verifyBtn = document.querySelector(`#btn${id}`);
  verifyBtn.style.backgroundColor = 'blue';
  verifyBtn.textContent = 'Verified';
  console.log(data);
};

window.addEventListener('load', getUsers);
