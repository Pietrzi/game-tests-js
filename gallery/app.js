const bigPic = document.querySelector('#big');
const imgs = document.querySelector('.imgs');
const img = document.querySelectorAll('.imgs img');
const opacity = 0.6;


img[0].style.opacity = opacity;

imgs.addEventListener('click', imgClick);

function imgClick(e) {

  img.forEach(img => (img.style.opacity = 1));
  bigPic.src = e.target.src;
  bigPic.classList.add('fade-in');
  setTimeout(() => bigPic.classList.remove('fade-in'), 500);
  e.target.style.opacity = opacity;
}
