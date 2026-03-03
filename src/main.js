/* ─── Zlender Studio — Main JS ─── */
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initMobileMenu();
    initLazyVideos();
    initScrollAnimations();
});

/* ──────────────────────────────────────────
   1. Glass Nav — scroll detection
   ────────────────────────────────────────── */
function initNavScroll() {
    const nav = document.getElementById('glass-nav');
    if (!nav) return;

    const onScroll = () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
}

/* ──────────────────────────────────────────
   2. Mobile Hamburger Menu
   ────────────────────────────────────────── */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ──────────────────────────────────────────
   3. Intersection Observer — Lazy Video Load
   
   CRITICAL: All videos start with preload="none"
   and remain paused until they enter the viewport.
   This saves bandwidth on Vercel and gives a fast LCP.
   ────────────────────────────────────────── */
function initLazyVideos() {
    const videos = document.querySelectorAll('.lazy-video');
    if (videos.length === 0) return;

    // Pick the right source based on viewport width
    function getVideoSrc(video) {
        const isMobile = window.innerWidth < 768;
        if (video.dataset.srcMobile && video.dataset.srcDesktop) {
            return isMobile ? video.dataset.srcMobile : video.dataset.srcDesktop;
        }
        return video.dataset.src;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const video = entry.target;

                if (entry.isIntersecting) {
                    // Load and play
                    const src = getVideoSrc(video);
                    if (src && !video.querySelector('source')) {
                        const source = document.createElement('source');
                        source.src = src;
                        source.type = 'video/mp4';
                        video.appendChild(source);
                        video.load();
                    }

                    video.play().then(() => {
                        video.classList.add('is-playing');
                    }).catch(() => {
                        // Autoplay blocked — still show poster
                        video.classList.add('is-playing');
                    });
                } else {
                    // Pause when out of view
                    video.pause();
                }
            });
        },
        {
            rootMargin: '100px 0px', // start loading slightly before visible
            threshold: 0.1,
        }
    );

    videos.forEach((video) => observer.observe(video));
}

/* ──────────────────────────────────────────
   4. Scroll-triggered fade-in animations
   ────────────────────────────────────────── */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/* ──────────────────────────────────────────
   5. Custom Success Popup for Forms
   ────────────────────────────────────────── */
window.showSuccessPopup = function (message = "Thank you! Your request has been sent.") {
    // Prevent duplicate popups
    if (document.getElementById('success-popup')) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'success-popup';
    overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 opacity-0 transition-opacity duration-300';

    // Create modal card
    const modal = document.createElement('div');
    modal.className = 'w-full max-w-sm rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-center shadow-2xl transform scale-95 transition-transform duration-300';

    // Icon
    const icon = document.createElement('div');
    icon.className = 'mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white';
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>';

    // Title & Message
    const title = document.createElement('h3');
    title.className = 'mb-2 font-heading text-xl font-bold uppercase tracking-widest text-white';
    title.innerText = 'Success';

    const text = document.createElement('p');
    text.className = 'mb-8 font-body text-sm text-gray-400';
    text.innerText = message;

    // OK Button
    const btn = document.createElement('button');
    btn.className = 'cta-button cta-button-filled w-full justify-center py-3 text-sm';
    btn.innerText = 'OK';
    btn.onclick = () => {
        overlay.classList.remove('opacity-100');
        modal.classList.remove('scale-100');
        setTimeout(() => overlay.remove(), 300);
    };

    // Assemble
    modal.appendChild(icon);
    modal.appendChild(title);
    modal.appendChild(text);
    modal.appendChild(btn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Trigger animations
    requestAnimationFrame(() => {
        overlay.classList.add('opacity-100');
        modal.classList.add('scale-100');
        modal.classList.remove('scale-95');
    });
};

/* ──────────────────────────────────────────
   6. Form Rate Limiting (Anti-Spam)
   ────────────────────────────────────────── */
window.checkRateLimit = function (formId) {
    const cooldown = 60000; // 1 minute
    const lastSubmit = localStorage.getItem(`last_submit_${formId}`);
    const now = Date.now();

    if (lastSubmit && (now - lastSubmit < cooldown)) {
        const remaining = Math.ceil((cooldown - (now - lastSubmit)) / 1000);
        alert(`Please wait ${remaining} seconds before submitting again.`);
        return false;
    }

    localStorage.setItem(`last_submit_${formId}`, now);
    return true;
};
