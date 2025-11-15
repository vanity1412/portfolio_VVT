// ============================================
// Internationalization (i18n)
// ============================================

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'vi';
        this.translations = {
            vi: {
                nav: {
                    home: 'Home',
                    about: 'About',
                    skills: 'Skills',
                    projects: 'Projects',
                    blog: 'Blog',
                    contact: 'Contact'
                },
                hero: {
                    greeting: 'Xin chào, tôi là',
                    subtitle: 'Tôi là',
                    description: 'Đại học Sư Phạm Kĩ Thuật Hồ Chí Minh - Chuyên ngành An toàn thông tin',
                    contact: 'Liên hệ ngay',
                    viewProjects: 'Xem dự án'
                },
                about: {
                    title: 'Về tôi',
                    subtitle: 'Tìm hiểu về hành trình và kinh nghiệm của tôi'
                },
                theme: {
                    light: 'Sáng',
                    dark: 'Tối'
                }
            },
            en: {
                nav: {
                    home: 'Home',
                    about: 'About',
                    skills: 'Skills',
                    projects: 'Projects',
                    blog: 'Blog',
                    contact: 'Contact'
                },
                hero: {
                    greeting: 'Hello, I am',
                    subtitle: 'I am',
                    description: 'Ho Chi Minh City University of Technology and Education - Information Security Major',
                    contact: 'Contact Now',
                    viewProjects: 'View Projects'
                },
                about: {
                    title: 'About Me',
                    subtitle: 'Learn about my journey and experience'
                },
                theme: {
                    light: 'Light',
                    dark: 'Dark'
                }
            }
        };
        this.init();
    }

    init() {
        // Set initial language
        document.documentElement.lang = this.currentLang;
        
        // Setup toggle button
        this.setupToggle();
        
        // Translate initial content
        this.translate();
    }

    setupToggle() {
        const toggleBtn = document.getElementById('lang-toggle');
        const langText = document.getElementById('lang-text');
        
        if (!toggleBtn) return;

        if (langText) {
            langText.textContent = this.currentLang.toUpperCase();
        }

        toggleBtn.addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.currentLang = this.currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('language', this.currentLang);
        document.documentElement.lang = this.currentLang;
        
        const langText = document.getElementById('lang-text');
        if (langText) {
            langText.textContent = this.currentLang.toUpperCase();
        }

        this.translate();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLang } 
        }));
    }

    translate() {
        const t = this.translations[this.currentLang];
        if (!t) return;

        // Translate navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('index.html') || href.includes('home')) {
                link.textContent = t.nav.home;
            } else if (href.includes('about')) {
                link.textContent = t.nav.about;
            } else if (href.includes('skills')) {
                link.textContent = t.nav.skills;
            } else if (href.includes('projects')) {
                link.textContent = t.nav.projects;
            } else if (href.includes('blog')) {
                link.textContent = t.nav.blog;
            } else if (href.includes('contact')) {
                link.textContent = t.nav.contact;
            }
        });

        // Translate hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const name = heroTitle.querySelector('.highlight')?.textContent || 'Vũ Văn Thông';
            heroTitle.innerHTML = `${t.hero.greeting} <span class="highlight">${name}</span> 👋`;
        }

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.innerHTML = `${t.hero.subtitle} <span class="typing-text">${this.currentLang === 'vi' ? 'Sinh viên An toàn thông tin' : 'Information Security Student'}</span>`;
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) {
            heroDescription.textContent = t.hero.description;
        }

        const contactBtn = document.querySelector('.hero-buttons .btn-primary');
        if (contactBtn) {
            contactBtn.textContent = t.hero.contact;
        }

        const projectsBtn = document.querySelector('.hero-buttons .btn-secondary');
        if (projectsBtn) {
            projectsBtn.textContent = t.hero.viewProjects;
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        for (const k of keys) {
            value = value?.[k];
        }
        return value || key;
    }

    getLanguage() {
        return this.currentLang;
    }
}

// Initialize i18n
const i18n = new I18n();

// Export for use in other scripts
window.i18n = i18n;

