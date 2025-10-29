// ============================================
// Advanced Blog Search & Filtering
// ============================================

class BlogSearch {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentCategory = 'all';
        this.currentTags = [];
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.collectPosts();
        this.setupSearch();
        this.setupTagFilter();
        this.setupCategoryFilter();
    }

    collectPosts() {
        const postCards = document.querySelectorAll('.blog-post-card');
        this.posts = Array.from(postCards).map(card => ({
            element: card,
            title: card.querySelector('.post-title')?.textContent || '',
            excerpt: card.querySelector('.post-excerpt')?.textContent || '',
            category: card.getAttribute('data-category') || '',
            tags: Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.trim()),
            date: card.querySelector('.post-date')?.textContent || '',
            readTime: card.querySelector('.post-read-time')?.textContent || ''
        }));
        this.filteredPosts = [...this.posts];
    }

    setupSearch() {
        // Create search input if not exists
        let searchContainer = document.querySelector('.blog-search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'blog-search-container';
            const filters = document.querySelector('.blog-filters');
            if (filters) {
                filters.parentNode.insertBefore(searchContainer, filters);
            }
        }

        // Create search input
        let searchInput = searchContainer.querySelector('.blog-search-input');
        if (!searchInput) {
            searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'blog-search-input';
            searchInput.placeholder = 'Tìm kiếm bài viết...';
            searchContainer.appendChild(searchInput);

            // Add search icon
            const searchIcon = document.createElement('i');
            searchIcon.className = 'fas fa-search';
            searchIcon.style.position = 'absolute';
            searchIcon.style.right = '15px';
            searchIcon.style.top = '50%';
            searchIcon.style.transform = 'translateY(-50%)';
            searchIcon.style.color = '#667eea';
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(searchIcon);
        }

        // Debounce search
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filter();
            }, 300);
        });
    }

    setupTagFilter() {
        // Collect all tags
        const allTags = new Set();
        this.posts.forEach(post => {
            post.tags.forEach(tag => allTags.add(tag));
        });

        // Create tag filter UI
        const tagContainer = document.createElement('div');
        tagContainer.className = 'blog-tags-filter';
        
        const tagTitle = document.createElement('h3');
        tagTitle.textContent = 'Tags:';
        tagTitle.style.marginBottom = '1rem';
        tagTitle.style.fontSize = '1rem';
        tagContainer.appendChild(tagTitle);

        const tagList = document.createElement('div');
        tagList.className = 'tags-list';
        tagList.style.display = 'flex';
        tagList.style.flexWrap = 'wrap';
        tagList.style.gap = '0.5rem';

        allTags.forEach(tag => {
            const tagBtn = document.createElement('button');
            tagBtn.className = 'tag-filter-btn';
            tagBtn.textContent = tag;
            tagBtn.dataset.tag = tag;
            tagBtn.addEventListener('click', () => {
                tagBtn.classList.toggle('active');
                this.updateTagFilter();
            });
            tagList.appendChild(tagBtn);
        });

        tagContainer.appendChild(tagList);

        const filters = document.querySelector('.blog-filters');
        if (filters) {
            filters.parentNode.insertBefore(tagContainer, filters.nextSibling);
        }
    }

    setupCategoryFilter() {
        const categoryBtns = document.querySelectorAll('.filter-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.getAttribute('data-category') || 'all';
                this.filter();
            });
        });
    }

    updateTagFilter() {
        const activeTags = Array.from(document.querySelectorAll('.tag-filter-btn.active'))
            .map(btn => btn.dataset.tag);
        this.currentTags = activeTags;
        this.filter();
    }

    filter() {
        this.filteredPosts = this.posts.filter(post => {
            // Category filter
            if (this.currentCategory !== 'all' && post.category !== this.currentCategory) {
                return false;
            }

            // Tag filter
            if (this.currentTags.length > 0) {
                const hasTag = this.currentTags.some(tag => 
                    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
                );
                if (!hasTag) return false;
            }

            // Search query filter
            if (this.searchQuery) {
                const matchesTitle = post.title.toLowerCase().includes(this.searchQuery);
                const matchesExcerpt = post.excerpt.toLowerCase().includes(this.searchQuery);
                const matchesTags = post.tags.some(tag => 
                    tag.toLowerCase().includes(this.searchQuery)
                );
                if (!matchesTitle && !matchesExcerpt && !matchesTags) {
                    return false;
                }
            }

            return true;
        });

        this.render();
    }

    render() {
        const grid = document.querySelector('.blog-posts-grid');
        if (!grid) return;

        // Hide all posts
        this.posts.forEach(post => {
            post.element.style.display = 'none';
        });

        // Show filtered posts with animation
        if (this.filteredPosts.length === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
            this.filteredPosts.forEach((post, index) => {
                post.element.style.display = 'block';
                post.element.style.animation = `fadeInUp 0.5s ease forwards`;
                post.element.style.animationDelay = `${index * 0.1}s`;
            });
        }

        // Update results count
        this.updateResultsCount();
    }

    showNoResults() {
        let noResults = document.querySelector('.no-results');
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.style.textAlign = 'center';
            noResults.style.padding = '4rem 2rem';
            noResults.style.gridColumn = '1 / -1';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-search';
            icon.style.fontSize = '3rem';
            icon.style.color = '#667eea';
            icon.style.marginBottom = '1rem';
            icon.style.opacity = '0.5';
            noResults.appendChild(icon);

            const text = document.createElement('p');
            text.textContent = 'Không tìm thấy bài viết nào';
            text.style.fontSize = '1.2rem';
            text.style.color = '#64748b';
            noResults.appendChild(text);

            const grid = document.querySelector('.blog-posts-grid');
            if (grid) {
                grid.appendChild(noResults);
            }
        }
        noResults.style.display = 'block';
    }

    hideNoResults() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    updateResultsCount() {
        let countEl = document.querySelector('.search-results-count');
        if (!countEl) {
            countEl = document.createElement('div');
            countEl.className = 'search-results-count';
            countEl.style.marginTop = '1rem';
            countEl.style.textAlign = 'center';
            countEl.style.color = '#64748b';
            
            const filters = document.querySelector('.blog-filters');
            if (filters) {
                filters.parentNode.insertBefore(countEl, filters.nextSibling);
            }
        }

        const total = this.posts.length;
        const showing = this.filteredPosts.length;
        countEl.textContent = `Hiển thị ${showing} / ${total} bài viết`;
    }
}

// Initialize blog search when DOM is ready
if (document.querySelector('.blog-post-card')) {
    document.addEventListener('DOMContentLoaded', () => {
        const blogSearch = new BlogSearch();
        window.blogSearch = blogSearch;
    });
}

