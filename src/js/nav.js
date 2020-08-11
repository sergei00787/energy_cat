let btnBurger = document.querySelector(".nav__burger");
let btnCloseBurger = document.querySelector(".nav__close");
let navi = document.querySelector(".nav");

btnCloseBurger.addEventListener( "click" , toggleNav);
btnBurger.addEventListener( "click" , toggleNav);

function toggleNav() {
  btnBurger.classList.toggle("unvisible");
  btnCloseBurger.classList.toggle("unvisible");
  navi.classList.toggle("nav_unvis");
}