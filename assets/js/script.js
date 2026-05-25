(function () {
    function qs(selector, root = document) {
        return root.querySelector(selector);
    }

    function qsa(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    }

    function initNavigation() {
        const navToggle = qs("#nav-toggle");
        const navMenu = qs("#nav-menu");
        const sidebar = qs("#sidebar");
        const sidebarToggle = qs("#sidebar-toggle");

        if (navToggle && navMenu && !navToggle.dataset.initialized) {
            navToggle.dataset.initialized = "true";
            navToggle.addEventListener("click", () => {
                const isOpen = navMenu.classList.toggle("active");
                navToggle.setAttribute("aria-expanded", String(isOpen));
            });

            qsa(".nav-link", navMenu).forEach((link) => {
                link.addEventListener("click", () => {
                    navMenu.classList.remove("active");
                    navToggle.setAttribute("aria-expanded", "false");
                });
            });
        }

        if (sidebar && sidebarToggle && !sidebarToggle.dataset.initialized) {
            sidebarToggle.dataset.initialized = "true";
            sidebarToggle.addEventListener("click", (event) => {
                event.stopPropagation();
                if (window.innerWidth > 980) {
                    sidebar.classList.toggle("hidden");
                    document.body.classList.toggle("sidebar-hidden", sidebar.classList.contains("hidden"));
                } else {
                    sidebar.classList.toggle("open");
                }
            });

            document.addEventListener("click", (event) => {
                if (window.innerWidth > 980) return;
                if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                    sidebar.classList.remove("open");
                }
            });
        }

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            if (navMenu) navMenu.classList.remove("active");
            if (navToggle) navToggle.setAttribute("aria-expanded", "false");
            if (sidebar) sidebar.classList.remove("open");
        });
    }

    function initHeaderState() {
        const header = qs("#header");
        if (!header || header.dataset.initialized) return;
        header.dataset.initialized = "true";

        const update = () => {
            header.classList.toggle("scrolled", window.scrollY > 8);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
    }

    function initSkillBars() {
        const bars = qsa(".skill-progress").filter((bar) => !bar.dataset.initialized);
        if (!bars.length) return;
        bars.forEach((bar) => {
            bar.dataset.initialized = "true";
        });

        const reveal = (bar) => {
            const width = Number(bar.dataset.width || 0);
            bar.style.width = `${Math.max(0, Math.min(width, 100))}%`;
        };

        if (!("IntersectionObserver" in window)) {
            bars.forEach(reveal);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                reveal(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        bars.forEach((bar) => observer.observe(bar));
    }

    function initFilters() {
        qsa(".filter-buttons, .blog-filters").forEach((group) => {
            if (group.dataset.initialized) return;
            group.dataset.initialized = "true";

            const buttons = qsa(".filter-btn", group);
            const scope = group.closest("section") || document;
            const cards = qsa("[data-category]", scope).filter((card) => !card.classList.contains("filter-btn"));

            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    const filter = button.dataset.filter || button.dataset.category || "all";
                    buttons.forEach((item) => item.classList.remove("active"));
                    button.classList.add("active");

                    cards.forEach((card) => {
                        const visible = filter === "all" || card.dataset.category === filter;
                        card.style.display = visible ? "" : "none";
                    });
                });
            });
        });
    }

    function initFAQ() {
        qsa(".faq-item").forEach((item) => {
            if (item.dataset.initialized) return;
            item.dataset.initialized = "true";

            const question = qs(".faq-question", item);
            if (!question) return;

            question.addEventListener("click", () => {
                const nextState = !item.classList.contains("active");
                qsa(".faq-item").forEach((faq) => faq.classList.remove("active"));
                item.classList.toggle("active", nextState);
            });
        });
    }

    function initContactForm() {
        const form = qs("#contact-form");
        if (!form || form.dataset.initialized) return;
        form.dataset.initialized = "true";

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const subject = String(formData.get("subject") || "").trim();
            const message = String(formData.get("message") || "").trim();

            if (!name || !email || !subject || !message) {
                showNotification("Vui lòng điền đủ thông tin trước khi gửi.", "error");
                return;
            }

            const body = [
                `Xin chào Thông,`,
                "",
                message,
                "",
                `Người liên hệ: ${name}`,
                `Email: ${email}`
            ].join("\n");

            const mailto = `mailto:vvthong.insec@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailto;
            showNotification("Đang mở ứng dụng email của bạn.", "success");
        });
    }

    function initRevealAnimations() {
        const elements = qsa(".card, .skill-card, .project-card, .certification-item, .method-card, .timeline-item, .blog-post-card");
        if (!elements.length || !("IntersectionObserver" in window)) return;

        const pending = elements.filter((element) => !element.dataset.revealInitialized);
        if (!pending.length) return;

        pending.forEach((element) => {
            element.dataset.revealInitialized = "true";
            element.classList.add("fade-in");
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        pending.forEach((element) => observer.observe(element));
    }

    function showNotification(message, type = "info") {
        const existing = qs(".notification");
        if (existing) existing.remove();

        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.setAttribute("role", "status");
        notification.textContent = message;
        notification.style.cssText = [
            "position:fixed",
            "right:20px",
            "bottom:20px",
            "z-index:2000",
            "max-width:min(380px,calc(100vw - 40px))",
            "padding:14px 16px",
            "border-radius:8px",
            "box-shadow:0 18px 40px rgba(16,33,47,.18)",
            `background:${type === "error" ? "#b91c1c" : type === "success" ? "#0f766e" : "#10212f"}`,
            "color:#fff",
            "font-weight:700"
        ].join(";");

        document.body.appendChild(notification);
        window.setTimeout(() => notification.remove(), 3600);
    }

    function init() {
        initNavigation();
        initHeaderState();
        initSkillBars();
        initFilters();
        initFAQ();
        initContactForm();
        initRevealAnimations();
    }

    document.addEventListener("DOMContentLoaded", init);
    window.addEventListener("components:loaded", init);
})();
