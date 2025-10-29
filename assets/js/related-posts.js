// ============================================
// Related Posts System
// ============================================

class RelatedPosts {
    constructor() {
        this.currentPost = null;
        this.allPosts = [];
        this.init();
    }

    init() {
        // Only run on blog post pages
        const blogPost = document.querySelector('.blog-post');
        if (!blogPost) return;

        this.currentPost = this.getCurrentPostInfo();
        this.collectPosts();
        this.render();
    }

    getCurrentPostInfo() {
        const title = document.querySelector('.post-title')?.textContent || '';
        const tags = Array.from(document.querySelectorAll('.post-tags .tag'))
            .map(tag => tag.textContent.trim());
        const category = document.querySelector('.post-category')?.textContent || '';
        const url = window.location.pathname;

        return { title, tags, category, url };
    }

    collectPosts() {
        // Collect from blog.html if available
        const blogIndex = document.querySelector('.blog-post-card');
        if (blogIndex) {
            const cards = document.querySelectorAll('.blog-post-card');
            this.allPosts = Array.from(cards).map(card => ({
                title: card.querySelector('.post-title')?.textContent || '',
                url: card.querySelector('.post-title a')?.getAttribute('href') || '',
                tags: Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim()),
                category: card.getAttribute('data-category') || '',
                excerpt: card.querySelector('.post-excerpt')?.textContent || ''
            }));
        } else {
            // Hardcoded list of posts
            this.allPosts = [
                {
                    title: 'SOC là gì? Giới thiệu đơn giản về Security Operations Center',
                    url: 'posts/blue/soc-introduction.html',
                    tags: ['SOC', 'Blue Team', 'Security'],
                    category: 'blue',
                    excerpt: 'Hướng dẫn cơ bản về SOC cho người mới bắt đầu'
                },
                {
                    title: 'Blue Team: Làm gì khi bị tấn công?',
                    url: 'posts/blue/incident-response.html',
                    tags: ['Incident Response', 'Blue Team', 'Security'],
                    category: 'blue',
                    excerpt: 'Quy trình Incident Response (IR) cơ bản'
                },
                {
                    title: 'Phân biệt Red Team – Blue Team – Purple Team',
                    url: 'posts/blue/red-blue-purple-teams.html',
                    tags: ['Red Team', 'Blue Team', 'Purple Team'],
                    category: 'blue',
                    excerpt: 'Hiểu rõ vai trò của từng "màu" trong bảo mật mạng'
                },
                {
                    title: 'Brute-force Windows Login: Nhật ký SOC của sinh viên năm 3',
                    url: 'posts/blue/brute-force-windows-login.html',
                    tags: ['SOC', 'Brute Force', 'RDP', 'Incident Response'],
                    category: 'blue',
                    excerpt: 'Phát hiện và xử lý brute-force RDP trong lab SOC mini'
                },
                {
                    title: 'Beacon Detection Challenge: Nhật ký SOC của sinh viên năm 3',
                    url: 'posts/blue/beacon-detection-challenge.html',
                    tags: ['SOC', 'Beacon Detection', 'C2', 'Threat Hunting'],
                    category: 'blue',
                    excerpt: 'Phát hiện C2 beaconing patterns, correlation logs'
                },
                {
                    title: 'Ransomware Response Challenge: Nhật ký SOC của sinh viên năm 3',
                    url: 'posts/blue/ransomware-response-challenge.html',
                    tags: ['SOC', 'Ransomware', 'Incident Response', 'Threat Hunting'],
                    category: 'blue',
                    excerpt: 'Phát hiện và xử lý ransomware outbreak'
                },
                {
                    title: '10 cấu hình sai phổ biến nhất trên AWS khiến hệ thống "lộ bụng"',
                    url: 'posts/cloud/aws-misconfigurations.html',
                    tags: ['AWS', 'Cloud Security', 'Misconfiguration'],
                    category: 'cloud',
                    excerpt: 'Misconfiguration là nguyên nhân hàng đầu dẫn đến lộ lọt dữ liệu'
                },
                {
                    title: 'Tự xây dựng lab SOC mini tại nhà với Wazuh và VirtualBox',
                    url: 'posts/projects/soc-lab-wazuh.html',
                    tags: ['SOC', 'Wazuh', 'SIEM', 'Lab'],
                    category: 'projects',
                    excerpt: 'Hướng dẫn chi tiết từng bước xây dựng lab SOC'
                }
            ];
        }
    }

    findRelatedPosts() {
        if (!this.currentPost) return [];

        const related = this.allPosts
            .filter(post => {
                // Don't include current post
                if (post.url === this.currentPost.url) return false;

                // Calculate similarity score
                let score = 0;

                // Same category
                if (post.category === this.currentPost.category) {
                    score += 3;
                }

                // Common tags
                const commonTags = post.tags.filter(tag =>
                    this.currentPost.tags.some(ct => ct.toLowerCase() === tag.toLowerCase())
                );
                score += commonTags.length * 2;

                return score > 0;
            })
            .sort((a, b) => {
                // Sort by similarity score
                const scoreA = this.calculateScore(a);
                const scoreB = this.calculateScore(b);
                return scoreB - scoreA;
            })
            .slice(0, 3); // Get top 3 related posts

        return related;
    }

    calculateScore(post) {
        let score = 0;
        if (post.category === this.currentPost.category) score += 3;
        const commonTags = post.tags.filter(tag =>
            this.currentPost.tags.some(ct => ct.toLowerCase() === tag.toLowerCase())
        );
        score += commonTags.length * 2;
        return score;
    }

    render() {
        const relatedPosts = this.findRelatedPosts();
        if (relatedPosts.length === 0) return;

        const blogPost = document.querySelector('.blog-post');
        if (!blogPost) return;

        // Check if already exists
        if (document.querySelector('.related-posts')) return;

        const relatedSection = document.createElement('section');
        relatedSection.className = 'related-posts';
        relatedSection.innerHTML = `
            <div class="container">
                <h2 class="related-posts-title">
                    <i class="fas fa-book-open"></i>
                    Bài viết liên quan
                </h2>
                <div class="related-posts-grid">
                    ${relatedPosts.map(post => `
                        <article class="related-post-card">
                            <div class="post-content">
                                <h3 class="post-title">
                                    <a href="${post.url}">${this.escapeHtml(post.title)}</a>
                                </h3>
                                <p class="post-excerpt">${this.escapeHtml(post.excerpt)}</p>
                                <div class="post-tags">
                                    ${post.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                                </div>
                                <a href="${post.url}" class="read-more-btn">
                                    Đọc tiếp <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
        `;

        blogPost.appendChild(relatedSection);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize related posts
if (document.querySelector('.blog-post')) {
    document.addEventListener('DOMContentLoaded', () => {
        const relatedPosts = new RelatedPosts();
        window.relatedPosts = relatedPosts;
    });
}

