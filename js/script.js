/* ============================================================
   STACKLY — MAIN SCRIPT
   Navigation, Preloader, Scroll-reveal, GSAP Animations,
   FAQ Accordion, Mobile Menu, Dashboard Sidebar
   ============================================================ */

(function () {
  'use strict';

  // ─────────────────────────────────────────
  // PRELOADER
  // ─────────────────────────────────────────
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const logoImg = preloader.querySelector('.preloader-logo');
    let leftHalf = null;
    let rightHalf = null;

    if (logoImg && !logoImg.classList.contains('preloader-split-processed')) {
      logoImg.classList.add('preloader-split-processed');

      const splitWrapper = document.createElement('div');
      splitWrapper.className = 'preloader-logo-split-wrapper';

      leftHalf = document.createElement('div');
      leftHalf.className = 'preloader-logo-half preloader-logo-left';

      rightHalf = document.createElement('div');
      rightHalf.className = 'preloader-logo-half preloader-logo-right';

      const imgLeft = logoImg.cloneNode(true);
      imgLeft.removeAttribute('id');

      const imgRight = logoImg.cloneNode(true);
      imgRight.removeAttribute('id');

      leftHalf.appendChild(imgLeft);
      rightHalf.appendChild(imgRight);

      splitWrapper.appendChild(leftHalf);
      splitWrapper.appendChild(rightHalf);

      const parent = logoImg.parentNode;
      parent.insertBefore(splitWrapper, logoImg);
      parent.removeChild(logoImg);
    }

    let isDismissed = false;

    function dismissPreloader() {
      if (isDismissed) return;
      isDismissed = true;

      const lineWrapper = preloader.querySelector('.preloader-line-wrapper');

      if (leftHalf && rightHalf && typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          onComplete: function () {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
          }
        });

        // 1. Logo halves split vertically from center and separate outward in opposite directions
        tl.to(leftHalf, {
          xPercent: -85,
          x: -45,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.inOut'
        }, 0);

        tl.to(rightHalf, {
          xPercent: 85,
          x: 45,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.inOut'
        }, 0);

        // 2. Loading line and background overlay transition into page reveal
        if (lineWrapper) {
          tl.to(lineWrapper, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          }, 0);
        }

        tl.to(preloader, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut'
        }, 0.35);

      } else {
        // Fallback
        setTimeout(function () {
          preloader.classList.add('hidden');
          document.body.style.overflow = '';
        }, 800);
      }
    }

    if (document.readyState === 'complete') {
      setTimeout(dismissPreloader, 800);
    } else {
      window.addEventListener('load', function () {
        setTimeout(dismissPreloader, 700);
      });
      setTimeout(dismissPreloader, 1800);
    }

    document.body.style.overflow = 'hidden';
  }

  // ─────────────────────────────────────────
  // HEADER SCROLL BEHAVIOR
  // ─────────────────────────────────────────
  function initHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active nav item
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(function (item) {
      const href = item.getAttribute('href') || '';
      if (
        href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage.includes(href.replace('.html', '')) && href !== 'index.html' && href !== '')
      ) {
        item.classList.add('active');
      }
    });
  }

  // ─────────────────────────────────────────
  // MOBILE MENU
  // ─────────────────────────────────────────
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navWrapper = document.getElementById('nav-wrapper');
    const header = document.getElementById('main-header');
    if (!toggle || !navWrapper) return;

    function openMenu() {
      toggle.classList.add('open');
      navWrapper.classList.add('open');
      if (header) header.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('open');
      navWrapper.classList.remove('open');
      if (header) header.classList.remove('nav-open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navWrapper.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on nav item click
    const navItems = navWrapper.querySelectorAll('.nav-item, .login-link, .btn-advisor-outline, a');
    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navWrapper.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // ─────────────────────────────────────────
  // SCROLL REVEAL (IntersectionObserver)
  // ─────────────────────────────────────────
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          entry.target.classList.remove('revealed');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ─────────────────────────────────────────
  // FAQ ACCORDION
  // ─────────────────────────────────────────
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(function (i) { i.classList.remove('open'); });
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // ─────────────────────────────────────────
  // DASHBOARD SIDEBAR TOGGLE & NAV TAB SWITCHING
  // ─────────────────────────────────────────
  function initDashboardSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    if (!sidebar) return;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    }

    // Close on outside click (mobile)
    document.addEventListener('click', function (e) {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        toggleBtn && !toggleBtn.contains(e.target)
      ) {
        sidebar.classList.remove('open');
      }
    });

    // Handle sidebar tab switching & panel view toggling
    const navItems = sidebar.querySelectorAll('.sidebar-nav-item');
    const panels = document.querySelectorAll('.dash-panel');

    navItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        const panelId = item.getAttribute('data-panel') || (item.getAttribute('href') ? item.getAttribute('href').replace('#', '') : null);
        
        if (panelId) {
          e.preventDefault();
          navItems.forEach(function (nav) { nav.classList.remove('active'); });
          item.classList.add('active');

          // Dynamically update dashboard navbar heading text to active sidebar title
          const mainHeading = document.getElementById('dashboard-heading');
          if (mainHeading) {
            let labelText = item.textContent.trim();
            // Clean up text if item contains icons or badge text
            labelText = labelText.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ');
            if (labelText.toLowerCase() === 'overview') {
              labelText = window.location.pathname.includes('coach') ? 'Coach Dashboard' : 'Executive Dashboard';
            }
            mainHeading.textContent = labelText;
          }

          if (panels.length > 0) {
            panels.forEach(function (p) {
              p.classList.remove('active-panel');
              p.style.display = 'none';
            });
            const targetPanel = document.getElementById(panelId);
            if (targetPanel) {
              targetPanel.style.display = 'block';
              targetPanel.classList.add('active-panel');
            }
          }

          if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // ─────────────────────────────────────────
  // PROFILE DROPDOWN
  // ─────────────────────────────────────────
  function initProfileDropdown() {
    const wrapper = document.querySelector('.topbar-profile-wrapper');
    const btn = document.getElementById('topbar-profile-btn');
    const avatar = document.getElementById('topbar-avatar');
    const dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) return;

    function toggleDropdown(e) {
      if (e) {
        e.stopPropagation();
      }
      dropdown.classList.toggle('open');
    }

    if (btn) {
      btn.addEventListener('click', toggleDropdown);
    }
    if (avatar && avatar !== btn) {
      avatar.addEventListener('click', toggleDropdown);
    }

    document.addEventListener('click', function (e) {
      if (dropdown.classList.contains('open')) {
        const isClickInside = dropdown.contains(e.target) || 
                              (wrapper && wrapper.contains(e.target)) || 
                              (btn && btn.contains(e.target)) || 
                              (avatar && avatar.contains(e.target));
        if (!isClickInside) {
          dropdown.classList.remove('open');
        }
      }
    });
  }

  // ─────────────────────────────────────────
  // PROGRESS BARS (animate on scroll)
  // ─────────────────────────────────────────
  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-bar, .analytics-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.dataset.width || el.style.width;
          el.style.width = '0%';
          setTimeout(function () {
            el.style.width = target;
          }, 200);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) {
      const w = bar.getAttribute('data-width') || bar.style.width;
      bar.dataset.width = w;
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  // ─────────────────────────────────────────
  // COUNTER ANIMATION
  // ─────────────────────────────────────────
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = isFloat ? (eased * target).toFixed(1) : Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ─────────────────────────────────────────
  // GSAP ANIMATIONS (Phase 2)
  // ─────────────────────────────────────────
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Universal Premium Hero Entrance Animation Formula ──
    const heroSection = document.querySelector('.hero-section, .page-hero');
    if (heroSection) {
      const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion) {
        const preloader = document.getElementById('preloader');
        const startDelay = (preloader && !preloader.classList.contains('hidden')) ? 1.4 : 0.15;

        const heroLabel = heroSection.querySelector('.hero-label');
        const heroTitle = heroSection.querySelector('.hero-title');
        const titleLines = heroSection.querySelectorAll('.hero-title .title-line');
        const heroDesc = heroSection.querySelector('.hero-desc');
        const heroActions = heroSection.querySelector('.hero-actions');
        const leftBtn = heroActions ? (heroActions.querySelector('.btn-primary') || heroActions.children[0]) : null;
        const rightBtn = heroActions ? (heroActions.querySelector('.btn-secondary') || heroActions.children[1]) : null;
        const heroVisual = heroSection.querySelector('.hero-visual, .hero-image-wrapper');
        const metricCards = heroSection.querySelectorAll('.metric-card');

        // Structuring title lines into black text spans and orange em tags for directional animation
        if (titleLines && titleLines.length > 0) {
          titleLines.forEach(function (line) {
            const childNodes = Array.from(line.childNodes);
            childNodes.forEach(function (node) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                const span = document.createElement('span');
                span.className = 'title-black';
                span.style.display = 'inline-block';
                span.textContent = node.textContent;
                line.insertBefore(span, node);
                line.removeChild(node);
              } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'em') {
                node.style.display = 'inline-block';
              }
            });
          });
        }

        const blackHeadings = heroSection.querySelectorAll('.hero-title .title-black');
        const orangeHeadings = heroSection.querySelectorAll('.hero-title em');

        const tl = gsap.timeline({
          delay: startDelay,
          defaults: { ease: 'power3.out' }
        });

        // 0. Hero Eyebrow Tag (if present)
        if (heroLabel) {
          tl.from(heroLabel, { opacity: 0, y: -15, duration: 0.5 });
        }

        // 1. Black / Primary Heading (animates from the LEFT side into position)
        if (blackHeadings && blackHeadings.length > 0) {
          tl.from(blackHeadings, {
            opacity: 0,
            x: -70,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out'
          }, heroLabel ? '-=0.25' : 0);
        } else if (heroTitle) {
          tl.from(heroTitle, { opacity: 0, x: -70, duration: 0.85, ease: 'power3.out' }, 0);
        }

        // 2. Orange Accent Heading (animates from the RIGHT side into position)
        if (orangeHeadings && orangeHeadings.length > 0) {
          tl.from(orangeHeadings, {
            opacity: 0,
            x: 70,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out'
          }, '-=0.65');
        }

        // 3. Supporting Description (animates from BELOW upward into position)
        if (heroDesc) {
          tl.from(heroDesc, {
            opacity: 0,
            y: 35,
            duration: 0.75,
            ease: 'power3.out'
          }, '-=0.5');
        }

        // 4. Left Button (animates from the LEFT side into position)
        if (leftBtn) {
          tl.from(leftBtn, {
            opacity: 0,
            x: -50,
            duration: 0.7,
            ease: 'power3.out'
          }, '-=0.45');
        }

        // 5. Right Button (animates from the RIGHT side into position)
        if (rightBtn) {
          tl.from(rightBtn, {
            opacity: 0,
            x: 50,
            duration: 0.7,
            ease: 'power3.out'
          }, '-=0.6');
        }

        // 6. Hero Image (Center-split animation handles image reveal)
        if (heroVisual) {
          gsap.set(heroVisual, { opacity: 1, visibility: 'visible' });
        }

        // 7. Floating metric cards completion
        if (metricCards && metricCards.length > 0) {
          tl.from(metricCards, {
            opacity: 0,
            y: 25,
            scale: 0.9,
            duration: 0.55,
            stagger: 0.15,
            ease: 'back.out(1.5)',
            clearProps: 'transform,opacity'
          }, '-=0.4');
        }
      }
    }

    // Service cards stagger animation
    if (document.querySelector('.services-grid')) {
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 90%',
          toggleActions: 'play none play reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    // Testimonial cards stagger animation
    if (document.querySelector('.testimonials-grid')) {
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 90%',
          toggleActions: 'play none play reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    // Framework cards stagger animation
    if (document.querySelector('.framework-grid')) {
      gsap.from('.framework-card', {
        scrollTrigger: {
          trigger: '.framework-grid',
          start: 'top 90%',
          toggleActions: 'play none play reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    // Case study cards stagger animation
    if (document.querySelector('.case-studies-grid')) {
      gsap.from('.case-study-card', {
        scrollTrigger: {
          trigger: '.case-studies-grid',
          start: 'top 90%',
          toggleActions: 'play none play reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    // Section headers
    gsap.utils.toArray('.section-title').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none play reverse' },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'all'
      });
    });

    // Image reveals handled globally by init3DCornerUnfoldAnimation()


    // Article cards stagger animation
    if (document.querySelector('.articles-grid')) {
      gsap.from('.article-card', {
        scrollTrigger: {
          trigger: '.articles-grid',
          start: 'top 90%',
          toggleActions: 'play none play reverse',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    // Initialize Shuffle and Arrange Card Animation
    initShuffleArrangeAnimation();

    // Initialize Center-Split Hero Image Reveal Animation
    initHeroImageSplitAnimation();
  }

  // ─────────────────────────────────────────
  // CENTER-SPLIT HERO IMAGE REVEAL ANIMATION SYSTEM
  // ─────────────────────────────────────────
  function initHeroImageSplitAnimation() {
    if (typeof gsap === 'undefined') return;
    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Target hero section images across all 5 pages
    const heroImages = document.querySelectorAll('.hero-section .hero-image-main, .page-hero .hero-image-main, .hero-visual img, .hero-image-wrapper img');

    heroImages.forEach(function (imgEl) {
      if (!imgEl || imgEl.classList.contains('center-split-processed')) return;
      imgEl.classList.add('center-split-processed');

      // Create Center-Split wrapper structure
      const wrapper = document.createElement('div');
      wrapper.className = 'center-split-wrapper';

      const container = document.createElement('div');
      container.className = 'center-split-container';

      const leftHalf = document.createElement('div');
      leftHalf.className = 'center-split-half center-split-left';

      const rightHalf = document.createElement('div');
      rightHalf.className = 'center-split-half center-split-right';

      const imgLeft = imgEl.cloneNode(true);
      imgLeft.className = 'center-split-img';
      imgLeft.removeAttribute('id');

      const imgRight = imgEl.cloneNode(true);
      imgRight.className = 'center-split-img';
      imgRight.removeAttribute('id');

      leftHalf.appendChild(imgLeft);
      rightHalf.appendChild(imgRight);

      container.appendChild(leftHalf);
      container.appendChild(rightHalf);
      wrapper.appendChild(container);

      // Replace original img element with center-split wrapper
      const parent = imgEl.parentNode;
      parent.insertBefore(wrapper, imgEl);
      parent.removeChild(imgEl);

      if (isReducedMotion) return;

      // Set initial 3D center-split state: Left half pushed left, Right half pushed right
      gsap.set(leftHalf, {
        transformOrigin: '100% 50%',
        xPercent: -45,
        rotateY: 42,
        translateZ: -60,
        opacity: 0
      });

      gsap.set(rightHalf, {
        transformOrigin: '0% 50%',
        xPercent: 45,
        rotateY: -42,
        translateZ: -60,
        opacity: 0
      });

      // Animate both halves from split state inward/together into seamless final position
      const preloader = document.getElementById('preloader');
      const delayTime = (preloader && !preloader.classList.contains('hidden')) ? 1.4 : 0.2;

      const tl = gsap.timeline({
        delay: delayTime,
        defaults: { ease: 'power3.out' }
      });

      tl.to(leftHalf, {
        xPercent: 0,
        rotateY: 0,
        translateZ: 0,
        opacity: 1,
        duration: 1.25
      }, 0);

      tl.to(rightHalf, {
        xPercent: 0,
        rotateY: 0,
        translateZ: 0,
        opacity: 1,
        duration: 1.25
      }, 0);

      tl.eventCallback('onComplete', function () {
        wrapper.style.overflow = 'hidden';
      });
    });
  }

  // ─────────────────────────────────────────
  // SHUFFLE AND ARRANGE CARD ANIMATION SYSTEM
  // ─────────────────────────────────────────
  function initShuffleArrangeAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const processContainers = document.querySelectorAll('.process-steps, .methodology-steps');

    processContainers.forEach(function (container) {
      const stepItems = Array.from(container.querySelectorAll('.process-step, .method-step'));
      if (!stepItems.length) return;

      const isMobile = window.innerWidth < 768;

      stepItems.forEach(function (item, index) {
        const cardContent = item.querySelector('.process-step-content') || item;
        const numberTag = item.querySelector('.process-step-number, .step-number-circle');
        const offsetMultiplier = index - (stepItems.length - 1) / 2;
        const rot = (index % 2 === 0 ? -1 : 1) * (7 + index * 4);
        const xOffset = isMobile ? (index % 2 === 0 ? -35 : 35) : offsetMultiplier * 110;
        const yOffset = 45 + Math.abs(offsetMultiplier) * 20;

        // Set initial shuffled card deck layout
        gsap.set(cardContent, {
          x: xOffset,
          y: yOffset,
          rotation: rot,
          scale: 0.88,
          opacity: 0,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.22)',
          transformOrigin: '50% 50%'
        });

        if (numberTag) {
          gsap.set(numberTag, {
            opacity: 0,
            scale: 0.7,
            y: 20
          });
        }
      });

      // Create ScrollTrigger Shuffle & Arrange Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none play reverse'
        }
      });

      const cardsContent = stepItems.map(function(item) {
        return item.querySelector('.process-step-content') || item;
      });

      const numberTags = stepItems.map(function(item) {
        return item.querySelector('.process-step-number, .step-number-circle');
      }).filter(Boolean);

      // Phase 1: Rapid shuffle fan-out lift
      tl.to(cardsContent, {
        opacity: 1,
        scale: 0.95,
        y: function(i) { return -35 + (i % 2) * 15; },
        duration: 0.5,
        stagger: 0.09,
        ease: 'power2.out'
      });

      // Phase 2: Smooth Arrange & snap into grid order
      tl.to(cardsContent, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        duration: 0.9,
        stagger: 0.12,
        ease: 'back.out(1.2)',
        clearProps: 'transform,boxShadow'
      }, '-=0.25');

      // Phase 3: Reveal numbers
      if (numberTags.length) {
        tl.to(numberTags, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        }, '-=0.8');
      }
    });
  }

  // ─────────────────────────────────────────
  // GLOBAL 6-CARD PATTERN ANIMATION & PERIMETER BORDER SYSTEM
  // ─────────────────────────────────────────
  function initGlobalSixCardAnimation() {
    const gridSelectors = [
      '.expertise-grid',
      '.principles-grid',
      '.services-grid',
      '.framework-grid',
      '.articles-grid',
      '.case-studies-grid',
      '.global-six-card-grid'
    ];

    const gridContainers = document.querySelectorAll(gridSelectors.join(', '));
    if (!gridContainers.length) return;

    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gridContainers.forEach(function (gridEl) {
      // Collect matching card children
      const cards = Array.from(gridEl.children).filter(function (child) {
        const cls = child.className || '';
        return cls.indexOf('card') !== -1 || cls.indexOf('global-animated-card') !== -1;
      });

      if (cards.length < 6) return;

      // 1. Dynamic SVG Perimeter Border Overlay Injection
      cards.forEach(function (card) {
        card.classList.add('global-animated-card');

        // Inject SVG overlay if not already present
        if (!card.querySelector('.card-perimeter-svg')) {
          const svgNs = 'http://www.w3.org/2000/svg';
          const svg = document.createElementNS(svgNs, 'svg');
          svg.setAttribute('class', 'card-perimeter-svg');
          svg.setAttribute('viewBox', '0 0 100 100');
          svg.setAttribute('preserveAspectRatio', 'none');

          const rect = document.createElementNS(svgNs, 'rect');
          rect.setAttribute('x', '0.5');
          rect.setAttribute('y', '0.5');
          rect.setAttribute('width', '99');
          rect.setAttribute('height', '99');
          rect.setAttribute('rx', '4');
          rect.setAttribute('ry', '4');
          rect.setAttribute('vector-effect', 'non-scaling-stroke');

          svg.appendChild(rect);
          card.appendChild(svg);
        }

        // Clean up CSS reveal-on-scroll classes to prevent animation conflicts
        card.classList.remove('reveal-on-scroll', 'delay-100', 'delay-200', 'delay-300', 'delay-400');
      });

      // 2. Zigzag Entrance Sequence:
      // Card 1 (0) -> Card 4 (3) -> Card 2 (1) -> Card 5 (4) -> Card 3 (2) -> Card 6 (5)
      const zigzagMap = [0, 3, 1, 4, 2, 5];
      const orderedCards = [];

      zigzagMap.forEach(function (i) {
        if (cards[i]) orderedCards.push(cards[i]);
      });

      // Include extra cards if grid > 6
      if (cards.length > 6) {
        cards.forEach(function (c, idx) {
          if (!zigzagMap.includes(idx)) orderedCards.push(c);
        });
      }

      if (!isReducedMotion && window.gsap) {
        // Set initial offset state
        gsap.set(orderedCards, { opacity: 0, y: 35, scale: 0.96 });

        gsap.to(orderedCards, {
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 80%',
            toggleActions: 'play none play reverse'
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        });
      }
    });
  }

  // ─────────────────────────────────────────
  // ORBITAL TRACE SEQUENTIAL REVEAL (Methodology Timeline Section)
  // ─────────────────────────────────────────
  function initOrbitalTraceAnimation() {
    const methodologyGrid = document.querySelector('.methodology-steps');
    if (!methodologyGrid) return;

    const steps = methodologyGrid.querySelectorAll('.method-step');
    if (!steps.length) return;

    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Inject Connecting Line Track & SVG Orbital Circle Traces
    if (!methodologyGrid.querySelector('.methodology-track-line')) {
      const trackLine = document.createElement('div');
      trackLine.className = 'methodology-track-line';

      const progressFill = document.createElement('div');
      progressFill.className = 'methodology-track-progress';
      trackLine.appendChild(progressFill);

      methodologyGrid.insertBefore(trackLine, methodologyGrid.firstChild);
    }

    steps.forEach(function (step) {
      const circle = step.querySelector('.step-number-circle');
      if (circle) {
        // Inject Constellation Pulse Outer Ring if not present
        if (!circle.querySelector('.constellation-pulse-ring')) {
          const pulseRing = document.createElement('div');
          pulseRing.className = 'constellation-pulse-ring';
          circle.appendChild(pulseRing);
        }

        // Inject SVG Orbital Circle Trace if not present
        if (!circle.querySelector('.orbital-circle-svg')) {
          const svgNs = 'http://www.w3.org/2000/svg';
          const svg = document.createElementNS(svgNs, 'svg');
          svg.setAttribute('class', 'orbital-circle-svg');
          svg.setAttribute('viewBox', '0 0 72 72');

          const path = document.createElementNS(svgNs, 'circle');
          path.setAttribute('class', 'orbital-circle-path');
          path.setAttribute('cx', '36');
          path.setAttribute('cy', '36');
          path.setAttribute('r', '32');

          svg.appendChild(path);
          circle.appendChild(svg);
        }
      }
    });

    if (isReducedMotion || !window.gsap) return;

    const progressFill = methodologyGrid.querySelector('.methodology-track-progress');

    // 2. Build Sequential GSAP Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: methodologyGrid,
        start: 'top 75%',
        toggleActions: 'play none play reverse'
      }
    });

    steps.forEach(function (step, index) {
      const circle = step.querySelector('.step-number-circle');
      const orbitalPath = step.querySelector('.orbital-circle-path');
      const title = step.querySelector('h4');
      const desc = step.querySelector('p');

      // Initial states
      if (circle) gsap.set(circle, { opacity: 0.3, scale: 0.9 });
      if (title) gsap.set(title, { opacity: 0, y: 18 });
      if (desc) gsap.set(desc, { opacity: 0, y: 18 });

      // Step Orbit & Activation
      if (orbitalPath) {
        tl.to(orbitalPath, {
          strokeDashoffset: 0,
          duration: 0.7,
          ease: 'power2.inOut'
        });
      }

      if (circle) {
        tl.to(circle, {
          opacity: 1,
          scale: 1,
          boxShadow: '0 0 20px rgba(223, 177, 91, 0.45)',
          duration: 0.3,
          ease: 'power3.out'
        }, '-=0.2');
      }

      // Title & Desc Reveal
      if (title) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out'
        }, '-=0.15');
      }

      if (desc) {
        tl.to(desc, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out'
        }, '-=0.25');
      }

      // Connecting Progress Line Trace to Next Step
      if (progressFill && index < steps.length - 1) {
        const targetPercent = Math.round(((index + 1) / (steps.length - 1)) * 100);
        tl.to(progressFill, {
          width: targetPercent + '%',
          duration: 0.45,
          ease: 'power2.inOut'
        }, '+=0.05');
      }
    });

    // Clear Inline GSAP Transforms on Titles & Descs after timeline completes
    tl.eventCallback('onComplete', function () {
      steps.forEach(function (step) {
        const title = step.querySelector('h4');
        const desc = step.querySelector('p');
        if (title) gsap.set(title, { clearProps: 'transform,opacity' });
        if (desc) gsap.set(desc, { clearProps: 'transform,opacity' });
      });
    });
  }

  // ─────────────────────────────────────────
  // TESTIMONIAL 4-CARD LIVE HORIZONTAL MARQUEE CAROUSEL
  // ─────────────────────────────────────────
  function initTestimonialMarquee() {
    const wrapper = document.getElementById('testimonials-marquee');
    if (!wrapper) return;

    const track = wrapper.querySelector('.testimonial-marquee-track');
    if (!track) return;

    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || !window.gsap) return;

    // Create continuous smooth GSAP infinite marquee animation
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 28,
      repeat: -1
    });

    // Hover interaction: smooth slow down on hover, resume on mouse leave
    wrapper.addEventListener('mouseenter', function () {
      gsap.to(tween, { timeScale: 0.15, duration: 0.6 });
    });

    wrapper.addEventListener('mouseleave', function () {
      gsap.to(tween, { timeScale: 1, duration: 0.6 });
    });
  }

  // ─────────────────────────────────────────
  // GLOBAL LONG-CARD ANIMATION SYSTEM & THREE-CARD DIRECTIONAL CHOREOGRAPHY
  // ─────────────────────────────────────────
  function initGlobalLongCardAnimation() {
    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap) return;

    const gridSelectors = [
      '.articles-grid',
      '.insights-grid',
      '.case-studies-grid',
      '.programs-grid',
      '.global-long-card-grid'
    ];

    gridSelectors.forEach(function (selector) {
      const grids = document.querySelectorAll(selector);

      grids.forEach(function (grid) {
        const cards = Array.from(grid.querySelectorAll('.article-card, .insight-card, .program-detail-card, .executive-light-card'));
        if (!cards.length) return;

        cards.forEach(function (card) {
          card.classList.remove('reveal-on-scroll', 'revealed');
          card.classList.add('executive-light-card');
        });

        if (isReducedMotion) return;

        const isDesktop = window.innerWidth >= 1024;
        const isThreeCardLayout = cards.length === 3;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'top 78%',
            toggleActions: 'play none play reverse'
          }
        });

        if (isDesktop && isThreeCardLayout) {
          // 3-CARD DIRECTIONAL CHOREOGRAPHY (Desktop)
          // Card 0 (Left):  from BELOW (y: 45)
          // Card 1 (Center): from INSIDE/CENTER (scale: 0.92, opacity: 0)
          // Card 2 (Right): from ABOVE (y: -45)

          const imgWrappers = cards.map(c => c.querySelector('.article-card-image-wrap, .insight-img-wrapper, .program-img-wrapper'));
          const images = cards.map(c => c.querySelector('.article-card-image, .insight-img-wrapper img, .program-img-wrapper img'));
          const bodyWrappers = cards.map(c => c.querySelector('.article-card-body, .insight-body, .program-body'));

          // Set Initial Directional States
          gsap.set(cards[0], { opacity: 0, y: 45 });
          gsap.set(cards[1], { opacity: 0, scale: 0.92, y: 0 });
          gsap.set(cards[2], { opacity: 0, y: -45 });

          imgWrappers.forEach(w => { if (w) gsap.set(w, { clipPath: 'inset(0% 0% 100% 0%)' }); });
          images.forEach(img => { if (img) gsap.set(img, { scale: 1.12 }); });
          bodyWrappers.forEach(b => { if (b) gsap.set(b, { opacity: 0, y: 24 }); });

          // Step 1: Directional Card Assembly + Image Clip-Path Reveals
          // Left Card (0) from Below
          tl.to(cards[0], { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
          if (imgWrappers[0]) {
            tl.to(imgWrappers[0], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out' }, '<');
          }
          if (images[0]) {
            tl.to(images[0], { scale: 1, duration: 0.75, ease: 'power3.out' }, '<');
          }

          // Center Card (1) from Within Center
          tl.to(cards[1], { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }, '-=0.45');
          if (imgWrappers[1]) {
            tl.to(imgWrappers[1], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out' }, '<');
          }
          if (images[1]) {
            tl.to(images[1], { scale: 1, duration: 0.75, ease: 'power3.out' }, '<');
          }

          // Right Card (2) from Above
          tl.to(cards[2], { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');
          if (imgWrappers[2]) {
            tl.to(imgWrappers[2], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out' }, '<');
          }
          if (images[2]) {
            tl.to(images[2], { scale: 1, duration: 0.75, ease: 'power3.out' }, '<');
          }

          // Step 2: Content Reveals from Below (Staggered Left -> Center -> Right)
          bodyWrappers.forEach((body, idx) => {
            if (body) {
              tl.to(body, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out'
              }, idx === 0 ? '-=0.3' : '-=0.35');
            }
          });

          tl.eventCallback('onComplete', function () {
            cards.forEach(c => gsap.set(c, { clearProps: 'transform,opacity' }));
            imgWrappers.forEach(w => { if (w) gsap.set(w, { clearProps: 'clipPath' }); });
            images.forEach(img => { if (img) gsap.set(img, { clearProps: 'transform' }); });
            bodyWrappers.forEach(b => { if (b) gsap.set(b, { clearProps: 'transform,opacity' }); });
          });

        } else {
          // SEQUENTIAL IMAGE-FIRST REVEAL (Mobile / Multi-Card)
          cards.forEach(function (card) {
            const imgWrap = card.querySelector('.article-card-image-wrap, .insight-img-wrapper, .program-img-wrapper');
            const img = card.querySelector('.article-card-image, .insight-img-wrapper img, .program-img-wrapper img');
            const body = card.querySelector('.article-card-body, .insight-body, .program-body');

            gsap.set(card, { opacity: 0, y: 30 });
            if (imgWrap) gsap.set(imgWrap, { clipPath: 'inset(0% 0% 100% 0%)' });
            if (img) gsap.set(img, { scale: 1.10 });
            if (body) gsap.set(body, { opacity: 0, y: 20 });

            tl.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.35');
            if (imgWrap) tl.to(imgWrap, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.out' }, '<');
            if (img) tl.to(img, { scale: 1, duration: 0.65, ease: 'power3.out' }, '<');
            if (body) tl.to(body, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25');
          });

          tl.eventCallback('onComplete', function () {
            cards.forEach(function (c) {
              gsap.set(c, { clearProps: 'transform,opacity' });
              const imgWrap = c.querySelector('.article-card-image-wrap, .insight-img-wrapper, .program-img-wrapper');
              const img = c.querySelector('.article-card-image, .insight-img-wrapper img, .program-img-wrapper img');
              const body = c.querySelector('.article-card-body, .insight-body, .program-body');
              if (imgWrap) gsap.set(imgWrap, { clearProps: 'clipPath' });
              if (img) gsap.set(img, { clearProps: 'transform' });
              if (body) gsap.set(body, { clearProps: 'transform,opacity' });
            });
          });
        }
      });
    });
  }

  // ─────────────────────────────────────────
  // GLOBAL 3D CORNER UNFOLD ANIMATION SYSTEM (Left Content + Right Image)
  // ─────────────────────────────────────────
  // ─────────────────────────────────────────
  // GLOBAL 3D IMAGE WRAPPING & CORNER UNFOLD ANIMATION SYSTEM
  // ─────────────────────────────────────────
  function init3DCornerUnfoldAnimation() {
    if (!window.gsap) return;
    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Selector targeting all major non-hero images across pages
    const imageSelectors = [
      '.service-card-image',
      '.transformation-image',
      '.philosophy-image img',
      '.insight-feature-image img',
      '.program-image img',
      '.case-study-image',
      '.article-card-image',
      '.auth-visual-img',
      '.unfold-3d-target'
    ];

    // Directions sequence for dynamic variety across multi-card layouts
    const directions = ['top-left', 'top-right', 'bottom-left'];
    let dirIndex = 0;

    // Find all target images or wrappers
    const targets = document.querySelectorAll(imageSelectors.join(', '));

    targets.forEach(function (el) {
      // Avoid tiny avatars or icons
      if (el.classList.contains('author-img-thumb') || el.classList.contains('preloader-logo')) return;

      let wrapper = el.closest('.unfold-3d-card-wrapper');
      let imgContainer = null;
      let img = el.tagName && el.tagName.toLowerCase() === 'img' ? el : el.querySelector('img');
      if (!img) return;

      // Wrap dynamically if not already wrapped
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'unfold-3d-card-wrapper';

        // Assign directional flow
        const chosenDir = el.getAttribute('data-unfold-dir') || img.getAttribute('data-unfold-dir') || directions[dirIndex % directions.length];
        dirIndex++;
        wrapper.setAttribute('data-unfold-dir', chosenDir);

        imgContainer = document.createElement('div');
        imgContainer.className = 'unfold-3d-img-container';

        // Preserve parent node layout: wrap img directly
        const parent = img.parentNode;
        parent.insertBefore(wrapper, img);

        imgContainer.appendChild(img);
        wrapper.appendChild(imgContainer);

        // Inject 3D Wrapping sheet layer structure
        const sheetOverlay = document.createElement('div');
        sheetOverlay.className = 'unfold-3d-sheet-overlay';

        const mainSheet = document.createElement('div');
        mainSheet.className = 'unfold-3d-main-sheet';

        const cornerPeel = document.createElement('div');
        cornerPeel.className = 'unfold-3d-corner-peel';

        const foldLine = document.createElement('div');
        foldLine.className = 'unfold-3d-fold-line';

        const shadowDrop = document.createElement('div');
        shadowDrop.className = 'unfold-3d-shadow-drop';

        sheetOverlay.appendChild(mainSheet);
        sheetOverlay.appendChild(cornerPeel);
        sheetOverlay.appendChild(foldLine);
        sheetOverlay.appendChild(shadowDrop);

        wrapper.appendChild(sheetOverlay);
      } else {
        imgContainer = wrapper.querySelector('.unfold-3d-img-container');
      }

      const sheetOverlay = wrapper.querySelector('.unfold-3d-sheet-overlay');
      const mainSheet = wrapper.querySelector('.unfold-3d-main-sheet');
      const cornerPeel = wrapper.querySelector('.unfold-3d-corner-peel');
      const shadowDrop = wrapper.querySelector('.unfold-3d-shadow-drop');
      const dir = wrapper.getAttribute('data-unfold-dir') || 'top-left';

      if (isReducedMotion) {
        if (sheetOverlay) sheetOverlay.style.display = 'none';
        return;
      }

      // Check if hero image or grid card
      const isHero = wrapper.closest('.hero-section, .about-hero, .hero-visual, .page-hero') !== null;
      let staggerDelay = 0;

      if (!isHero) {
        const cardGridParent = wrapper.closest('.services-grid, .articles-grid, .case-studies-grid, .framework-grid');
        if (cardGridParent) {
          const siblings = Array.from(cardGridParent.querySelectorAll('.unfold-3d-card-wrapper'));
          const siblingIndex = siblings.indexOf(wrapper);
          if (siblingIndex > 0) {
            staggerDelay = (siblingIndex % 3) * 0.15;
          }
        }
      }

      // Set Initial 3D Unfold State
      const isTopRight = dir === 'top-right';
      const isBottomLeft = dir === 'bottom-left';

      const rotYInitial = isTopRight ? 45 : (isBottomLeft ? -40 : -45);
      const rotXInitial = isBottomLeft ? 45 : -35;
      const origin = isTopRight ? '100% 0%' : (isBottomLeft ? '0% 100%' : '0% 0%');

      gsap.set(sheetOverlay, {
        transformOrigin: origin,
        perspective: 1400,
        display: 'block'
      });

      gsap.set(mainSheet, {
        transformOrigin: origin,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1
      });

      gsap.set(cornerPeel, {
        transformOrigin: origin,
        rotateX: rotXInitial,
        rotateY: rotYInitial,
        translateZ: 35,
        scale: 0.95,
        opacity: 0.95
      });

      if (shadowDrop) {
        gsap.set(shadowDrop, { opacity: 0.8 });
      }

      if (img) {
        gsap.set(img, { scale: 1.08, visibility: 'visible', opacity: 1 });
      }

      // Create Unfold Timeline
      const tl = gsap.timeline({
        delay: isHero ? 0.15 : staggerDelay,
        scrollTrigger: {
          trigger: wrapper,
          start: isHero ? 'top 100%' : 'top 85%',
          toggleActions: 'play none play reverse'
        },
        onComplete: function() {
          if (sheetOverlay) sheetOverlay.style.display = 'none';
        }
      });

      // Step 1: Corner Flap 3D Peel Curl
      tl.to(cornerPeel, {
        rotateX: rotXInitial * 2.2,
        rotateY: rotYInitial * 2.2,
        translateZ: 85,
        scale: 0.85,
        opacity: 0.7,
        duration: 0.45,
        ease: 'power3.inOut'
      });

      // Step 2: Main Sheet 3D Unfold away from image
      tl.to(mainSheet, {
        rotateY: isTopRight ? -85 : 85,
        rotateX: isBottomLeft ? -75 : 65,
        translateZ: 120,
        opacity: 0,
        duration: 0.95,
        ease: 'power3.out'
      }, '-=0.2');

      tl.to(cornerPeel, {
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out'
      }, '-=0.7');

      // Step 3: Image Settles completely static to scale 1.00
      if (img) {
        tl.to(img, {
          scale: 1,
          duration: 1.1,
          ease: 'power4.out'
        }, '-=1.0');
      }

      // Step 4: Shadow Drop Fades Out
      if (shadowDrop) {
        tl.to(shadowDrop, {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.9');
      }

      // Clean up after reveal so mouse hover and performance remain 100% sharp
      tl.eventCallback('onComplete', function () {
        if (sheetOverlay) sheetOverlay.style.display = 'none';
        if (img) gsap.set(img, { clearProps: 'transform' });
      });

    });
  }

  // ─────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initFAQ();
    initDashboardSidebar();
    initProfileDropdown();
    initNotificationRedirect();
    initProgressBars();
    initCounters();
    initGlobalSixCardAnimation();
    initOrbitalTraceAnimation();
    initTestimonialMarquee();
    initGlobalLongCardAnimation();
    init3DCornerUnfoldAnimation();

    // GSAP — run after short delay to let layout settle
    setTimeout(function() {
      initGSAP();
      initGlobalSixCardAnimation();
      initOrbitalTraceAnimation();
      initTestimonialMarquee();
      initGlobalLongCardAnimation();
      init3DCornerUnfoldAnimation();
    }, 100);
  });

  // ─────────────────────────────────────────
  // NOTIFICATION BELL REDIRECT TO 404
  // ─────────────────────────────────────────
  function initNotificationRedirect() {
    const notifBtns = document.querySelectorAll('.topbar-notification');
    notifBtns.forEach(function (btn) {
      btn.setAttribute('href', '404.html');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '404.html';
      });
    });

    const sessionBtns = document.querySelectorAll('a.service-link');
    sessionBtns.forEach(function (btn) {
      if (btn.textContent.includes('Request Additional Session')) {
        btn.setAttribute('href', '404.html');
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          window.location.href = '404.html';
        });
      }
    });
  }

})();
