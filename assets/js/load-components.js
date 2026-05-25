(function () {
    const path = window.location.pathname.replace(/\\/g, "/");

    function depthPrefix() {
        if (path.includes("/posts/")) return "../../";
        if (path.includes("/components/")) return "../";
        return "";
    }

    function componentPath(fileName) {
        return `${depthPrefix()}${fileName}`;
    }

    function assetPath(relativePath) {
        return `${depthPrefix()}${relativePath}`;
    }

    async function injectComponent(targetId, fileName, afterInject) {
        const target = document.getElementById(targetId);
        if (!target) return;

        try {
            const response = await fetch(componentPath(fileName), { cache: "no-cache" });
            if (!response.ok) throw new Error(`${fileName}: ${response.status}`);
            target.innerHTML = await response.text();
            if (typeof afterInject === "function") afterInject(target);
        } catch (error) {
            console.error("Không thể tải component:", error);
        }
    }

    function normalizeLinks() {
        const prefix = depthPrefix();

        document.querySelectorAll("[data-root-link]").forEach((link) => {
            const target = link.getAttribute("data-root-link");
            if (target) link.setAttribute("href", `${prefix}${target}`);
        });

        document.querySelectorAll(".nav-link, .nav-logo").forEach((link) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
                return;
            }

            if (path.includes("/components/")) {
                if (href === "index.html") link.setAttribute("href", "../index.html");
                if (href === "blog.html") link.setAttribute("href", "../blog.html");
                if (href.startsWith("components/")) link.setAttribute("href", href.replace("components/", ""));
            }

            if (path.includes("/posts/")) {
                if (href === "index.html") link.setAttribute("href", "../../index.html");
                if (href === "blog.html") link.setAttribute("href", "../../blog.html");
                if (href.startsWith("components/")) link.setAttribute("href", `../../${href}`);
            }
        });

        const cvLinks = [
            document.getElementById("cv-download-link"),
            document.getElementById("nav-cv-link")
        ].filter(Boolean);

        cvLinks.forEach((link) => {
            link.setAttribute("href", assetPath("assets/CV_VuVanThong.pdf"));
        });

        const sidebarImage = document.querySelector(".sidebar-profile-img");
        if (sidebarImage) {
            sidebarImage.setAttribute("src", assetPath("assets/img/myface.jpg"));
        }
    }

    function setActiveNavLink() {
        const current = path.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const cleanHref = href.split("#")[0].split("?")[0];
            const target = cleanHref.split("/").pop() || "index.html";

            const isActive =
                (current === "" && target === "index.html") ||
                current === target ||
                (path.includes("/posts/") && target === "blog.html");

            link.classList.toggle("active", isActive);
        });
    }

    async function loadComponents() {
        await Promise.all([
            injectComponent("sidebar-placeholder", "sidebar.html"),
            injectComponent("header-placeholder", "header.html"),
            injectComponent("footer-placeholder", "footer.html")
        ]);

        normalizeLinks();
        setActiveNavLink();
        window.dispatchEvent(new CustomEvent("components:loaded"));
    }

    document.addEventListener("DOMContentLoaded", loadComponents);
})();
