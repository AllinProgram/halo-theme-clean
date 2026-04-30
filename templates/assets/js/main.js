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

    applyTheme(getThemePreference());

    var toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            var current = getThemePreference();
            var next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
        });
    }

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
       Archives Table of Contents
       ============================================ */
    function initArchivesTOC() {
        var tocList = document.getElementById('toc-list');
        var tocToggle = document.getElementById('toc-toggle');
        var tocNav = document.getElementById('toc-nav');
        
        if (!tocList || !tocToggle || !tocNav) return;
        
        // Find all headings in archives content
        var archivesContent = document.querySelector('.archives-content');
        if (!archivesContent) return;
        
        var headings = archivesContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            var tocAside = document.getElementById('archives-toc');
            if (tocAside) tocAside.style.display = 'none';
            return;
        }
        
        // Generate TOC items
        headings.forEach(function(heading, index) {
            // Ensure heading has an ID for linking
            if (!heading.id) {
                heading.id = 'heading-' + index;
            }
            
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + heading.id;
            a.textContent = heading.textContent;
            a.className = 'toc-' + heading.tagName.toLowerCase();
            
            // Smooth scroll on click
            a.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.getElementById(heading.id);
                if (target) {
                    var headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 48;
                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
            
            li.appendChild(a);
            tocList.appendChild(li);
        });
        
        // Toggle TOC visibility
        tocToggle.addEventListener('click', function() {
            tocNav.classList.toggle('collapsed');
            tocToggle.classList.toggle('collapsed');
        });
        
        // Highlight current section on scroll
        var tocLinks = tocList.querySelectorAll('a');
        var headingElements = Array.from(headings);
        
        function highlightCurrentSection() {
            var scrollPosition = window.scrollY;
            var headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 48;
            
            var currentHeading = null;
            for (var i = headingElements.length - 1; i >= 0; i--) {
                var heading = headingElements[i];
                var headingTop = heading.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                if (scrollPosition >= headingTop) {
                    currentHeading = heading;
                    break;
                }
            }
            
            tocLinks.forEach(function(link) {
                link.classList.remove('active');
            });
            
            if (currentHeading) {
                var activeLink = tocList.querySelector('a[href="#' + currentHeading.id + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                    // Scroll TOC to show active link
                    activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        }
        
        // Throttle scroll event
        var scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(highlightCurrentSection);
        });
        
        // Initial highlight
        highlightCurrentSection();
    }
    
    // Initialize TOC when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initArchivesTOC);
    } else {
        initArchivesTOC();
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
