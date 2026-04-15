/**
 * Otolibre - Main JavaScript
 * Handles navigation, modals, animations, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initMediaModals();
    initInteractiveElements();
    initTheme();
});

/**
 * Navigation & Smooth Scrolling
 */
function initNavigation() {
    // Smooth scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            let targetId = this.getAttribute('href');
            
            // If the link is index.html#something and we are already on index.html
            if(targetId.includes('index.html#')) {
                if(window.location.pathname.includes('article-')) {
                    return; // Let standard navigation happen
                }
                targetId = targetId.replace('index.html', '');
            }

            if(targetId === '#' || targetId.length < 2) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });

    // Navbar Background on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

/**
 * Mobile Menu Logic (Hamburger icon)
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Optional: Change icon depending on state
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('ph-list');
                    icon.classList.add('ph-x');
                } else {
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }
            }
        });
    }
}

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
    
    // Initial reveals for top section
    setTimeout(() => {
        const homeReveals = document.querySelectorAll('#home .reveal-up, .article-hero .reveal-up');
        homeReveals.forEach(el => el.classList.add('active'));
    }, 100);
}

/**
 * Media Discovery Modals (Medya-Vitrin MV-2)
 */
function initMediaModals() {
    const modal = document.getElementById('article-modal');
    const modalContent = document.getElementById('modal-content');

    // Global Modal Open
    window.OtolibreOpenModal = function(id) {
        console.log("Otolibre: Detay açılıyor ->", id);
        const template = document.getElementById('temp-' + id);
        
        if (template && modal && modalContent) {
            const content = template.content.cloneNode(true);
            modalContent.innerHTML = '';
            modalContent.appendChild(content);
            
            modal.classList.add('active');
            document.body.classList.add('modal-open');

            // Push state to browser history
            history.pushState({ modalOpen: true, articleId: id }, '', '#' + id);
        }
    };

    // Global Modal Close
    window.OtolibreCloseModal = function(isPopState) {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            
            if (!isPopState && window.location.hash) {
                history.back();
            }
        }
    };

    // History API support
    window.addEventListener('popstate', (event) => {
        if (modal && modal.classList.contains('active')) {
            window.OtolibreCloseModal(true);
        }
    });

    // Keyboard support (ESC)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.OtolibreCloseModal(false);
    });

    // Event Delegation for modal buttons
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('closeModalBtn') || e.target === modal) {
                window.OtolibreCloseModal(false);
            }
        });
    }
}

/**
 * Interactive Hover Effects & Mobile Touch Fixes (MV-5)
 */
function initInteractiveElements() {
    // Fix for Mobile Touch on Expanding Cards
    const panelCards = document.querySelectorAll('.panel-card');
    
    panelCards.forEach(card => {
        // Prevent immediate navigation on mobile touch. Force 2-tap interaction.
        card.addEventListener('click', (e) => {
            // Check if card is not fully expanded or active
            if(window.innerWidth <= 992) {
                if(!card.classList.contains('active')) {
                    e.preventDefault(); // Stop navigation
                    
                    // Remove active from all other cards
                    panelCards.forEach(c => c.classList.remove('active'));
                    
                    // Add active to the touched card
                    card.classList.add('active');
                }
                // If it is already active, the link click will proceed naturally!
            }
        });
    });

    // Magnetic 3D Interaction for expanding cards
    panelCards.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = item.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            gsap.to(item, {
                rotateY: x * 5, // Reduced from 15 to 5 for larger panels
                rotateX: -y * 5,
                transformPerspective: 1000,
                duration: 0.6,
                ease: "power2.out"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    });

    // Bento Card Hover (Visual Polish)
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // Premium Showroom Tab Interaction
    const showroomTabs = document.querySelectorAll('.showroom-tab');
    const displayItems = document.querySelectorAll('.display-item');

    if (showroomTabs.length > 0) {
        showroomTabs.forEach(tab => {
            // Support both hover (for desktop) and click (for mobile)
            ['mouseenter', 'click'].forEach(eventType => {
                tab.addEventListener(eventType, function() {
                    const targetId = this.getAttribute('data-target');
                    
                    // Remove active from all tabs and displays
                    showroomTabs.forEach(t => t.classList.remove('active'));
                    displayItems.forEach(d => d.classList.remove('active'));
                    
                    // Add active to current Tab and corresponding Display
                    this.classList.add('active');
                    const targetDisplay = document.getElementById(targetId);
                    if (targetDisplay) {
                        targetDisplay.classList.add('active');
                    }
                });
            });
        });
    }
}
/**
 * Theme Switching (Light/Dark Mode)
 */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
            }
            localStorage.setItem('theme', theme);
        });
    }
}
