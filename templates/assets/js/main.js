(function () {
    'use strict';

    /* ============================================
       Dark Mode Toggle
       ============================================ */
    var THEME_KEY = 'theme-preference';

    function getThemePreference() {
        var stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var icon = document.querySelector('.theme-toggle-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '\u2600' : '\u263E';
        }
    }

    window.toggleTheme = function () {
        var current = getThemePreference();
        var next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    };

    applyTheme(getThemePreference());

    /* ============================================
       Back to Top Button
       ============================================ */
    window.scrollToTop = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    var backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        var scrollThreshold = 300;
        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (window.scrollY > scrollThreshold) {
                        backToTopBtn.classList.add('visible');
                    } else {
                        backToTopBtn.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
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
