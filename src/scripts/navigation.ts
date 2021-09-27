const hamburgerMenu = document.getElementsByClassName("navigation__hamburger")[0];
const hamburgerOverlay = document.getElementsByClassName("navigation__overlay")[0];
hamburgerMenu.addEventListener("click", openHamburgerMenu);

function openHamburgerMenu() {
    hamburgerMenu.classList.toggle("navigation__hamburger--open");
    hamburgerOverlay.classList.toggle("navigation__overlay--open");
}

export { hamburgerMenu }