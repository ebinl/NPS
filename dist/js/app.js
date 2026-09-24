/**
 * NPS HOPEFARM - MAIN APPLICATION CONTROLLER
 * Handles Router, Navigation, Enquiry Drawer, Careers Modal, FAQ Search, Tabs & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initNavigation();
  initRouter();
  initEnquiryDrawer();
  initCareersModal();
  initFaqAccordion();
  initInfrastructureFilters();
  initScheduleTabs();
  initForms();
  initHappeningsSlider();
  initWhatsAppSelector();
  initPageScrollControls();
  initLeadershipModal();
});

/* ==========================================================================
   NAVIGATION & HEADER
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle') || document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileCloseBtn = document.getElementById('mobile-nav-close');

  // Multi-page active navigation synchronization
  let cleanCurrent = 'index';
  try {
    const path = window.location.pathname.replace(/\/$/, '');
    const currentFile = path.split('/').pop() || 'index.html';
    cleanCurrent = currentFile.replace('.html', '');

    document.querySelectorAll('.nav-menu .nav-link, #mobile-nav-drawer .mobile-nav-link, #mobile-nav-drawer .mobile-sublink').forEach(link => {
      const href = link.getAttribute('href') || '';
      const hrefFile = href.split('#')[0].split('/').pop().replace('.html', '');
      if (hrefFile && (hrefFile === cleanCurrent || (cleanCurrent === '' && hrefFile === 'index'))) {
        link.classList.add('active');
        const parentAccordion = link.closest('.mobile-nav-accordion');
        if (parentAccordion) {
          parentAccordion.classList.add('open');
        }
      }
    });
  } catch (e) {
    // Graceful fallback
  }

  // Sticky header scroll elevation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Ensure Mobile Drawer Backdrop Overlay exists
  let mobileOverlay = document.getElementById('mobile-nav-overlay');
  if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.id = 'mobile-nav-overlay';
    mobileOverlay.className = 'mobile-nav-overlay';
    document.body.appendChild(mobileOverlay);
  }

  function openMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('active');
      if (mobileToggleBtn) mobileToggleBtn.classList.add('active');
      if (mobileOverlay) mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('active');
      if (mobileToggleBtn) mobileToggleBtn.classList.remove('active');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Mobile menu toggle click
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close on close button click
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  // Close on backdrop overlay click
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Accordion toggle in mobile drawer (e.g. About Us & Programmes)
  document.querySelectorAll('.mobile-accordion-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentAccordion = btn.closest('.mobile-nav-accordion');
      if (parentAccordion) {
        const isOpen = parentAccordion.classList.contains('open');
        // Auto-close sibling accordions for clean accordion behavior
        document.querySelectorAll('.mobile-nav-accordion').forEach(acc => {
          if (acc !== parentAccordion) {
            acc.classList.remove('open');
          }
        });
        if (isOpen) {
          parentAccordion.classList.remove('open');
        } else {
          parentAccordion.classList.add('open');
        }
      }
    });
  });

  // Close mobile drawer when clicking any page link (skip accordion toggle buttons)
  document.querySelectorAll('#mobile-nav-drawer a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });
}

/* ==========================================================================
   FLOATING PAGE SCROLL CONTROLS
   ========================================================================== */
function initPageScrollControls() {
  const controls = document.querySelector('.page-scroll-controls');
  if (!controls) return;

  const buttons = controls.querySelectorAll('[data-scroll-direction]');
  if (!buttons.length) return;

  let scrollUpdatePending = false;

  function updateButtonStates() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const isAtTop = scrollTop <= 10;
    const isAtBottom = scrollTop >= maxScroll - 10;

    controls.querySelector('[data-scroll-direction="up"]')?.toggleAttribute('disabled', isAtTop);
    controls.querySelector('[data-scroll-direction="down"]')?.toggleAttribute('disabled', isAtBottom);
    scrollUpdatePending = false;
  }

  function requestButtonStateUpdate() {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(updateButtonStates);
  }

  function jumpTo(targetY) {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({
      top: targetY,
      left: 0,
      behavior: 'instant'
    });
    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
      updateButtonStates();
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const isUp = button.dataset.scrollDirection === 'up';
      if (isUp) {
        jumpTo(0);
      } else {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        jumpTo(maxScroll);
      }
    });
  });

  window.addEventListener('scroll', requestButtonStateUpdate, { passive: true });
  window.addEventListener('resize', requestButtonStateUpdate);
  updateButtonStates();
}

/* ==========================================================================
   ROUTER & DEEP LINKING
   ========================================================================== */
function initRouter() {
  function instantJumpToElement(targetEl, offset = 80) {
    if (!targetEl) return;
    targetEl.classList.add('visible');
    targetEl.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

    const elementPosition = targetEl.getBoundingClientRect().top;
    const offsetPosition = Math.max(0, elementPosition + window.scrollY - offset);

    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    window.scrollTo({
      top: offsetPosition,
      left: 0,
      behavior: 'instant'
    });

    requestAnimationFrame(() => {
      root.style.scrollBehavior = prevBehavior;
    });
  }

  function handleHash() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return;

    const isInstant = hash.includes('gallery') || hash.includes('events') ||
                      hash.includes('school-leadership') || hash.includes('leadership-message') ||
                      hash.includes('chairman-message') || hash.includes('secretary-message') ||
                      hash.includes('principals-message');

    // Direct section scroll
    const targetEl = document.querySelector(hash.replace('/', '-').replace('/', '-'));
    if (targetEl) {
      targetEl.classList.add('visible');
      targetEl.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

      if (isInstant) {
        instantJumpToElement(targetEl);
      } else {
        const headerOffset = 100;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    // Specific sub-tab or modal activations
    if (hash.includes('vision-and-mission')) {
      const tab = document.getElementById('about-vm-anchor') || document.getElementById('about-vision-mission');
      if (tab) {
        tab.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (hash.includes('the-leadership')) {
      const leadershipSec = document.getElementById('leadership-section') || document.getElementById('about-the-leadership');
      if (leadershipSec) {
        instantJumpToElement(leadershipSec);
      }
    } else if (hash.includes('chairman-message')) {
      const chairmanSec = document.getElementById('about-chairman-message') || document.getElementById('school-leadership-section');
      if (chairmanSec) {
        instantJumpToElement(chairmanSec);
        window.openSchoolLeaderModal?.('chairman');
      }
    } else if (hash.includes('secretary-message')) {
      const secretarySec = document.getElementById('about-secretary-message') || document.getElementById('school-leadership-section');
      if (secretarySec) {
        instantJumpToElement(secretarySec);
        window.openSchoolLeaderModal?.('secretary');
      }
    } else if (hash.includes('principals-message')) {
      const principalSec = document.getElementById('about-principals-message') || document.getElementById('school-leadership-section');
      if (principalSec) {
        instantJumpToElement(principalSec);
        window.openSchoolLeaderModal?.('principal');
      }
    } else if (hash.includes('gallery') || hash.includes('events')) {
      const gallerySec = document.getElementById('gallery') || document.getElementById('events');
      if (gallerySec) {
        instantJumpToElement(gallerySec);
      }
    } else if (hash.includes('co-scholastic')) {
      const coScholasticTab = document.getElementById('tab-btn-coscholastic');
      if (coScholasticTab) coScholasticTab.click();
    } else if (hash.includes('school-day-schedule')) {
      const scheduleSec = document.getElementById('schedule-section') || document.getElementById('programmes-schedule');
      if (scheduleSec) {
        scheduleSec.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        scheduleSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Intercept on-page instant clicks without scrolling
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const hash = href.slice(hashIndex);
    const isInstant = link.classList.contains('instant-nav-link') ||
                      hash === '#gallery' || hash === '#events' ||
                      hash === '#school-leadership-section' ||
                      hash === '#about-the-leadership';

    if (!isInstant) return;

    const currentPath = window.location.pathname.replace(/\/$/, '');
    const currentFile = currentPath.split('/').pop() || 'index.html';
    const targetFile = href.slice(0, hashIndex).split('/').pop();

    const isCurrentPage = !targetFile || targetFile === currentFile ||
                          ((currentFile === '' || currentFile === 'index.html') && targetFile === 'index.html') ||
                          (currentFile === 'about.html' && targetFile === 'about.html');

    if (isCurrentPage) {
      const targetId = hash.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        instantJumpToElement(targetEl);
        history.pushState(null, '', hash);
        const mobileDrawer = document.getElementById('mobile-nav-drawer');
        if (mobileDrawer && mobileDrawer.classList.contains('active')) {
          const mobileClose = document.getElementById('mobile-nav-close');
          mobileClose?.click();
        }
      }
    }
  });

  window.addEventListener('hashchange', handleHash);
  // Initial check on load
  if (window.location.hash) {
    setTimeout(handleHash, 60);
  }

  // Pre-reveal section whenever a user clicks any anchor link
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      const href = anchor.getAttribute('href');
      if (href && href.length > 1) {
        try {
          const target = document.querySelector(href);
          if (target) {
            target.classList.add('visible');
            target.querySelectorAll('.reveal').forEach(r => r.classList.add('visible'));
          }
        } catch (err) {}
      }
    });
  });
}

/* ==========================================================================
   ENQUIRY DRAWER & MODAL
   ========================================================================== */
const ENQUIRY_URL = 'https://npshopefarm.edchemy.com/enquiry.html';

function initEnquiryDrawer() {
  const openButtons = document.querySelectorAll('.open-enquiry-drawer');

  function openEnquiry(e) {
    if (e) e.preventDefault();
    window.open(ENQUIRY_URL, '_blank', 'noopener,noreferrer');
  }

  openButtons.forEach(btn => btn.addEventListener('click', openEnquiry));

  // Escape key — kept for safety in case drawer HTML still exists on page
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCareersModal();
    }
  });
}

/* ==========================================================================
   CAREERS MODAL & APPLICATION
   ========================================================================== */
function initCareersModal() {
  const modal = document.getElementById('careers-modal');
  const overlay = document.getElementById('careers-modal-overlay');
  const openBtns = document.querySelectorAll('.open-career-apply-btn');
  const closeBtn = document.getElementById('careers-modal-close');

  function openCareers(e) {
    if (e) e.preventDefault();
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  window.closeCareersModal = function() {
    if (modal && overlay) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openBtns.forEach(b => b.addEventListener('click', openCareers));
  if (closeBtn) closeBtn.addEventListener('click', window.closeCareersModal);
  if (overlay) overlay.addEventListener('click', window.closeCareersModal);
}

/* ==========================================================================
   FAQS ACCORDION & LIVE SEARCH FILTER
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search-input');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });

  // Real-time FAQ Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      let matchCount = 0;

      faqItems.forEach(item => {
        const qText = item.querySelector('.faq-question').textContent.toLowerCase();
        const aText = item.querySelector('.faq-answer').textContent.toLowerCase();

        if (qText.includes(term) || aText.includes(term)) {
          item.style.display = 'block';
          matchCount++;
          // Auto-expand if search query is active
          if (term.length > 2) {
            item.classList.add('active');
            const ans = item.querySelector('.faq-answer');
            ans.style.maxHeight = ans.scrollHeight + 30 + 'px';
          }
        } else {
          item.style.display = 'none';
        }
      });

      const noResultsMsg = document.getElementById('faq-no-results');
      if (noResultsMsg) {
        noResultsMsg.style.display = matchCount === 0 ? 'block' : 'none';
      }
    });
  }
}

/* ==========================================================================
   INFRASTRUCTURE FILTER TABS
   ========================================================================== */
function initInfrastructureFilters() {
  const filterBtns = document.querySelectorAll('.infra-filter-btn');
  const cards = document.querySelectorAll('.infra-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = (btn.getAttribute('data-filter') || '').toLowerCase();

      cards.forEach(card => {
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        if (filterValue === 'all' || category.includes(filterValue) || filterValue.includes(category)) {
          card.style.display = 'flex';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   SCHEDULE TIMETABLE SWITCHER
   ========================================================================== */
function initScheduleTabs() {
  const btns = document.querySelectorAll('.schedule-btn');
  const listPrimary = document.getElementById('schedule-list-primary');
  const listPrePrimary = document.getElementById('schedule-list-preprimary');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-schedule');
      if (target === 'preprimary') {
        if (listPrimary) listPrimary.style.display = 'none';
        if (listPrePrimary) {
          listPrePrimary.style.display = 'block';
          listPrePrimary.classList.add('fade-in');
        }
      } else {
        if (listPrePrimary) listPrePrimary.style.display = 'none';
        if (listPrimary) {
          listPrimary.style.display = 'block';
          listPrimary.classList.add('fade-in');
        }
      }
    });
  });
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER - FAST, ZERO WHITE-SPACE LAG)
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Immediately reveal anything currently visible or near the viewport on load
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  reveals.forEach(r => {
    const rect = r.getBoundingClientRect();
    if (rect.top <= windowHeight + 150) {
      r.classList.add('visible');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '180px 0px 100px 0px'
    });

    reveals.forEach(r => {
      if (!r.classList.contains('visible')) {
        observer.observe(r);
      }
    });
  } else {
    // Immediate fallback
    reveals.forEach(r => r.classList.add('visible'));
  }

  // Fail-safe safety timer: reveal all elements so no content can ever be stuck hidden
  setTimeout(() => {
    reveals.forEach(r => r.classList.add('visible'));
  }, 400);
}

/* ==========================================================================
   FORMS HANDLING & INSTANT FEEDBACK
   ========================================================================== */
function initForms() {
  // Enquiry Form in Drawer
  const enquiryForm = document.getElementById('drawer-enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentName = enquiryForm.querySelector('[name="studentname"]').value;
      const selectedGrade = enquiryForm.querySelector('[name="field_5b231c5"]').value;
      
      showToast(`Thank you! Enquiry for ${studentName} (${selectedGrade}) received. Admissions team will contact you shortly.`);
      enquiryForm.reset();
      setTimeout(() => {
        const overlay = document.getElementById('enquiry-drawer-overlay');
        const drawer = document.getElementById('enquiry-drawer');
        if (overlay && drawer) {
          drawer.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 1400);
    });
  }

  // Contact Page Form
  const contactForm = document.getElementById('contact-main-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Thank you! Your message has been sent to NPS Hopefarm administration.");
      contactForm.reset();
    });
  }

  // Careers Application Form
  const careerForm = document.getElementById('careers-application-form');
  if (careerForm) {
    careerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('career-name')?.value || '';
      const email = document.getElementById('career-email')?.value || '';
      const phone = document.getElementById('career-phone')?.value || '';
      const role = document.getElementById('career-role')?.value || '';
      const exp = document.getElementById('career-experience')?.value || '';

      const message = `Hello NPS Hopefarm,\nI would like to apply for the faculty position.\nHere are my details:\n• Name: ${name}\n• Position Applied For: ${role}\n• Mobile: ${phone}\n• Email: ${email}\n• Experience: ${exp}`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=919900031002&text=${encodeURIComponent(message)}`;

      showToast("Redirecting to WhatsApp with your application details...");
      careerForm.reset();

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        if (window.closeCareersModal) window.closeCareersModal();
      }, 600);
    });
  }
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg style="width:20px;height:20px;color:#dcb342;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* ==========================================================================
   CAMPUS LIFE: HAPPENINGS AUTO-SLIDING CAROUSEL
   ========================================================================== */
function initHappeningsSlider() {
  const viewport = document.getElementById('happenings-viewport');
  const track = document.getElementById('happenings-track');
  const prevBtn = document.getElementById('happenings-prev-btn');
  const nextBtn = document.getElementById('happenings-next-btn');
  const dotsContainer = document.getElementById('happenings-dots');
  const progressBar = document.getElementById('happenings-progress-bar');
  const statusPill = document.getElementById('happenings-status-pill');
  const statusText = document.getElementById('happenings-status-text');

  if (!viewport || !track) return;

  const originalSlides = Array.from(track.querySelectorAll('.happening-slide'));
  const totalSlides = originalSlides.length; // 4
  if (totalSlides === 0) return;

  // Clone slides for seamless infinite circular looping
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('is-clone');
    track.appendChild(clone);
  });

  const allSlides = Array.from(track.querySelectorAll('.happening-slide'));
  let currentIndex = 0;
  let isTransitioning = false;
  let autoPlayTimer = null;
  let progressInterval = null;
  const slideDuration = 3800; // 3.8s per slide
  let isPaused = false;

  // Build pagination dots (one per original slide)
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        if (isTransitioning) return;
        goToSlide(i);
        restartAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function getSlideStepWidth() {
    const slide = allSlides[0];
    if (!slide) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 28;
    return slide.getBoundingClientRect().width + gap;
  }

  function updateSlidePosition(animated = true) {
    const step = getSlideStepWidth();
    if (!animated) {
      track.classList.add('no-transition');
    } else {
      track.classList.remove('no-transition');
    }
    track.style.transform = `translateX(-${currentIndex * step}px)`;

    // Update pagination dots according to normalized index
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      const activeIdx = currentIndex % totalSlides;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlidePosition(true);
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateSlidePosition(true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    if (currentIndex <= 0) {
      // Seamlessly jump to cloned set position without transition, then slide back
      currentIndex = totalSlides;
      updateSlidePosition(false);
      track.offsetHeight; // force reflow
      currentIndex--;
      updateSlidePosition(true);
    } else {
      currentIndex--;
      updateSlidePosition(true);
    }
  }

  // Handle transition end for seamless circular wrap-around
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIndex >= totalSlides) {
      // Instantly reset to base index without visual jump
      currentIndex = currentIndex % totalSlides;
      updateSlidePosition(false);
    }
  });

  // Animated Progress Bar and Timer
  function resetProgressBar() {
    if (!progressBar) return;
    clearInterval(progressInterval);
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    
    if (isPaused) return;

    const startTime = Date.now();
    progressInterval = setInterval(() => {
      if (isPaused) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / slideDuration) * 100, 100);
      progressBar.style.width = `${pct}%`;
      if (elapsed >= slideDuration) {
        clearInterval(progressInterval);
      }
    }, 30);
  }

  function startAutoPlay() {
    stopAutoPlay();
    isPaused = false;
    if (statusPill) statusPill.classList.remove('is-paused');
    if (statusText) statusText.textContent = 'Auto-Playing';
    resetProgressBar();
    autoPlayTimer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
        resetProgressBar();
      }
    }, slideDuration);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    if (progressInterval) clearInterval(progressInterval);
    autoPlayTimer = null;
    progressInterval = null;
  }

  function pauseAutoPlay() {
    isPaused = true;
    if (statusPill) statusPill.classList.add('is-paused');
    if (statusText) statusText.textContent = 'Paused';
  }

  function resumeAutoPlay() {
    if (isPaused) {
      isPaused = false;
      if (statusPill) statusPill.classList.remove('is-paused');
      if (statusText) statusText.textContent = 'Auto-Playing';
      resetProgressBar();
    }
  }

  function restartAutoPlay() {
    startAutoPlay();
  }

  // Event Listeners: Navigation Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoPlay();
    });
  }

  // Hover pauses auto-play for comfortable reading
  viewport.addEventListener('mouseenter', pauseAutoPlay);
  viewport.addEventListener('mouseleave', resumeAutoPlay);

  // Status pill click toggles auto-play pause/resume
  if (statusPill) {
    statusPill.addEventListener('click', () => {
      if (isPaused) {
        resumeAutoPlay();
      } else {
        pauseAutoPlay();
      }
    });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    pauseAutoPlay();
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    resumeAutoPlay();
  }, { passive: true });

  // Handle Window Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlidePosition(false);
    }, 150);
  });

  // Photo Lightbox modal integration
  const lightbox = document.getElementById('photoLightbox');
  const lightboxOverlay = document.getElementById('photoLightboxOverlay');
  const lightboxClose = document.getElementById('photoLightboxClose');
  const lightboxImg = document.getElementById('photoLightboxImg');
  const lightboxTitle = document.getElementById('photoLightboxTitle');
  const lightboxDesc = document.getElementById('photoLightboxDesc');

  function openLightbox(photoSrc, title, desc) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = photoSrc;
    lightboxImg.alt = title || 'NPS Hopefarm Campus Life';
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    pauseAutoPlay();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resumeAutoPlay();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach click listener to all photo cards (including clones)
  track.querySelectorAll('.photo-scroll-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-photo');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      if (src) openLightbox(src, title, desc);
    });
  });

  // Initial setup
  updateSlidePosition(false);
  startAutoPlay();
}

/* ==========================================================================
   WHATSAPP DUAL-NUMBER HELPLINE SELECTOR
   ========================================================================== */
function initWhatsAppSelector() {
  const launcher = document.querySelector('.whatsapp-floating-launcher');
  if (!launcher) return;

  const toggleBtn = launcher.querySelector('.whatsapp-quick-btn');
  const popup = launcher.querySelector('.whatsapp-popup');
  const closeBtn = launcher.querySelector('.whatsapp-popup-close');

  if (!toggleBtn || !popup) return;

  function openPopup() {
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closePopup() {
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (popup.classList.contains('active')) {
      closePopup();
    } else {
      openPopup();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closePopup();
    });
  }

  // Close when clicking outside launcher
  document.addEventListener('click', (e) => {
    if (!launcher.contains(e.target)) {
      closePopup();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closePopup();
    }
  });
}

/* ==========================================================================
   SCHOOL LEADERSHIP EXECUTIVE MODAL
   ========================================================================== */
function initLeadershipModal() {
  const modalBackdrop = document.getElementById('leadership-modal-backdrop');
  if (!modalBackdrop) return;

  const closeBtn = document.getElementById('leadership-modal-close');
  const tabButtons = modalBackdrop.querySelectorAll('.leadership-modal-tab-btn');
  const panes = modalBackdrop.querySelectorAll('.leader-pane');
  const openButtons = document.querySelectorAll('.open-leader-modal-btn');

  function openLeader(leaderKey) {
    const validKey = ['chairman', 'secretary', 'principal'].includes(leaderKey) ? leaderKey : 'chairman';

    tabButtons.forEach(btn => {
      const match = btn.dataset.leaderTab === validKey;
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    panes.forEach(pane => {
      const match = pane.dataset.leaderPane === validKey;
      pane.classList.toggle('is-active', match);
    });

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const activeBtn = modalBackdrop.querySelector(`.leadership-modal-tab-btn[data-leader-tab="${validKey}"]`);
    activeBtn?.focus();
  }

  function closeModal() {
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.openSchoolLeaderModal = openLeader;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const leader = btn.dataset.leader || 'chairman';
      openLeader(leader);
    });
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const leader = btn.dataset.leaderTab;
      openLeader(leader);
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
}
