const toggle = document.querySelector('.nav-toggle');
const topNav = document.querySelector('.top-nav');
toggle.addEventListener('click', e => {
  e.preventDefault();
  topNav.classList.toggle('responsive');
})