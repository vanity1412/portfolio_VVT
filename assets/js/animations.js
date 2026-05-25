(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const items = document.querySelectorAll(".fade-in-up");
        if (!items.length || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("animate-in");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        items.forEach((item) => observer.observe(item));
    });
})();
