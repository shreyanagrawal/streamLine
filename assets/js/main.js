document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');

    const toTop = document.querySelector('.to-top');
    if (toTop) {
      if (window.scrollY > 600) toTop.classList.add('is-visible');
      else toTop.classList.remove('is-visible');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.nav-overlay');
  if (navToggle && mainNav) {
    const closeNav = () => {
      navToggle.classList.remove('is-open');
      mainNav.classList.remove('is-open');
      overlay && overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      overlay && overlay.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay && overlay.addEventListener('click', closeNav);
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(el => cio.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Testimonial carousel ---------- */
  const testiSlides = document.querySelectorAll('.testi-slide');
  const testiDotsWrap = document.querySelector('.testi-dots');
  if (testiSlides.length && testiDotsWrap) {
    let current = 0;
    testiSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('is-active');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      testiDotsWrap.appendChild(dot);
    });
    const dots = testiDotsWrap.querySelectorAll('button');
    function goTo(i) {
      testiSlides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = i;
      testiSlides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }
    setInterval(() => goTo((current + 1) % testiSlides.length), 5500);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) {
    firstFaq.classList.add('is-open');
    firstFaq.querySelector('.faq-a').style.maxHeight = firstFaq.querySelector('.faq-a').scrollHeight + 'px';
  }

  /* ---------- Plan tabs filter ---------- */
  const planTabs = document.querySelectorAll('.plan-tab');
  const planCards = document.querySelectorAll('[data-plan-group]');
  if (planTabs.length && planCards.length) {
    planTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        planTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const group = tab.getAttribute('data-tab');
        planCards.forEach(card => {
          const match = group === 'all' || card.getAttribute('data-plan-group') === group;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Contact form (demo submit) ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message sent ✓';
        form.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2600);
      }, 900);
    });
  }

  /* ---------- Active nav link ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === path) link.classList.add('active');
  });

  /* ---------- Testimonial Slider ---------- */
  const track = document.querySelector(".testimonials-track");
  const slides = document.querySelectorAll(".testi-slide");
  const prevBtn = document.querySelector(".testi-prev");
  const nextBtn = document.querySelector(".testi-next");
  const dotsContainer = document.querySelector(".testi-dots");

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();
  let totalPages = Math.ceil(slides.length / slidesPerView);

  function getSlidesPerView() {
    if (window.innerWidth <= 640) {
      return 1;
    }

    if (window.innerWidth <= 992) {
      return 2;
    }

    return 3;
  }

  function createDots() {

    dotsContainer.innerHTML = "";

    slidesPerView = getSlidesPerView();
    totalPages = Math.ceil(slides.length / slidesPerView);

    for (let i = 0; i < totalPages; i++) {

      const dot = document.createElement("button");

      dot.className = "testi-dot";
      dot.setAttribute("aria-label", `Show testimonial group ${i + 1}`);

      dot.addEventListener("click", function () {
        currentIndex = i;
        updateSlider();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {

    const slideWidth = 100 / slidesPerView;

    track.style.transform =
      `translateX(-${currentIndex * 100}%)`;

    const dots = document.querySelectorAll(".testi-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === currentIndex
      );
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalPages - 1;
  }

  nextBtn.addEventListener("click", function () {

    if (currentIndex < totalPages - 1) {
      currentIndex++;
      updateSlider();
    }

  });

  prevBtn.addEventListener("click", function () {

    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }

  });

  window.addEventListener("resize", function () {

    const newSlidesPerView = getSlidesPerView();

    if (newSlidesPerView !== slidesPerView) {
      slidesPerView = newSlidesPerView;
      currentIndex = 0;
      createDots();
      updateSlider();
    }

  });

  createDots();
  updateSlider();

});
