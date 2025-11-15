// ============================================
// Performance Optimization
// ============================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCritical();
        
        // Debounce scroll events
        this.optimizeScroll();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Cache static assets
        this.cacheAssets();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    preloadCritical() {
        const criticalLinks = [
            '/assets/css/style.css',
            '/assets/css/blog.css',
            '/assets/js/load-components.js'
        ];

        criticalLinks.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = url.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    optimizeScroll() {
        let ticking = false;

        const optimizedScroll = () => {
            // Your scroll handlers here
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(optimizedScroll);
                ticking = true;
            }
        });
    }

    optimizeAnimations() {
        // Use will-change for animated elements
        const animatedElements = document.querySelectorAll('.blog-post-card, .btn, .card');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });

        // Clean up will-change after animation
        setTimeout(() => {
            animatedElements.forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 3000);
    }

    cacheAssets() {
        // Cache fonts
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        fonts.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url.includes('fonts.googleapis.com') ? 'https://fonts.googleapis.com' : 'https://cdnjs.cloudflare.com';
            document.head.appendChild(link);
        });
    }

    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle utility
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();
window.performanceOptimizer = performanceOptimizer;

