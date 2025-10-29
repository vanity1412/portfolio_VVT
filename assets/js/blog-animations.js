// ============================================
// Blog Post Animations
// ============================================

class BlogAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Fade in animation for blog posts
        this.fadeInPosts();
        
        // Stagger animation for cards
        this.staggerCards();
        
        // Scroll reveal animations
        this.scrollReveal();
        
        // Parallax effect for post headers
        this.parallaxHeader();
    }

    fadeInPosts() {
        const posts = document.querySelectorAll('.blog-post-card');
        posts.forEach((post, index) => {
            post.style.opacity = '0';
            post.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    staggerCards() {
        const cards = document.querySelectorAll('.blog-post-card, .related-post-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });
    }

    scrollReveal() {
        const elements = document.querySelectorAll('.post-content h2, .post-content h3, .post-content .alert-box, .post-content .workflow-steps');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                        entry.target.style.opacity = '1';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        elements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    parallaxHeader() {
        const header = document.querySelector('.post-header, .blog-hero');
        if (!header) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            header.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialize blog animations
if (document.querySelector('.blog-post-card') || document.querySelector('.blog-post')) {
    document.addEventListener('DOMContentLoaded', () => {
        const blogAnimations = new BlogAnimations();
        window.blogAnimations = blogAnimations;
    });
}

