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

    /* ============================================
       Comment Widget Login Button Hiding
       ============================================ */
    function hideCommentLoginButton() {
        var commentWidget = document.querySelector('comment-widget');
        if (!commentWidget || !commentWidget.shadowRoot) {
            return;
        }

        var existing = commentWidget.shadowRoot.querySelector('#clean-theme-hide-login');
        if (existing) return;

        var style = document.createElement('style');
        style.id = 'clean-theme-hide-login';
        style.textContent =
            '.login-button,' +
            '.form__login {' +
            '    display: none !important;' +
            '}';

        commentWidget.shadowRoot.appendChild(style);
    }

    var observerTimeout = null;

    var observer = new MutationObserver(function () {
        var commentWidget = document.querySelector('comment-widget');
        if (commentWidget && commentWidget.shadowRoot) {
            hideCommentLoginButton();
            observer.disconnect();
            if (observerTimeout) {
                clearTimeout(observerTimeout);
                observerTimeout = null;
            }
        }
    });

    if (document.querySelector('comment-widget')) {
        hideCommentLoginButton();
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
        observerTimeout = setTimeout(function () {
            observer.disconnect();
        }, 10000);
    }

})();
