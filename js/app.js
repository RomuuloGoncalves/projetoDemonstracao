/* ============================================
   VANESSA MORELLI — Main App
   ============================================ */

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    initHeader();
    initMobileMenu();
    initRevealAnimations();
    initSmoothScroll();
    Ecommerce.init();
    Ecommerce.renderShowcase();
    updateWhatsAppStatus();
});

// ─── Header Scroll Effect ───
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const heroSection = document.getElementById('hero');
    let lastScroll = 0;

    function updateHeader() {
        const scroll = window.scrollY;
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;

        if (scroll > 60) {
            header.classList.add('header--scrolled');
            header.classList.remove('header--hero');
        } else {
            header.classList.remove('header--scrolled');
            if (heroSection) header.classList.add('header--hero');
        }

        lastScroll = scroll;
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
}

// ─── Mobile Menu ───
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav__overlay');

    if (!toggle || !mobileNav) return;

    function openMenu() {
        toggle.classList.add('active');
        mobileNav.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close menu on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// ─── Scroll Reveal Animations ───
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => {
        if (!el.classList.contains('revealed')) {
            observer.observe(el);
        }
    });
}

// ─── Smooth Scroll for Nav Links ───
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('.header__nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.header__nav-link').forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === `#${id}`) {
                        l.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });
}

// ─── WhatsApp Status ───
function updateWhatsAppStatus() {
    const number = Store.getWhatsAppNumber();
    const statusEl = document.getElementById('whatsappStatus');
    if (statusEl) {
        if (number) {
            statusEl.innerHTML = `<span style="color: var(--color-success);">✓</span> WhatsApp: ${number}`;
        } else {
            statusEl.innerHTML = `<span style="color: var(--color-warning);">⚠</span> <a href="javascript:Ecommerce.showWhatsAppConfig()" style="color: var(--color-gold); text-decoration: underline;">Configurar WhatsApp</a>`;
        }
    }
}

// ─── Toast Notifications ───
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ─── Navigate to Section ───
function navigateToShop() {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        window.scrollTo({
            top: shopSection.offsetTop - headerHeight,
            behavior: 'smooth'
        });
    }
}

function navigateToCollections() {
    const section = document.getElementById('collections');
    if (section) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        window.scrollTo({
            top: section.offsetTop - headerHeight,
            behavior: 'smooth'
        });
    }
}
