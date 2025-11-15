// ============================================
// Portfolio Animations & Custom Cursor
// ============================================

(function() {
    'use strict';

    // Check if device is desktop
    const isDesktop = window.innerWidth > 768;

    // ============================================
    // Custom Cursor - Enhanced Style
    // ============================================
    class CustomCursor {
        constructor() {
            if (!isDesktop) return;
            
            this.cursor = null;
            this.cursorDot = null;
            this.cursorParticles = [];
            this.init();
        }

        init() {
            // Create cursor elements
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            
            this.cursorDot = document.createElement('div');
            this.cursorDot.className = 'cursor-dot';
            
            // Create glow effect
            const cursorGlow = document.createElement('div');
            cursorGlow.className = 'cursor-glow';
            
            document.body.appendChild(cursorGlow);
            document.body.appendChild(this.cursor);
            document.body.appendChild(this.cursorDot);
            
            // Hide default cursor
            document.body.style.cursor = 'none';
            
            // Initialize movement
            this.moveCursor();
            this.handleHover();
            this.createParticles();
        }

        createParticles() {
            // Create floating particles around cursor
            for (let i = 0; i < 6; i++) {
                const particle = document.createElement('div');
                particle.className = 'cursor-particle';
                particle.style.setProperty('--delay', i * 0.1 + 's');
                document.body.appendChild(particle);
                this.cursorParticles.push(particle);
            }
        }

        moveCursor() {
            let mouseX = 0;
            let mouseY = 0;
            let cursorX = 0;
            let cursorY = 0;
            let dotX = 0;
            let dotY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            const animate = () => {
                // Smooth follow for cursor ring
                cursorX += (mouseX - cursorX) * 0.12;
                cursorY += (mouseY - cursorY) * 0.12;
                
                // Faster follow for cursor dot
                dotX += (mouseX - dotX) * 0.4;
                dotY += (mouseY - dotY) * 0.4;
                
                if (this.cursor && this.cursorDot) {
                    this.cursor.style.left = cursorX + 'px';
                    this.cursor.style.top = cursorY + 'px';
                    
                    this.cursorDot.style.left = dotX + 'px';
                    this.cursorDot.style.top = dotY + 'px';
                    
                    // Update glow position
                    const glow = document.querySelector('.cursor-glow');
                    if (glow) {
                        glow.style.left = cursorX + 'px';
                        glow.style.top = cursorY + 'px';
                    }
                    
                    // Update particles position
                    this.cursorParticles.forEach((particle, i) => {
                        const angle = (i / this.cursorParticles.length) * Math.PI * 2;
                        const radius = 20;
                        const offsetX = Math.cos(angle + Date.now() * 0.001) * radius;
                        const offsetY = Math.sin(angle + Date.now() * 0.001) * radius;
                        particle.style.left = (cursorX + offsetX) + 'px';
                        particle.style.top = (cursorY + offsetY) + 'px';
                    });
                }
                
                requestAnimationFrame(animate);
            };
            animate();
        }

        handleHover() {
            const interactiveElements = document.querySelectorAll(
                'a, button, .btn, input, textarea, select, [role="button"], .project-card, .skill-item, .blog-post-card, .skill-preview-item, .project-preview-card, .stat'
            );

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    if (this.cursor) this.cursor.classList.add('cursor-hover');
                    if (this.cursorDot) this.cursorDot.classList.add('cursor-hover');
                    const glow = document.querySelector('.cursor-glow');
                    if (glow) glow.classList.add('cursor-hover');
                });
                
                el.addEventListener('mouseleave', () => {
                    if (this.cursor) this.cursor.classList.remove('cursor-hover');
                    if (this.cursorDot) this.cursorDot.classList.remove('cursor-hover');
                    const glow = document.querySelector('.cursor-glow');
                    if (glow) glow.classList.remove('cursor-hover');
                });
            });
        }
    }

    // ============================================
    // Scroll Animations
    // ============================================
    class ScrollAnimations {
        constructor() {
            this.init();
        }

        init() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 100);
                    }
                });
            }, observerOptions);

            // Observe elements
            const animateElements = document.querySelectorAll(
                '.about-preview, .skills-preview, .projects-preview, .skill-preview-item, .project-preview-card, .stat, section, .about-preview-text, .about-preview-stats'
            );

            animateElements.forEach(el => {
                el.classList.add('fade-in-up');
                observer.observe(el);
            });
        }
    }

    // ============================================
    // Parallax Effect
    // ============================================
    class ParallaxEffect {
        constructor() {
            this.init();
        }

        init() {
            const parallaxElements = document.querySelectorAll('.hero, .page-header');
            
            if (parallaxElements.length === 0) return;

            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const scrolled = window.pageYOffset;
                        
                        parallaxElements.forEach(el => {
                            const speed = parseFloat(el.dataset.speed) || 0.3;
                            el.style.transform = `translateY(${scrolled * speed}px)`;
                        });
                        
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }

    // ============================================
    // Animated Background - Mesh Gradient
    // ============================================
    class AnimatedBackground {
        constructor() {
            this.init();
        }

        init() {
            this.createBackground();
        }

        createBackground() {
            // Create animated gradient background
            const bg = document.createElement('div');
            bg.className = 'animated-background';
            document.body.insertBefore(bg, document.body.firstChild);
            
            // Create multiple gradient layers for depth
            for (let i = 0; i < 3; i++) {
                const layer = document.createElement('div');
                layer.className = 'bg-layer';
                layer.style.setProperty('--layer-index', i);
                layer.style.setProperty('--delay', i * 5 + 's');
                bg.appendChild(layer);
            }
        }
    }

    // ============================================
    // Smooth Page Transitions
    // ============================================
    class PageTransitions {
        constructor() {
            this.init();
        }

        init() {
            const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Skip external links
                    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) {
                        return;
                    }
                    
                    // Lưu trạng thái audio trước khi chuyển trang
                    if (window.globalAudioPlayer && window.globalAudioPlayer.audio) {
                        window.globalAudioPlayer.saveStateBeforeUnload();
                    }
                    
                    e.preventDefault();
                    
                    // Fade out
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.3s ease';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                });
            });
            
            // Fade in on page load
            window.addEventListener('load', () => {
                document.body.style.opacity = '0';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                    document.body.style.transition = 'opacity 0.5s ease';
                }, 50);
            });
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize custom cursor
        new CustomCursor();
        
        // Initialize scroll animations
        new ScrollAnimations();
        
        // Initialize parallax
        new ParallaxEffect();
        
        // Initialize animated background
        new AnimatedBackground();
        
        // Initialize page transitions
        new PageTransitions();
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth <= 768) {
                document.body.style.cursor = 'auto';
            } else {
                document.body.style.cursor = 'none';
            }
        }, 250);
    });

})();

