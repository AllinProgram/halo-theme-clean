(function () {
    'use strict';

    /* ============================================
       Header Menu Scroll Overflow Detection
       ============================================ */
    function checkMenuOverflow() {
        var scrollMenus = document.querySelectorAll('.header-menu-scroll');
        scrollMenus.forEach(function (menu) {
            if (menu.scrollWidth > menu.clientWidth) {
                menu.classList.add('has-overflow');
            } else {
                menu.classList.remove('has-overflow');
            }
        });
    }

    // Initial check
    checkMenuOverflow();

    // Re-check on window resize
    window.addEventListener('resize', checkMenuOverflow);

    // Re-check on DOM changes (e.g., dynamic menu items)
    var menuObserver = new MutationObserver(checkMenuOverflow);
    var headerMenu = document.querySelector('.header-menu-scroll');
    if (headerMenu) {
        menuObserver.observe(headerMenu, { childList: true, subtree: true });
    }



})();
