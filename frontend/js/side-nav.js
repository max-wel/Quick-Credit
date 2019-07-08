const toggle = document.querySelector('.nav-toggle');
const sidePanel = document.querySelector('.side-panel');
toggle.addEventListener('click', (e) => {
  e.preventDefault();
  sidePanel.classList.toggle('responsive');
});
