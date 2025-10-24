// Function to load header and footer components
function loadComponents() {
    // Determine the correct path based on current location
    let headerPath = 'header.html';
    let footerPath = 'footer.html';
    
    // Check if we're in a subdirectory
    if (window.location.pathname.includes('/components/')) {
        headerPath = '../header.html';
        footerPath = '../footer.html';
    } else if (window.location.pathname.includes('/posts/')) {
        headerPath = '../../header.html';
        footerPath = '../../footer.html';
    }
    
    // Load header
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Update navigation links based on current location
            updateNavigationLinks();
            // Set active navigation link based on current page
            setActiveNavLink();
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

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);
