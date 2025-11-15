# Design Document

## Overview

Thiết kế này đảm bảo website portfolio hoạt động đúng với live server thông qua việc kiểm tra và sửa chữa tất cả các đường dẫn tương đối, tích hợp đầy đủ các bài viết blog, và đảm bảo tất cả các component được load chính xác.

## Architecture

### High-Level Architecture

```
Portfolio Website
├── Root Level (/)
│   ├── index.html (trang chủ)
│   ├── blog.html (trang blog chính)
│   ├── header.html (component)
│   ├── footer.html (component)
│   └── sidebar.html (component)
│
├── Components (/components/)
│   ├── about.html
│   ├── contact.html
│   ├── projects.html
│   └── skills.html
│
├── Posts (/posts/)
│   ├── blue/ (Blue Team posts)
│   ├── cloud/ (Cloud Security posts)
│   ├── projects/ (Project posts)
│   └── writeup/ (Writeup posts)
│
└── Assets (/assets/)
    ├── css/
    ├── js/
    ├── img/
    └── Music/
```

### Path Resolution Strategy

**Quy tắc đường dẫn:**
- Root level (`/`): Đường dẫn trực tiếp `assets/`, `components/`, `posts/`
- Components level (`/components/`): Prefix `../` cho assets, root files
- Posts level (`/posts/*/`): Prefix `../../` cho assets, root files

## Components and Interfaces

### 1. Path Resolution Module

**Mục đích:** Xử lý đường dẫn tương đối dựa trên vị trí trang hiện tại

**Interface:**
```javascript
class PathResolver {
  constructor(currentPath) {
    this.currentPath = currentPath;
    this.level = this.detectLevel();
  }
  
  detectLevel() {
    // Phát hiện cấp độ thư mục: root, components, posts
  }
  
  resolve(relativePath) {
    // Trả về đường dẫn đã điều chỉnh
  }
}
```

**Logic:**
- Kiểm tra `window.location.pathname`
- Xác định cấp độ: root (0), components (1), posts (2)
- Thêm prefix `../` tương ứng

### 2. Component Loader Module

**Mục đích:** Tải header, footer, sidebar động với đường dẫn chính xác

**Interface:**
```javascript
function loadComponents() {
  // Xác định đường dẫn component dựa trên vị trí hiện tại
  // Load header.html
  // Load footer.html
  // Load sidebar.html
  // Fix image paths trong components
  // Update navigation links
}
```

**Existing Implementation:** `assets/js/load-components.js`

**Cần kiểm tra:**
- Đường dẫn component cho posts/blue/, posts/cloud/, posts/projects/, posts/writeup/
- Image path trong sidebar
- Navigation links update

### 3. Blog Post Integration Module

**Mục đích:** Tích hợp tất cả bài viết vào blog.html

**Data Structure:**
```javascript
const blogPosts = [
  {
    category: 'blue',
    title: 'Ransomware Response Challenge',
    slug: 'ransomware-response-challenge',
    excerpt: 'Chia sẻ kinh nghiệm thực tế...',
    date: '2025-11-01',
    readTime: '20 phút đọc',
    image: 'assets/img/blue/Lab_SOC/setup1.png',
    tags: ['SOC', 'Incident Response', 'Ransomware']
  },
  // ... more posts
];
```

**Rendering Logic:**
```javascript
function renderBlogPosts(posts, filterCategory = 'all') {
  const grid = document.querySelector('.blog-posts-grid');
  grid.innerHTML = '';
  
  posts
    .filter(post => filterCategory === 'all' || post.category === filterCategory)
    .forEach(post => {
      const card = createPostCard(post);
      grid.appendChild(card);
    });
}
```

### 4. Blog Filter Module

**Mục đích:** Lọc bài viết theo danh mục

**Interface:**
```javascript
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.target.dataset.category;
      filterPosts(category);
      updateActiveButton(e.target);
    });
  });
}
```

**Existing Implementation:** `assets/js/blog.js` - đã có sẵn

**Cần kiểm tra:** Đảm bảo tất cả posts có `data-category` đúng

### 5. Audio Player Module

**Mục đích:** Đảm bảo audio player hoạt động với đường dẫn chính xác

**Path Resolution:**
```javascript
function fixAudioPath() {
  const audio = document.getElementById('background-music');
  const sources = audio.querySelectorAll('source');
  
  sources.forEach(source => {
    const originalSrc = source.getAttribute('src');
    const resolvedSrc = resolvePath(originalSrc);
    source.setAttribute('src', resolvedSrc);
  });
  
  audio.load();
}
```

## Data Models

### Blog Post Model

```javascript
{
  id: String,              // unique identifier
  category: String,        // 'blue', 'cloud', 'projects', 'writeup'
  title: String,           // post title
  slug: String,            // URL-friendly title
  excerpt: String,         // short description
  content: String,         // full HTML content (optional)
  date: String,            // ISO date format
  readTime: String,        // e.g., "20 phút đọc"
  image: String,           // path to featured image
  tags: Array<String>,     // array of tags
  author: String,          // author name
  filePath: String         // relative path to HTML file
}
```

### Navigation Link Model

```javascript
{
  text: String,            // link text
  href: String,            // original href
  resolvedHref: String,    // resolved href based on current location
  isActive: Boolean        // whether this is the current page
}
```

## Error Handling

### 1. Component Loading Errors

**Strategy:** Graceful degradation
```javascript
fetch(componentPath)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}`);
    }
    return response.text();
  })
  .catch(error => {
    console.error('Component loading error:', error);
    // Hiển thị fallback hoặc để trống
  });
```

### 2. Image Loading Errors

**Strategy:** Placeholder images
```javascript
img.onerror = function() {
  this.src = 'assets/img/placeholder.png';
  this.alt = 'Image not available';
};
```

### 3. Path Resolution Errors

**Strategy:** Validation và fallback
```javascript
function validatePath(path) {
  if (!path || typeof path !== 'string') {
    console.warn('Invalid path:', path);
    return 'index.html'; // fallback
  }
  return path;
}
```

## Testing Strategy

### 1. Manual Testing Checklist

**Root Level Pages:**
- [ ] index.html loads correctly
- [ ] blog.html loads correctly
- [ ] All CSS files load
- [ ] All JS files load
- [ ] All images load
- [ ] Navigation works

**Components Level:**
- [ ] about.html loads correctly
- [ ] contact.html loads correctly
- [ ] projects.html loads correctly
- [ ] skills.html loads correctly
- [ ] All paths resolve with `../` prefix

**Posts Level:**
- [ ] All posts in posts/blue/ load correctly
- [ ] All posts in posts/cloud/ load correctly
- [ ] All posts in posts/projects/ load correctly
- [ ] All posts in posts/writeup/ load correctly
- [ ] All paths resolve with `../../` prefix

### 2. Functional Testing

**Blog Integration:**
- [ ] All posts appear on blog.html
- [ ] Post metadata is correct (title, date, excerpt, tags)
- [ ] Post images load correctly
- [ ] Post links navigate to correct pages

**Filtering:**
- [ ] "Tất cả" shows all posts
- [ ] "Blue Team" shows only blue posts
- [ ] "Cloud Security" shows only cloud posts
- [ ] "Projects" shows only projects posts
- [ ] "Writeup" shows only writeup posts

**Component Loading:**
- [ ] Header loads on all pages
- [ ] Footer loads on all pages
- [ ] Sidebar loads on all pages
- [ ] Sidebar image path is correct on all pages
- [ ] Navigation links are correct on all pages

### 3. Cross-Browser Testing

**Browsers to test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test cases:**
- Page loads without errors
- All functionality works
- No console errors
- Responsive design works

### 4. Responsive Testing

**Breakpoints:**
- Desktop: > 980px
- Tablet: 768px - 980px
- Mobile: < 768px

**Test cases:**
- Layout adjusts correctly
- Sidebar behavior (open/closed)
- Navigation menu (hamburger on mobile)
- Images scale properly

## Performance Considerations

### 1. Lazy Loading

**Images:**
```javascript
<img data-src="path/to/image.jpg" class="lazy" alt="...">
```

**Implementation:** Intersection Observer API

### 2. Code Splitting

**Strategy:** Load JS modules only when needed
- Core functionality: Always load
- Blog-specific: Only on blog pages
- Post-specific: Only on post pages

### 3. Caching Strategy

**Service Worker:** Cache static assets
```javascript
// service-worker.js already exists
// Ensure all critical paths are cached
```

## Security Considerations

### 1. XSS Prevention

**Strategy:** Sanitize user input (if any)
```javascript
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}
```

### 2. Path Traversal Prevention

**Strategy:** Validate all paths
```javascript
function isValidPath(path) {
  // Không cho phép ../ trong path
  return !path.includes('../') || path.startsWith('../../');
}
```

## Deployment Considerations

### 1. Live Server Configuration

**Requirements:**
- Serve from root directory
- Enable CORS for local development
- Support HTML5 history mode (if using SPA routing)

### 2. Build Process

**Steps:**
1. Validate all HTML files
2. Check all paths
3. Minify CSS/JS (optional for development)
4. Optimize images
5. Generate sitemap
6. Test with live server

## Maintenance and Updates

### 1. Adding New Blog Posts

**Process:**
1. Create HTML file in appropriate posts/ subdirectory
2. Follow existing post template structure
3. Add post metadata to blog.html
4. Update blog post card with correct data-category
5. Test filtering and navigation

### 2. Updating Components

**Process:**
1. Edit component file (header.html, footer.html, sidebar.html)
2. Test on all page levels (root, components, posts)
3. Verify paths are resolved correctly
4. Check responsive behavior

### 3. Adding New Pages

**Process:**
1. Determine page level (root, components, or new directory)
2. Create HTML file with correct path prefixes
3. Add placeholders for header, footer, sidebar
4. Update navigation in header.html
5. Test component loading and navigation
