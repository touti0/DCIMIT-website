/*
Updated: Jul 07 2026
Author: 
License: 
*/

(function() {
  "use strict";

  /*Lesson video modal (Women's Health thematic lesson accordion)
    Registered first so it still works even if a vendor library
    further down (GLightbox, PureCounter, Swiper...) throws and
    halts the rest of this script. */

  document.querySelectorAll('.lesson-watch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalEl = document.getElementById('exampleModal');
      const frame = document.getElementById('modal-frame');
      const label = document.getElementById('exampleModalLabel');
      if (frame) frame.setAttribute('src', btn.dataset.video);
      if (label) label.textContent = btn.dataset.title || 'Lesson';
      if (modalEl && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
    });
  });

  /* Blur focus before Bootstrap marks the modal aria-hidden on close,
     otherwise the browser warns about hiding a focused element. */
  const lessonModalEl = document.getElementById('exampleModal');
  if (lessonModalEl) {
    lessonModalEl.addEventListener('hide.bs.modal', () => {
      if (lessonModalEl.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });
  }

  /*Cookie policy popup (opened from the "Cookie Policy" link in the footer)
    Registered early so it keeps working if a vendor library further down throws. */

  const COOKIE_POLICY_URL = 'https://www.unibo.it/it/ateneo/privacy-e-note-legali/privacy/cookie-e-altri-strumenti-di-tracciamento-dei-dati-personali-nei-siti-del-sistema-portale-di-ateneo';
  const COOKIE_TEXTS = {
    it: {
      title: 'Questo sito web utilizza i cookie',
      text: 'Nel nostro sito utilizziamo cookie tecnici necessari per il suo funzionamento.',
      more: 'Se chiudi questo banner continuerai la navigazione solo con i cookie necessari.',
      info: 'Per maggiori informazioni consulta la nostra ',
      link: 'Cookie policy',
      close: 'Chiudi'
    },
    en: {
      title: 'This website uses cookies',
      text: 'We use technical cookies on our site that are necessary for it to work.',
      more: 'If you close this banner you will continue browsing with necessary cookies only.',
      info: 'For more information please see our ',
      link: 'Cookie policy',
      close: 'Close'
    },
    fr: {
      title: 'Ce site web utilise des cookies',
      text: 'Nous utilisons sur notre site des cookies techniques nécessaires à son fonctionnement.',
      more: 'Si vous fermez cette bannière, vous continuerez la navigation avec les seuls cookies nécessaires.',
      info: 'Pour plus d\'informations, consultez notre ',
      link: 'Politique relative aux cookies',
      close: 'Fermer'
    },
    ro: {
      title: 'Acest site web folosește cookie-uri',
      text: 'Pe site-ul nostru folosim cookie-uri tehnice, necesare funcționării acestuia.',
      more: 'Dacă închizi acest banner, vei continua navigarea doar cu cookie-urile necesare.',
      info: 'Pentru mai multe informații consultă ',
      link: 'Politica privind cookie-urile',
      close: 'Închide'
    },
    ar: {
      title: 'يستخدم هذا الموقع ملفات تعريف الارتباط',
      text: 'نستخدم في موقعنا ملفات تعريف ارتباط تقنية ضرورية لعمله.',
      more: 'إذا أغلقت هذا الشريط، فستواصل التصفح باستخدام ملفات تعريف الارتباط الضرورية فقط.',
      info: 'لمزيد من المعلومات، اطّلع على ',
      link: 'سياسة ملفات تعريف الارتباط',
      close: 'إغلاق'
    }
  };

  let cookiePopup = null;
  let cookieOpener = null;

  function buildCookiePopup() {
    const t = COOKIE_TEXTS[(document.documentElement.lang || 'en').slice(0, 2)] || COOKIE_TEXTS.en;
    const overlay = document.createElement('div');
    overlay.className = 'cookie-popup';
    overlay.hidden = true;

    const dialog = document.createElement('div');
    dialog.className = 'cookie-popup-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'cookie-popup-title');

    const closeX = document.createElement('button');
    closeX.type = 'button';
    closeX.className = 'cookie-popup-x';
    closeX.setAttribute('aria-label', t.close);
    closeX.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';

    const title = document.createElement('h2');
    title.id = 'cookie-popup-title';
    title.textContent = t.title;

    const text = document.createElement('p');
    text.textContent = t.text;

    const more = document.createElement('p');
    more.appendChild(document.createTextNode(t.more));
    more.appendChild(document.createElement('br'));
    more.appendChild(document.createTextNode(t.info));
    const link = document.createElement('a');
    link.href = COOKIE_POLICY_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t.link;
    more.appendChild(link);
    more.appendChild(document.createTextNode('.'));

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'cookie-popup-close';
    closeBtn.textContent = t.close;

    dialog.append(closeX, title, text, more, closeBtn);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    [closeX, closeBtn].forEach((b) => b.addEventListener('click', closeCookiePopup));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCookiePopup();
    });
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCookiePopup();
      } else if (e.key === 'Tab') {
        // keep keyboard focus inside the dialog
        const items = [closeX, link, closeBtn];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    return overlay;
  }

  function openCookiePopup(opener) {
    if (!cookiePopup) cookiePopup = buildCookiePopup();
    cookieOpener = opener;
    cookiePopup.hidden = false;
    document.body.classList.add('cookie-popup-open');
    cookiePopup.querySelector('.cookie-popup-close').focus();
  }

  function closeCookiePopup() {
    if (!cookiePopup) return;
    cookiePopup.hidden = true;
    document.body.classList.remove('cookie-popup-open');
    if (cookieOpener) cookieOpener.focus();
  }

  document.querySelectorAll('.legal-links a[href*="cookie-e-altri-strumenti"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCookiePopup(link);
    });
  });

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

  // The current language button opens/closes the list (needed on touch screens, hover handles desktop)
  document.querySelectorAll(".language .lang-current").forEach((current) =>
    current.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = current.parentElement.classList.toggle("open");
      current.setAttribute("aria-expanded", open);
    }),
  );

  document.addEventListener("click", () =>
    document.querySelectorAll(".language.open").forEach((l) => {
      l.classList.remove("open");
      l.querySelector(".lang-current").setAttribute("aria-expanded", "false");
    }),
  );

  document.querySelectorAll(".language .lang-menu button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      const it = lang === "it";
      document.documentElement.lang = lang;
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

  /*Initiate glightbox (only if the vendor library is actually loaded)*/

  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }

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

  // Team carousel
  $(".team-carousel, .related-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      margin: 45,
      dots: false,
      loop: true,
      nav : true,
      navText : [
          '<i class="bi bi-arrow-left"></i>',
          '<i class="bi bi-arrow-right"></i>'
      ],
      responsive: {
          0:{
              items:1
          },
          992:{
              items:2
          }
      }
  });
  

})();