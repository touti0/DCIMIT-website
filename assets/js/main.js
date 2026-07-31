/*
Updated: Jul 07 2026
Author: 
License: 
*/

(function() {
  "use strict";

  /*Apply .scrolled class to the body as the page is scrolled down*/

  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /*Mobile nav toggle*/

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /*Hide mobile nav on same-page/hash links*/

  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /*Toggle mobile nav dropdowns*/

  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /*Preloader*/

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /*Scroll top button*/

  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /*Activate Language Button*/

  document.querySelectorAll(".language button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const it = btn.dataset.lang === "it";
      document.documentElement.lang = it ? "it" : "en";
      document
        .querySelectorAll(".language button")
        .forEach((b) => b.classList.toggle("active", b === btn));
      document.querySelectorAll("[data-it]").forEach((el) => {
        if (!el.dataset.en) el.dataset.en = el.innerHTML;
        el.innerHTML = it ? el.dataset.it : el.dataset.en;
      });
    }),
  );


  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /*Animation on scroll function and init*/

  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /*Initiate glightbox*/

  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /*Initiate Pure Counter*/

  new PureCounter();

  /*Initiate swiper sliders*/

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /*Frequently Asked Questions Toggle*/

  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  $('#modal-btn').on('click', function () {
    $('#modal-frame').attr('src', 'cervical-cancer-explainer.html');
  });
  
  $('#modal-btn-1').on('click', function () {
    $('#modal-frame').attr('src', 'cervical-cancer-chapter-01-understanding-hpv.html');
  });

  $('#modal-btn-2').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-02-the-hpv-vaccine.html');
  });

  $('#modal-btn-3').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-03-why-screening-matters.html');
  });

  $('#modal-btn-4').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-04-pap-test-vs-hpv-test.html');
  });

  $('#modal-btn-5').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-05-what-happens-during-the-exam.html');
  });

  $('#modal-btn-6').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-06-hpv-positive-what-now.html');
  });

  $('#modal-btn-7').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-07-colposcopy-explained.html');
  });

  $('#modal-btn-8').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-08-common-myths.html');
  });

  $('#modal-btn-9').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-09-cervical-cancer-symptoms.html');
  });

  $('#modal-btn-10').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-10-overcoming-fear.html');
  });

  $('#modal-btn-11').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-11-pregnancy-and-screening.html');
  });

  $('#modal-btn-12').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-12-menopause-and-screening.html');
  });

  $('#modal-btn-13').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-13-lifestyle-and-prevention.html');
  });

  $('#modal-btn-14').on('click', function () {
  $('#modal-frame').attr('src', 'cervical-cancer-chapter-14-the-screening-journey.html');
  });

})();