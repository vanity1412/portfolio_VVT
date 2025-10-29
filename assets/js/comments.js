// ============================================
// Comments System
// ============================================

class CommentsSystem {
    constructor() {
        this.storageKey = 'portfolio_comments';
        this.comments = this.loadComments();
        this.init();
    }

    init() {
        // Find all blog post pages
        const blogPost = document.querySelector('.blog-post');
        if (blogPost) {
            this.renderCommentsSection();
            this.loadCommentsForPost();
        }
    }

    renderCommentsSection() {
        const blogPost = document.querySelector('.blog-post');
        if (!blogPost) return;

        // Check if comments section already exists
        if (document.querySelector('.comments-section')) return;

        const commentsSection = document.createElement('section');
        commentsSection.className = 'comments-section';
        commentsSection.innerHTML = `
            <div class="container">
                <h2 class="comments-title">
                    <i class="fas fa-comments"></i>
                    Bình luận
                </h2>
                
                <div class="comments-form-container">
                    <form class="comment-form" id="comment-form">
                        <div class="comment-form-group">
                            <input type="text" id="comment-name" placeholder="Tên của bạn" required>
                        </div>
                        <div class="comment-form-group">
                            <input type="email" id="comment-email" placeholder="Email (không bắt buộc)">
                        </div>
                        <div class="comment-form-group">
                            <textarea id="comment-text" placeholder="Viết bình luận của bạn..." rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                            Gửi bình luận
                        </button>
                    </form>
                </div>

                <div class="comments-list" id="comments-list">
                    <div class="comments-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        Đang tải bình luận...
                    </div>
                </div>
            </div>
        `;

        blogPost.appendChild(commentsSection);

        // Setup form handler
        const form = document.getElementById('comment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addComment();
            });
        }
    }

    addComment() {
        const name = document.getElementById('comment-name').value.trim();
        const email = document.getElementById('comment-email').value.trim();
        const text = document.getElementById('comment-text').value.trim();
        const postUrl = window.location.pathname;

        if (!name || !text) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const comment = {
            id: Date.now(),
            postUrl: postUrl,
            name: name,
            email: email || 'anonymous',
            text: text,
            date: new Date().toISOString(),
            replies: []
        };

        this.comments.push(comment);
        this.saveComments();
        this.loadCommentsForPost();

        // Reset form
        document.getElementById('comment-form').reset();
        
        // Show success message
        this.showNotification('Bình luận đã được gửi thành công!', 'success');
    }

    loadCommentsForPost() {
        const postUrl = window.location.pathname;
        const postComments = this.comments.filter(c => c.postUrl === postUrl);

        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        if (postComments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <i class="fas fa-comment-slash"></i>
                    <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                </div>
            `;
            return;
        }

        commentsList.innerHTML = postComments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(comment => this.renderComment(comment))
            .join('');

        // Setup reply handlers
        this.setupReplyHandlers();
    }

    renderComment(comment) {
        const date = new Date(comment.date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <h4 class="comment-author">${this.escapeHtml(comment.name)}</h4>
                        <span class="comment-date">${date}</span>
                    </div>
                    <div class="comment-text">${this.escapeHtml(comment.text)}</div>
                    <div class="comment-actions">
                        <button class="comment-reply-btn" data-comment-id="${comment.id}">
                            <i class="fas fa-reply"></i>
                            Trả lời
                        </button>
                    </div>
                    ${comment.replies.length > 0 ? `
                        <div class="comment-replies">
                            ${comment.replies.map(reply => this.renderComment(reply)).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    setupReplyHandlers() {
        const replyBtns = document.querySelectorAll('.comment-reply-btn');
        replyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const commentId = parseInt(btn.dataset.commentId);
                this.showReplyForm(commentId);
            });
        });
    }

    showReplyForm(parentId) {
        // Remove existing reply forms
        document.querySelectorAll('.reply-form-container').forEach(el => el.remove());

        const commentItem = document.querySelector(`[data-comment-id="${parentId}"]`);
        if (!commentItem) return;

        const replyContainer = document.createElement('div');
        replyContainer.className = 'reply-form-container';
        replyContainer.innerHTML = `
            <form class="reply-form">
                <input type="text" class="reply-name" placeholder="Tên của bạn" required>
                <textarea class="reply-text" placeholder="Viết phản hồi..." rows="3" required></textarea>
                <div class="reply-actions">
                    <button type="submit" class="btn btn-primary btn-sm">Gửi</button>
                    <button type="button" class="btn btn-secondary btn-sm cancel-reply">Hủy</button>
                </div>
            </form>
        `;

        commentItem.querySelector('.comment-content').appendChild(replyContainer);

        // Setup form handler
        const form = replyContainer.querySelector('.reply-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('.reply-name').value.trim();
            const text = form.querySelector('.reply-text').value.trim();

            if (!name || !text) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            const reply = {
                id: Date.now(),
                name: name,
                text: text,
                date: new Date().toISOString(),
                replies: []
            };

            const comment = this.comments.find(c => c.id === parentId);
            if (comment) {
                comment.replies.push(reply);
                this.saveComments();
                this.loadCommentsForPost();
            }

            replyContainer.remove();
        });

        // Cancel button
        replyContainer.querySelector('.cancel-reply').addEventListener('click', () => {
            replyContainer.remove();
        });
    }

    loadComments() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading comments:', e);
            return [];
        }
    }

    saveComments() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
        } catch (e) {
            console.error('Error saving comments:', e);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize comments system
if (document.querySelector('.blog-post')) {
    document.addEventListener('DOMContentLoaded', () => {
        const commentsSystem = new CommentsSystem();
        window.commentsSystem = commentsSystem;
    });
}

