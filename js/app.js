/**
 * NPS HOPEFARM - MAIN APPLICATION CONTROLLER
 * Handles Router, Navigation, Enquiry Drawer, Careers Modal, FAQ Search, Tabs & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRouter();
  initEnquiryDrawer();
  initCareersModal();
  initFaqAccordion();
  initInfrastructureFilters();
  initScheduleTabs();
  initScrollReveals();
  initForms();
});

/* ==========================================================================
   NAVIGATION & HEADER
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileCloseBtn = document.getElementById('mobile-nav-close');

  // Sticky header scroll elevation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileCloseBtn && mobileDrawer) {
    mobileCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile drawer when clicking any nav link
  document.querySelectorAll('#mobile-nav-drawer a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ==========================================================================
   ROUTER & DEEP LINKING
   ========================================================================== */
function initRouter() {
  function handleHash() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return;

    // Direct section scroll
    const targetEl = document.querySelector(hash.replace('/', '-').replace('/', '-'));
    if (targetEl) {
      const headerOffset = 100;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Specific sub-tab activation
    if (hash.includes('vision-and-mission')) {
      const tab = document.getElementById('about-vm-anchor');
      if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (hash.includes('the-leadership')) {
      const leadershipSec = document.getElementById('leadership-section');
      if (leadershipSec) leadershipSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (hash.includes('principals-message')) {
      const principalSec = document.getElementById('principal-message-section');
      if (principalSec) principalSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (hash.includes('co-scholastic')) {
      const coScholasticTab = document.getElementById('tab-btn-coscholastic');
      if (coScholasticTab) coScholasticTab.click();
    } else if (hash.includes('school-day-schedule')) {
      const scheduleSec = document.getElementById('schedule-section');
      if (scheduleSec) scheduleSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.addEventListener('hashchange', handleHash);
  // Initial check on load
  if (window.location.hash) {
    setTimeout(handleHash, 300);
  }
}

/* ==========================================================================
   ENQUIRY DRAWER & MODAL
   ========================================================================== */
function initEnquiryDrawer() {
  const openButtons = document.querySelectorAll('.open-enquiry-drawer');
  const drawer = document.getElementById('enquiry-drawer');
  const overlay = document.getElementById('enquiry-drawer-overlay');
  const closeBtn = document.getElementById('enquiry-drawer-close');

  function openDrawer(e) {
    if (e) e.preventDefault();
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openButtons.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
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

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
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
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(r => observer.observe(r));
  } else {
    // Fallback
    reveals.forEach(r => r.classList.add('visible'));
  }
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
      showToast("Application submitted successfully. HR will review your profile.");
      careerForm.reset();
      setTimeout(() => {
        if (window.closeCareersModal) window.closeCareersModal();
      }, 1400);
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
