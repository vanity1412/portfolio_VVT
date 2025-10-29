// ============================================
// Dark Mode Toggle
// ============================================

class DarkMode {
    constructor() {
        this.isDark = localStorage.getItem('darkMode') === 'true' || 
                     (localStorage.getItem('darkMode') === null && 
                      window.matchMedia('(prefers-color-scheme: dark)').matches);
        this.init();
    }

    init() {
        // Apply dark mode immediately to prevent flash
        if (this.isDark) {
            document.documentElement.classList.add('dark-mode');
        }

        // Initialize toggle button
        this.setupToggle();
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                this.isDark = e.matches;
                this.toggle();
            }
        });
    }

    setupToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        
        if (!toggleBtn) return;

        // Update icon based on current state
        this.updateIcon(themeIcon);

        toggleBtn.addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.isDark = !this.isDark;
        document.documentElement.classList.toggle('dark-mode', this.isDark);
        localStorage.setItem('darkMode', this.isDark);
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            this.updateIcon(themeIcon);
        }

        // Dispatch custom event for other scripts
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { isDark: this.isDark } 
        }));
    }

    updateIcon(icon) {
        if (!icon) return;
        
        if (this.isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    getTheme() {
        return this.isDark ? 'dark' : 'light';
    }
}

// Initialize dark mode
const darkMode = new DarkMode();

// Export for use in other scripts
window.darkMode = darkMode;

