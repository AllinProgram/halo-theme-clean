(function () {
    'use strict';

    // 隐藏评论组件中的登录按钮
    function hideCommentLoginButton() {
        const commentWidget = document.querySelector('comment-widget');
        if (!commentWidget || !commentWidget.shadowRoot) {
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            /* 隐藏登录按钮，需根据实际类名调整 */
            /* 建议通过浏览器开发者工具(F12)查看评论组件中登录按钮的具体类名后替换下方选择器 */
            .login-button,
            .form__login,
            [class*="login"] {
                display: none !important;
            }
        `;

        // 向 comment-widget 的 shadowRoot 注入样式
        commentWidget.shadowRoot.appendChild(style);
    }

    // 监听评论组件渲染（Shadow DOM 异步加载）
    const observer = new MutationObserver(function (mutations) {
        const commentWidget = document.querySelector('comment-widget');
        if (commentWidget && commentWidget.shadowRoot) {
            hideCommentLoginButton();
            observer.disconnect();
        }
    });

    if (document.querySelector('comment-widget')) {
        hideCommentLoginButton();
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
