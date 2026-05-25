(function () {
    const storageKey = "portfolio-theme";

    function prefersDark() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function currentTheme() {
        return localStorage.getItem(storageKey) || (prefersDark() ? "dark" : "light");
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        document.documentElement.classList.toggle("dark-mode", isDark);
        document.documentElement.dataset.theme = theme;

        const icon = document.getElementById("theme-icon");
        if (icon) {
            icon.classList.toggle("fa-moon", !isDark);
            icon.classList.toggle("fa-sun", isDark);
        }
    }

    function setupToggle() {
        const button = document.getElementById("theme-toggle");
        if (!button || button.dataset.initialized) return;
        button.dataset.initialized = "true";

        button.addEventListener("click", () => {
            const nextTheme = document.documentElement.classList.contains("dark-mode") ? "light" : "dark";
            localStorage.setItem(storageKey, nextTheme);
            applyTheme(nextTheme);
        });
    }

    applyTheme(currentTheme());
    document.addEventListener("DOMContentLoaded", setupToggle);
    window.addEventListener("components:loaded", setupToggle);
})();
