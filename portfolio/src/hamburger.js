const initHamburger = () => { 
    // mobile menu
    const burgerIcon = document.querySelector('#burger');
    const navbarMenu = document.querySelector('#navbar-main');

    burgerIcon.onclick = () => {
        navbarMenu.classList.toggle('is-active');
    }
}

export {initHamburger};