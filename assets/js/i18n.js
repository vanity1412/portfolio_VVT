(function () {
    // Language switching was intentionally disabled because the portfolio content is written and reviewed in Vietnamese.
    // Keeping this small shim prevents older pages from failing if they still include i18n.js.
    window.i18n = {
        getLanguage() {
            return "vi";
        },
        t(key) {
            return key;
        }
    };
})();
