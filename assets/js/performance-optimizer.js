(function () {
    function initLazyImages() {
        const images = Array.from(document.querySelectorAll("img[data-src]"));
        if (!images.length) return;

        if (!("IntersectionObserver" in window)) {
            images.forEach((image) => {
                image.src = image.dataset.src;
                image.removeAttribute("data-src");
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const image = entry.target;
                image.src = image.dataset.src;
                image.removeAttribute("data-src");
                observer.unobserve(image);
            });
        }, { rootMargin: "200px" });

        images.forEach((image) => observer.observe(image));
    }

    document.addEventListener("DOMContentLoaded", initLazyImages);
})();
