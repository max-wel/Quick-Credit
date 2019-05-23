let verifyButtons = document.querySelectorAll('button');
verifyButtons = Array.from(verifyButtons);

verifyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.textContent = 'Verified';
    button.style.backgroundColor = '#371BE4';
  });
});
