// ============================================
// RSS Feed Generator
// ============================================

class RSSFeed {
    constructor() {
        this.baseUrl = window.location.origin;
        this.init();
    }

    init() {
        // Create RSS link in blog page
        if (document.querySelector('.blog-hero')) {
            this.createRSSLink();
        }

        // Generate RSS feed
        this.generateFeed();
    }

    createRSSLink() {
        const blogHero = document.querySelector('.blog-hero-content');
        if (!blogHero) return;

        // Check if link already exists
        if (document.querySelector('.rss-link')) return;

        const rssLink = document.createElement('a');
        rssLink.href = 'feed.xml';
        rssLink.className = 'rss-link';
        rssLink.innerHTML = '<i class="fas fa-rss"></i> RSS Feed';
        rssLink.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            transition: all 0.3s ease;
        `;

        rssLink.addEventListener('mouseenter', () => {
            rssLink.style.background = 'rgba(255, 255, 255, 0.3)';
        });

        rssLink.addEventListener('mouseleave', () => {
            rssLink.style.background = 'rgba(255, 255, 255, 0.2)';
        });

        blogHero.appendChild(rssLink);
    }

    generateFeed() {
        const posts = this.getPosts();
        const rssXml = this.buildRSS(posts);

        // Store RSS feed in localStorage for access
        localStorage.setItem('rss_feed', rssXml);

        // Create download link
        this.createDownloadLink(rssXml);
    }

    getPosts() {
        // Collect posts from blog.html or use hardcoded list
        const posts = [];
        const postCards = document.querySelectorAll('.blog-post-card');

        if (postCards.length > 0) {
            postCards.forEach(card => {
                const title = card.querySelector('.post-title')?.textContent || '';
                const link = card.querySelector('.post-title a')?.getAttribute('href') || '';
                const description = card.querySelector('.post-excerpt')?.textContent || '';
                const date = card.querySelector('.post-date')?.textContent || '';
                const category = card.getAttribute('data-category') || '';

                posts.push({
                    title: title.trim(),
                    link: this.baseUrl + '/' + link,
                    description: description.trim(),
                    date: this.parseDate(date),
                    category: category
                });
            });
        } else {
            // Hardcoded posts list
            posts.push(
                {
                    title: 'SOC là gì? Giới thiệu đơn giản về Security Operations Center',
                    link: this.baseUrl + '/posts/blue/soc-introduction.html',
                    description: 'Hướng dẫn cơ bản về SOC cho người mới bắt đầu',
                    date: new Date('2025-10-29'),
                    category: 'blue'
                },
                {
                    title: 'Blue Team: Làm gì khi bị tấn công?',
                    link: this.baseUrl + '/posts/blue/incident-response.html',
                    description: 'Quy trình Incident Response (IR) cơ bản - 6 bước vàng',
                    date: new Date('2025-10-28'),
                    category: 'blue'
                },
                {
                    title: 'Phân biệt Red Team – Blue Team – Purple Team',
                    link: this.baseUrl + '/posts/blue/red-blue-purple-teams.html',
                    description: 'Hiểu rõ vai trò của từng "màu" trong bảo mật mạng',
                    date: new Date('2025-10-27'),
                    category: 'blue'
                },
                {
                    title: 'Brute-force Windows Login: Nhật ký SOC của sinh viên năm 3',
                    link: this.baseUrl + '/posts/blue/brute-force-windows-login.html',
                    description: 'Phát hiện và xử lý brute-force RDP trong lab SOC mini',
                    date: new Date('2025-10-30'),
                    category: 'blue'
                },
                {
                    title: 'Beacon Detection Challenge: Nhật ký SOC của sinh viên năm 3',
                    link: this.baseUrl + '/posts/blue/beacon-detection-challenge.html',
                    description: 'Phát hiện C2 beaconing patterns, correlation logs từ DNS, HTTP/TLS, EDR, NetFlow',
                    date: new Date('2025-10-31'),
                    category: 'blue'
                },
                {
                    title: 'Ransomware Response Challenge: Nhật ký SOC của sinh viên năm 3',
                    link: this.baseUrl + '/posts/blue/ransomware-response-challenge.html',
                    description: 'Phát hiện và xử lý ransomware outbreak với IR timeline chi tiết',
                    date: new Date('2025-11-01'),
                    category: 'blue'
                },
                {
                    title: '10 cấu hình sai phổ biến nhất trên AWS khiến hệ thống "lộ bụng"',
                    link: this.baseUrl + '/posts/cloud/aws-misconfigurations.html',
                    description: 'Misconfiguration là nguyên nhân hàng đầu dẫn đến lộ lọt dữ liệu trên đám mây',
                    date: new Date('2025-10-26'),
                    category: 'cloud'
                },
                {
                    title: 'Tự xây dựng lab SOC mini tại nhà với Wazuh và VirtualBox',
                    link: this.baseUrl + '/posts/projects/soc-lab-wazuh.html',
                    description: 'Hướng dẫn chi tiết từng bước xây dựng lab SOC với Wazuh SIEM',
                    date: new Date('2025-10-28'),
                    category: 'projects'
                }
            );
        }

        return posts.sort((a, b) => b.date - a.date);
    }

    parseDate(dateString) {
        // Parse Vietnamese date format: "29 Tháng 10, 2025"
        const months = {
            'tháng 1': '01', 'tháng 2': '02', 'tháng 3': '03',
            'tháng 4': '04', 'tháng 5': '05', 'tháng 6': '06',
            'tháng 7': '07', 'tháng 8': '08', 'tháng 9': '09',
            'tháng 10': '10', 'tháng 11': '11', 'tháng 12': '12'
        };

        try {
            const parts = dateString.toLowerCase().split(' ');
            if (parts.length >= 4) {
                const day = parts[0].padStart(2, '0');
                const month = months[parts[1] + ' ' + parts[2]] || '01';
                const year = parts[3];
                return new Date(`${year}-${month}-${day}`);
            }
        } catch (e) {
            console.error('Error parsing date:', e);
        }

        return new Date();
    }

    buildRSS(posts) {
        const now = new Date().toUTCString();
        const siteTitle = 'Blog An toàn thông tin - Vũ Văn Thông';
        const siteDescription = 'Chia sẻ kiến thức về bảo mật mạng, Blue Team, Cloud Security và các chủ đề liên quan';
        const siteLink = this.baseUrl;

        let itemsXml = '';
        posts.forEach(post => {
            const pubDate = post.date.toUTCString();
            itemsXml += `
    <item>
      <title><![CDATA[${this.escapeXml(post.title)}]]></title>
      <link>${post.link}</link>
      <description><![CDATA[${this.escapeXml(post.description)}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${post.category}</category>
      <guid isPermaLink="true">${post.link}</guid>
    </item>`;
        });

        return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteTitle}]]></title>
    <link>${siteLink}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>vi-VN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteLink}/feed.xml" rel="self" type="application/rss+xml"/>${itemsXml}
  </channel>
</rss>`;
    }

    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    createDownloadLink(rssXml) {
        // Create download button for RSS feed
        const blogFilters = document.querySelector('.blog-filters');
        if (!blogFilters || document.querySelector('.rss-download-btn')) return;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'rss-download-btn btn btn-secondary';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Tải RSS Feed';
        downloadBtn.style.marginLeft = '1rem';

        downloadBtn.addEventListener('click', () => {
            const blob = new Blob([rssXml], { type: 'application/rss+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'feed.xml';
            a.click();
            URL.revokeObjectURL(url);
        });

        blogFilters.appendChild(downloadBtn);
    }
}

// Initialize RSS feed
if (document.querySelector('.blog-hero') || document.querySelector('.blog-post-card')) {
    document.addEventListener('DOMContentLoaded', () => {
        const rssFeed = new RSSFeed();
        window.rssFeed = rssFeed;
    });
}

