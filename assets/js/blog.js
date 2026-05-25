(function () {
    function qs(selector, root = document) {
        return root.querySelector(selector);
    }

    function qsa(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    }

    function initBlogFilters() {
        qsa(".blog-filters").forEach((group) => {
            if (group.dataset.blogInitialized) return;
            group.dataset.blogInitialized = "true";

            const buttons = qsa(".filter-btn", group);
            const cards = qsa(".blog-post-card");

            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    const category = button.dataset.category || "all";
                    buttons.forEach((item) => item.classList.remove("active"));
                    button.classList.add("active");

                    cards.forEach((card) => {
                        const visible = category === "all" || card.dataset.category === category;
                        card.style.display = visible ? "" : "none";
                    });
                });
            });
        });
    }

    function slugify(text) {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || "section";
    }

    function cleanDisplayText(text) {
        return text
            .replace(/\s*#$/g, "")
            .replace(/^[^\p{L}\p{N}]+/u, "")
            .trim();
    }

    function uniqueId(base) {
        let id = base;
        let index = 2;
        while (document.getElementById(id)) {
            id = `${base}-${index}`;
            index += 1;
        }
        return id;
    }

    function wrapWideContent(content) {
        qsa("pre", content).forEach((pre) => {
            if (pre.parentElement && pre.parentElement.classList.contains("code-scroll")) return;
            const wrapper = document.createElement("div");
            wrapper.className = "code-scroll";
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
        });

        qsa("table", content).forEach((table) => {
            if (table.parentElement && table.parentElement.classList.contains("table-scroll")) return;
            const wrapper = document.createElement("div");
            wrapper.className = "table-scroll";
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    function createArticleTools(content, headings) {
        if (qs(".article-tools")) return;

        const tools = document.createElement("div");
        tools.className = "article-tools";
        tools.setAttribute("aria-label", "Công cụ đọc bài");

        if (headings.length >= 3) {
            const toc = document.createElement("nav");
            toc.className = "article-toc";
            toc.setAttribute("aria-label", "Mục lục bài viết");

            const title = document.createElement("div");
            title.className = "article-toc-title";
            title.textContent = "Mục lục";

            const list = document.createElement("ol");
            list.className = "article-toc-list";

            headings.forEach((heading) => {
                const item = document.createElement("li");
                item.className = `toc-level-${heading.tagName === "H3" ? "3" : "2"}`;
                const link = document.createElement("a");
                link.href = `#${heading.id}`;
                link.textContent = heading.dataset.tocTitle || cleanDisplayText(heading.innerText);
                link.addEventListener("click", () => {
                    qsa(".article-toc a").forEach((itemLink) => itemLink.classList.remove("active"));
                    link.classList.add("active");
                });
                item.appendChild(link);
                list.appendChild(item);
            });

            toc.append(title, list);
            tools.appendChild(toc);
        }

        const actions = document.createElement("div");
        actions.className = "article-actions";

        const copy = document.createElement("button");
        copy.className = "article-action-btn";
        copy.type = "button";
        copy.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i><span>Sao chép link</span>';
        copy.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(window.location.href.split("#")[0]);
                copy.classList.add("copied");
                copy.querySelector("span").textContent = "Đã sao chép";
                window.setTimeout(() => {
                    copy.classList.remove("copied");
                    copy.querySelector("span").textContent = "Sao chép link";
                }, 1800);
            } catch (error) {
                copy.querySelector("span").textContent = "Copy không thành công";
            }
        });

        const top = document.createElement("button");
        top.className = "article-action-btn";
        top.type = "button";
        top.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i><span>Lên đầu</span>';
        top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

        actions.append(copy, top);
        tools.appendChild(actions);
        content.parentElement.insertBefore(tools, content);
    }

    function initTocHighlight(headings) {
        const links = qsa(".article-toc a");
        if (!headings.length || !links.length) return;

        const linkById = new Map(
            links.map((link) => [decodeURIComponent(link.hash.replace("#", "")), link])
        );

        let ticking = false;
        const setActive = (id) => {
            links.forEach((link) => link.classList.toggle("active", linkById.get(id) === link));
        };

        const update = () => {
            const headerHeight = Number.parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue("--header-height")
            ) || 72;
            const triggerLine = headerHeight + 90;
            let current = headings[0].id;

            headings.forEach((heading) => {
                if (heading.getBoundingClientRect().top <= triggerLine) {
                    current = heading.id;
                }
            });

            setActive(current);
            ticking = false;
        };

        const schedule = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
    }

    function initHeadingAnchors(content) {
        const headings = qsa("h2, h3", content).filter((heading) => heading.innerText.trim());
        headings.forEach((heading) => {
            heading.dataset.tocTitle = cleanDisplayText(heading.innerText);
            if (!heading.id) heading.id = uniqueId(slugify(heading.innerText));
            if (qs(".heading-anchor", heading)) return;

            const anchor = document.createElement("a");
            anchor.className = "heading-anchor";
            anchor.href = `#${heading.id}`;
            anchor.setAttribute("aria-label", "Liên kết tới mục này");
            anchor.textContent = "#";
            heading.appendChild(anchor);
        });

        return headings;
    }

    function initReadingProgress(content) {
        if (qs(".reading-progress")) return;

        const progress = document.createElement("div");
        progress.className = "reading-progress";
        progress.setAttribute("aria-hidden", "true");
        progress.innerHTML = '<span class="reading-progress-bar"></span>';
        document.body.appendChild(progress);

        const bar = qs(".reading-progress-bar", progress);
        const update = () => {
            const rect = content.getBoundingClientRect();
            const total = content.offsetHeight - window.innerHeight;
            const read = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
            const percent = total <= 0 ? 100 : (read / total) * 100;
            bar.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
    }

    function initArticleEnhancements() {
        const content = qs(".blog-post > .container > .post-content");
        if (!content || content.dataset.articleEnhanced) return;
        content.dataset.articleEnhanced = "true";

        const postTitle = qs(".post-header .post-title");
        if (postTitle && !postTitle.dataset.cleanedTitle) {
            postTitle.dataset.cleanedTitle = "true";
            postTitle.textContent = cleanDisplayText(postTitle.textContent);
        }

        wrapWideContent(content);
        const headings = initHeadingAnchors(content);
        createArticleTools(content, headings);
        initTocHighlight(headings);
        initReadingProgress(content);

        qsa(".share-btn.copy").forEach((button) => {
            if (button.dataset.copyInitialized) return;
            button.dataset.copyInitialized = "true";
            button.addEventListener("click", async (event) => {
                event.preventDefault();
                try {
                    await navigator.clipboard.writeText(window.location.href.split("#")[0]);
                    button.classList.add("copied");
                    window.setTimeout(() => button.classList.remove("copied"), 1400);
                } catch (error) {
                    button.setAttribute("title", "Không thể sao chép link");
                }
            });
        });
    }

    function init() {
        initBlogFilters();
        initArticleEnhancements();
    }

    document.addEventListener("DOMContentLoaded", init);
    window.addEventListener("components:loaded", init);
})();
