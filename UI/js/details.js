const toggle = document.querySelector('.nav-toggle');
const topNav = document.querySelector('.top-nav');
// modal
const repayModal = document.querySelector('.repay-modal');
const repayButton = document.querySelector('.btn-repay');
const closeButton = document.querySelector('.close');

toggle.addEventListener('click', e => {
  e.preventDefault();
  topNav.classList.toggle('responsive');
});

repayButton.addEventListener('click', () => {
  repayModal.setAttribute('style', 'display: flex');
});
closeButton.addEventListener('click', () => {
  repayModal.setAttribute('style', 'display: none');
});
document.addEventListener ('click', event => {
  if (event.target === repayModal) {
    repayModal.setAttribute('style', 'display: none');
  }
})

