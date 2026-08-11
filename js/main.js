/* ==========================================================================
   SHIELDFORCE - CORE FRONTEND CONTROLLER
   Lenis Smooth Scroll, GSAP ScrollTrigger, Custom Cursor, Interactive Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Theme Toggle Controller (Dark <-> Light Mode)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('shieldforce_theme') || 'dark';

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      localStorage.setItem('shieldforce_theme', 'light');
      themeToggleBtns.forEach(btn => {
        btn.innerHTML = '<i data-lucide="moon" style="width: 18px; height: 18px;"></i>';
      });
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      localStorage.setItem('shieldforce_theme', 'dark');
      themeToggleBtns.forEach(btn => {
        btn.innerHTML = '<i data-lucide="sun" style="width: 18px; height: 18px;"></i>';
      });
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  setTheme(storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  // RTL Toggle Controller (LTR <-> RTL Direction)
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('shieldforce_dir') || 'ltr';

  function setDirection(dir) {
    if (dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      localStorage.setItem('shieldforce_dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      localStorage.setItem('shieldforce_dir', 'ltr');
    }
  }

  setDirection(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      setDirection(newDir);
    });
  });

  // (Mobile menu is now handled natively by Bootstrap Offcanvas)

  // 3. Initialize Lenis Smooth Scroll
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 4. Custom Dual Spotlight Magnetic Cursor
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover state on interactive elements
    const interactables = document.querySelectorAll('a, button, input, select, textarea, .glass-card, .gallery-item');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering-interactive'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering-interactive'));
    });
  }

  // 5. Navbar Scroll Blur State
  const navbar = document.querySelector('.navbar-shield');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 6. GSAP & ScrollTrigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Staggered Fade Up for Cards & Headings
    gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // Split Text / Stagger Text Reveal
    gsap.utils.toArray('.gsap-split-text').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.05
      });
    });
  }

  // 7. CountUp.js Initialization for Statistics
  const counters = document.querySelectorAll('.counter-value');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target') || '100');
          const suffix = entry.target.getAttribute('data-suffix') || '';

          if (typeof CountUp !== 'undefined') {
            const countUp = new CountUp.CountUp(entry.target, target, {
              duration: 2.5,
              suffix: suffix,
              useEasing: true
            });
            if (!countUp.error) countUp.start();
          } else {
            entry.target.innerText = target + suffix;
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // 8. Swiper.js Carousel Setup for Testimonials
  if (typeof Swiper !== 'undefined' && document.querySelector('.swiper-testimonials')) {
    new Swiper('.swiper-testimonials', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  // 9. Security Quote Estimator (Dynamic Calculator)
  const calcForm = document.getElementById('security-quote-calculator');
  if (calcForm) {
    const guardRange = document.getElementById('calc-guards');
    const guardValDisplay = document.getElementById('calc-guards-val');
    const hoursSelect = document.getElementById('calc-shift');
    const typeSelect = document.getElementById('calc-type');
    const totalDisplay = document.getElementById('calc-total');

    function updateEstimate() {
      if (!guardRange || !hoursSelect || !typeSelect || !totalDisplay) return;

      const numGuards = parseInt(guardRange.value);
      guardValDisplay.innerText = numGuards;

      const hoursMultiplier = parseFloat(hoursSelect.value);
      const rateMultiplier = parseFloat(typeSelect.value);

      // Base hourly rate per guard = $28
      const monthlyTotal = Math.round(numGuards * 28 * hoursMultiplier * rateMultiplier * 30);

      totalDisplay.innerText = '$' + monthlyTotal.toLocaleString();
    }

    if (guardRange) guardRange.addEventListener('input', updateEstimate);
    if (hoursSelect) hoursSelect.addEventListener('change', updateEstimate);
    if (typeSelect) typeSelect.addEventListener('change', updateEstimate);

    updateEstimate();
  }

  // 10. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // 11. GLightbox Initialization
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }

  // 12. Global Floating Scroll-To-Top Button Controller
  let scrollTopBtn = document.querySelector('.scroll-to-top-btn');
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.setAttribute('title', 'Scroll to top');
    scrollTopBtn.innerHTML = '<i data-lucide="chevron-up" style="width: 24px; height: 24px;"></i>';
    document.body.appendChild(scrollTopBtn);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 280) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
