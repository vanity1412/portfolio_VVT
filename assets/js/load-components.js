// Function to load header, footer, and sidebar components
function loadComponents() {
    // Determine the correct path based on current location
    let headerPath = 'header.html';
    let footerPath = 'footer.html';
    let sidebarPath = 'sidebar.html';
    
    // Check if we're in a subdirectory
    if (window.location.pathname.includes('/components/')) {
        headerPath = '../header.html';
        footerPath = '../footer.html';
        sidebarPath = '../sidebar.html';
    } else if (window.location.pathname.includes('/posts/')) {
        headerPath = '../../header.html';
        footerPath = '../../footer.html';
        sidebarPath = '../../sidebar.html';
    }
    
    // Load sidebar
    fetch(sidebarPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            // Fix image path based on current location
            fixSidebarImagePath();
            // Initialize sidebar functionality
            initializeSidebar();
        })
        .catch(error => console.error('Error loading sidebar:', error));
    
    // Load header
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Update navigation links based on current location
            updateNavigationLinks();
            // Set active navigation link based on current page
            setActiveNavLink();
            // Initialize dark mode after header loads
            if (window.darkMode) {
                window.darkMode.setupToggle();
            }
            // Initialize i18n after header loads
            if (window.i18n) {
                window.i18n.setupToggle();
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch(footerPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Function to update navigation links based on current location
function updateNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Update links based on current location
        if (window.location.pathname.includes('/components/')) {
            // We're in components directory
            if (href === 'index.html') {
                link.setAttribute('href', '../index.html');
            } else if (href === 'blog.html') {
                link.setAttribute('href', '../blog.html');
            } else if (href.startsWith('components/')) {
                // Convert components/about.html to about.html
                const fileName = href.split('/').pop();
                link.setAttribute('href', fileName);
            }
        } else if (window.location.pathname.includes('/posts/')) {
            // We're in posts directory
            if (href === 'index.html') {
                link.setAttribute('href', '../../index.html');
            } else if (href === 'blog.html') {
                link.setAttribute('href', '../../blog.html');
            } else if (href.startsWith('components/')) {
                link.setAttribute('href', '../../' + href);
            }
        }
    });
}

// Function to set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Check if current page matches the link
        if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
            if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '../index.html' || link.getAttribute('href') === '../../index.html') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('about.html')) {
            if (link.getAttribute('href') === 'components/about.html' || link.getAttribute('href') === 'about.html' || link.getAttribute('href') === '../components/about.html' || link.getAttribute('href') === '../../components/about.html') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('skills.html')) {
            if (link.getAttribute('href') === 'components/skills.html' || link.getAttribute('href') === 'skills.html' || link.getAttribute('href') === '../components/skills.html' || link.getAttribute('href') === '../../components/skills.html') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('projects.html')) {
            if (link.getAttribute('href') === 'components/projects.html' || link.getAttribute('href') === 'projects.html' || link.getAttribute('href') === '../components/projects.html' || link.getAttribute('href') === '../../components/projects.html') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('blog.html') || currentPage.includes('/posts/')) {
            if (link.getAttribute('href') === 'blog.html' || link.getAttribute('href') === '../blog.html' || link.getAttribute('href') === '../../blog.html') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('contact.html')) {
            if (link.getAttribute('href') === 'components/contact.html' || link.getAttribute('href') === 'contact.html' || link.getAttribute('href') === '../components/contact.html' || link.getAttribute('href') === '../../components/contact.html') {
                link.classList.add('active');
            }
        }
    });
}

// Function to fix sidebar image path based on current location
function fixSidebarImagePath() {
    const sidebarImg = document.querySelector('.sidebar-profile-img');
    if (sidebarImg) {
        // Check current location and adjust image path
        if (window.location.pathname.includes('/components/')) {
            sidebarImg.src = '../assets/img/myface.jpg';
        } else if (window.location.pathname.includes('/posts/')) {
            sidebarImg.src = '../../assets/img/myface.jpg';
        } else {
            sidebarImg.src = 'assets/img/myface.jpg';
        }
    }
    
    // Also fix audio path if audio player exists
    const audio = document.getElementById('background-music');
    if (audio) {
        const sources = audio.querySelectorAll('source');
        sources.forEach(source => {
            if (source.src.includes('assets/music/sontung.mp3')) {
                if (window.location.pathname.includes('/components/')) {
                    source.src = '../assets/music/sontung.mp3';
                } else if (window.location.pathname.includes('/posts/')) {
                    source.src = '../../assets/music/sontung.mp3';
                } else {
                    source.src = 'assets/music/sontung.mp3';
                }
            }
        });
    }
}

// Function to initialize sidebar functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const body = document.body;
    
    // Sidebar hiển thị mặc định trên desktop, ẩn trên mobile
    if (window.innerWidth > 768) {
        // Desktop: sidebar hiển thị mặc định
        if (sidebar) {
            sidebar.classList.remove('hidden');
        }
        if (body) {
            body.classList.remove('sidebar-hidden');
        }
    } else {
        // Mobile: sidebar ẩn mặc định
        if (sidebar) {
            sidebar.classList.add('hidden');
        }
        if (body) {
            body.classList.add('sidebar-hidden');
        }
    }
    
    // Sidebar toggle functionality
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                // Desktop: toggle ẩn/hiện sidebar
                sidebar.classList.toggle('hidden');
                body.classList.toggle('sidebar-hidden');
            } else {
                // Mobile: toggle mở/đóng sidebar
                sidebar.classList.toggle('open');
            }
        });
    }
    
    // Close sidebar when clicking outside (chỉ trên mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Desktop: sidebar hiển thị mặc định
            sidebar.classList.remove('hidden', 'open');
            body.classList.remove('sidebar-hidden');
        } else {
            // Mobile: sidebar ẩn mặc định
            sidebar.classList.add('hidden');
            sidebar.classList.remove('open');
            body.classList.add('sidebar-hidden');
        }
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);
