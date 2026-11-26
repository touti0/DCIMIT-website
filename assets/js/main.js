/*
Updated: Jul 07 2026
Author: 
License: 
*/

(function() {
  "use strict";

  /*Cookie created on the first visit (technical cookie, no personal data)*/

  const isFirstVisit = !document.cookie.includes("site_visited=");

  function createVisitCookie() {
    if (isFirstVisit) {
      document.cookie = "site_visited=yes; max-age=31536000; path=/";
    }
  }

  createVisitCookie();

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

  /*Cookie banner: shown at the bottom of the screen on the first visit, then only
    when the "Cookie Settings" link in the footer is clicked.
    Registered early so it keeps working if a vendor library further down throws. */

  // Unibo publishes this page only in Italian and English
  const COOKIE_POLICY_URL = (document.documentElement.lang || 'en').slice(0, 2) === 'it'
    ? 'https://www.unibo.it/it/ateneo/privacy-e-note-legali/privacy/cookie-e-altri-strumenti-di-tracciamento-dei-dati-personali-nei-siti-del-sistema-portale-di-ateneo'
    : 'https://www.unibo.it/en/university/privacy-policy-and-legal-notes/privacy-policy/cookies-and-other-personal-data-tracking-tools-on-the-university-portal-system-websites';
  const COOKIE_TEXTS = {
    it: {
      title: 'Questo sito web utilizza i cookie',
      text: 'Vengono installati solo cookie tecnici e anonimi per garantire il corretto funzionamento e il miglioramento del sito web.',
      more: 'Se chiudi questo banner continuerai la navigazione solo con i cookie necessari.',
      info: 'Per maggiori informazioni sui cookie tecnici consulta la nostra ',
      link: 'Cookie policy',
      close: 'Chiudi',
      accept: 'Accetta i cookie necessari'
    },
    en: {
      title: 'This website uses cookies',
      text: 'Only technical and anonymous cookies are installed to ensure the correct functioning and enhancement of the website.',
      more: 'If you close this banner you will continue browsing with necessary cookies only.',
      info: 'For more information about technical cookies please see our ',
      link: 'Cookie policy',
      close: 'Close',
      accept: 'Accept necessary cookies'
    },
    fr: {
      title: 'Ce site web utilise des cookies',
      text: 'Seuls des cookies techniques et anonymes sont installés afin de garantir le bon fonctionnement et l\'amélioration du site web.',
      more: 'Si vous fermez cette bannière, vous continuerez la navigation avec les seuls cookies nécessaires.',
      info: 'Pour plus d\'informations sur les cookies techniques, consultez notre ',
      link: 'Politique relative aux cookies',
      close: 'Fermer',
      accept: 'Accepter les cookies nécessaires'
    },
    ro: {
      title: 'Acest site web folosește cookie-uri',
      text: 'Sunt instalate doar cookie-uri tehnice și anonime pentru a asigura buna funcționare și îmbunătățirea site-ului web.',
      more: 'Dacă închizi acest banner, vei continua navigarea doar cu cookie-urile necesare.',
      info: 'Pentru mai multe informații despre cookie-urile tehnice, consultă ',
      link: 'Politica privind cookie-urile',
      close: 'Închide',
      accept: 'Acceptă cookie-urile necesare'
    },
    ar: {
      title: 'يستخدم هذا الموقع ملفات تعريف الارتباط',
      text: 'يتم تثبيت ملفات تعريف ارتباط تقنية ومجهولة الهوية فقط لضمان حسن عمل الموقع وتحسينه.',
      more: 'إذا أغلقت هذا الشريط، فستواصل التصفح باستخدام ملفات تعريف الارتباط الضرورية فقط.',
      info: 'لمزيد من المعلومات حول ملفات تعريف الارتباط التقنية، اطّلع على ',
      link: 'سياسة ملفات تعريف الارتباط',
      close: 'إغلاق',
      accept: 'قبول ملفات تعريف الارتباط الضرورية'
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
    dialog.setAttribute('aria-labelledby', 'cookie-popup-title');

    const closeX = document.createElement('button');
    closeX.type = 'button';
    closeX.className = 'cookie-popup-x';
    closeX.setAttribute('aria-label', t.close);
    closeX.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';

    const body = document.createElement('div');
    body.className = 'cookie-popup-body';

    const title = document.createElement('h2');
    title.id = 'cookie-popup-title';
    title.textContent = t.title;

    const text = document.createElement('p');
    text.textContent = t.text;

    const more = document.createElement('p');
    more.textContent = t.more;

    const info = document.createElement('p');
    info.appendChild(document.createTextNode(t.info));
    const link = document.createElement('a');
    link.href = COOKIE_POLICY_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t.link;
    info.appendChild(link);
    info.appendChild(document.createTextNode('.'));

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'cookie-popup-close';
    closeBtn.textContent = t.accept;

    body.append(title, text, more, info);
    dialog.append(closeX, body, closeBtn);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    [closeX, closeBtn].forEach((b) => b.addEventListener('click', closeCookiePopup));
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCookiePopup();
    });
    return overlay;
  }

  function openCookiePopup(opener) {
    if (!cookiePopup) cookiePopup = buildCookiePopup();
    cookieOpener = opener || null;
    cookiePopup.hidden = false;
    // on the automatic first-visit display focus is not moved away from the page
    if (opener) cookiePopup.querySelector('.cookie-popup-close').focus();
  }

  function closeCookiePopup() {
    if (!cookiePopup) return;
    cookiePopup.hidden = true;
    if (cookieOpener) cookieOpener.focus();
    cookieOpener = null;
  }

  document.querySelectorAll('.legal-links a[href*="cookie"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCookiePopup(link);
    });
  });

  if (isFirstVisit) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => openCookiePopup());
    } else {
      openCookiePopup();
    }
  }

  /*Keyboard access to the main menu.
    Also registered early, independent of the code below.
    - skip link to the main content
    - hamburger button and submenu arrows reachable with Tab, Enter/Space to activate
    - desktop dropdowns and language list open on focus; arrows move inside them, Esc closes them */

  const NAV_TEXTS = {
    en: { toggle: 'Toggle navigation menu', sub: 'Show or hide submenu', skip: 'Skip to main content' },
    it: { toggle: 'Apri o chiudi il menu di navigazione', sub: 'Mostra o nascondi il sottomenu', skip: 'Vai al contenuto principale' },
    fr: { toggle: 'Afficher ou masquer le menu de navigation', sub: 'Afficher ou masquer le sous-menu', skip: 'Aller au contenu principal' },
    ro: { toggle: 'Deschide sau închide meniul de navigare', sub: 'Arată sau ascunde submeniul', skip: 'Salt la conținutul principal' },
    ar: { toggle: 'فتح أو إغلاق قائمة التنقل', sub: 'إظهار أو إخفاء القائمة الفرعية', skip: 'تخطَّ إلى المحتوى الرئيسي' }
  };

  (function setupKeyboardMenu() {
    const t = NAV_TEXTS[(document.documentElement.lang || 'en').slice(0, 2)] || NAV_TEXTS.en;
    const body = document.body;
    const nav = document.getElementById('navmenu');

    // The skip link goes to #service-details-2 on the pages that have it, otherwise to <main>
    const main = document.querySelector('main');
    const skipTarget = document.getElementById('service-details-2') || main;
    if (skipTarget) {
      if (!skipTarget.id) skipTarget.id = 'main-content';
      skipTarget.setAttribute('tabindex', '-1');
      const skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#' + skipTarget.id;
      skip.textContent = t.skip;
      body.insertBefore(skip, body.firstChild);
    }
    if (!nav) return;

    const mobileOpen = () => body.classList.contains('mobile-nav-active');
    const burger = nav.querySelector('.mobile-nav-toggle');
    const chevrons = nav.querySelectorAll('.toggle-dropdown');

    if (burger) {
      burger.setAttribute('role', 'button');
      burger.setAttribute('tabindex', '0');
      burger.setAttribute('aria-label', t.toggle);
      burger.setAttribute('aria-controls', 'navmenu');
      const syncBurger = () => burger.setAttribute('aria-expanded', mobileOpen() ? 'true' : 'false');
      syncBurger();
      new MutationObserver(syncBurger).observe(body, { attributes: true, attributeFilter: ['class'] });
    }

    // Submenu arrows are only separate controls in the mobile menu (on desktop the submenu opens on focus)
    chevrons.forEach((icon) => {
      const link = icon.parentNode;
      const sync = () => icon.setAttribute('aria-expanded', link.classList.contains('active') ? 'true' : 'false');
      new MutationObserver(sync).observe(link, { attributes: true, attributeFilter: ['class'] });
      sync();
    });
    nav.querySelectorAll('.dropdown > a').forEach((a) => a.setAttribute('aria-haspopup', 'true'));

    const mq = window.matchMedia('(max-width: 1199px)');
    function applyChevrons() {
      chevrons.forEach((icon) => {
        if (mq.matches) {
          icon.setAttribute('role', 'button');
          icon.setAttribute('tabindex', '0');
          icon.setAttribute('aria-label', t.sub);
        } else {
          icon.removeAttribute('role');
          icon.removeAttribute('tabindex');
          icon.removeAttribute('aria-label');
        }
      });
    }
    applyChevrons();
    mq.addEventListener('change', applyChevrons);

    const dismissibles = nav.querySelectorAll('.dropdown, .language');
    const reopen = (holder) => holder && holder.classList.remove('nav-dismissed');

    document.addEventListener('keydown', (e) => {
      const el = e.target;
      if (!(el instanceof Element) || !nav.contains(el)) return;

      // Enter / Space on the custom buttons
      if ((e.key === 'Enter' || e.key === ' ') && (el === burger || el.matches('.toggle-dropdown'))) {
        e.preventDefault();
        el.click();
        if (el === burger && mobileOpen()) {
          const first = nav.querySelector('ul a');
          if (first) first.focus();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (mobileOpen()) {
          e.preventDefault();
          burger.click();
          burger.focus();
          return;
        }
        const holder = el.closest('.dropdown, .language');
        if (holder) {
          e.preventDefault();
          holder.classList.add('nav-dismissed');
          const trigger = holder.matches('.language') ? holder.querySelector('.lang-current') : holder.querySelector(':scope > a');
          if (holder.matches('.language')) {
            holder.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          }
          trigger.focus();
        }
        return;
      }

      // Tab stays inside the open mobile menu
      if (e.key === 'Tab' && mobileOpen()) {
        const items = [...nav.querySelectorAll('a[href], button, [tabindex="0"]')]
          .filter((x) => x === burger || x.offsetParent !== null);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && el === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && el === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      // Arrow keys inside a submenu / the language list
      const list = el.closest('.dropdown > ul, .lang-menu');
      if (list && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        const items = [...list.querySelectorAll(list.matches('.lang-menu') ? ':scope > button' : ':scope > li > a')];
        const i = items.indexOf(el);
        if (i < 0) return;
        let next = i;
        if (e.key === 'ArrowDown') next = (i + 1) % items.length;
        else if (e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length;
        else if (e.key === 'Home') next = 0;
        else next = items.length - 1;
        e.preventDefault();
        items[next].focus();
        return;
      }

      // ArrowDown on a menu trigger opens it and moves into it
      if (e.key === 'ArrowDown') {
        if (el.matches('.dropdown > a')) {
          const li = el.parentNode;
          const ul = li.querySelector(':scope > ul');
          reopen(li);
          if (mq.matches && !ul.classList.contains('dropdown-active')) el.querySelector('.toggle-dropdown').click();
          const first = ul.querySelector('a');
          if (first) {
            e.preventDefault();
            first.focus();
          }
        } else if (el.matches('.lang-current')) {
          reopen(el.parentNode);
          const first = el.parentNode.querySelector('.lang-menu button');
          if (first) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    dismissibles.forEach((h) => h.addEventListener('mouseleave', () => reopen(h)));
    nav.addEventListener('focusout', (e) => {
      const h = e.target.closest('.dropdown, .language');
      if (h && !h.contains(e.relatedTarget)) {
        reopen(h);
        const cur = h.querySelector('.lang-current');
        if (cur && !h.classList.contains('open')) cur.setAttribute('aria-expanded', 'false');
      }
    });
    nav.addEventListener('focusin', (e) => {
      const h = e.target.closest('.language');
      if (h && !h.classList.contains('nav-dismissed')) h.querySelector('.lang-current').setAttribute('aria-expanded', 'true');
    });
  })();

  /*Links that open in a new tab: add rel="noopener" and say so, with an icon for sighted
    users and a hidden text for screen readers. Also covers links created later by scripts. */

  const NEW_TAB_TEXTS = {
    en: 'opens in a new tab',
    it: 'si apre in una nuova scheda',
    fr: 's\'ouvre dans un nouvel onglet',
    ro: 'se deschide într-o filă nouă',
    ar: 'يفتح في علامة تبويب جديدة'
  };

  function markNewTabLinks(root) {
    const label = NEW_TAB_TEXTS[(document.documentElement.lang || 'en').slice(0, 2)] || NEW_TAB_TEXTS.en;
    const links = [...root.querySelectorAll('a[target="_blank"]')];
    if (root.matches && root.matches('a[target="_blank"]')) links.push(root);

    links.forEach((link) => {
      if (link.dataset.newTab) return;
      link.dataset.newTab = 'true';
      link.relList.add('noopener');

      // an existing arrow icon becomes the "new tab" icon, otherwise one is added
      // (links with data-no-new-tab-icon only get the hidden text)
      if (!link.hasAttribute('data-no-new-tab-icon')) {
        let icon = link.querySelector('i[class*="arrow"]');
        if (!icon) {
          icon = document.createElement('i');
          link.appendChild(icon);
        }
        icon.className = 'bi bi-box-arrow-up-right new-tab-icon';
        icon.setAttribute('aria-hidden', 'true');
      }

      if (link.hasAttribute('aria-label')) {
        link.setAttribute('aria-label', link.getAttribute('aria-label') + ' (' + label + ')');
      } else {
        const hidden = document.createElement('span');
        hidden.className = 'visually-hidden';
        hidden.textContent = ' (' + label + ')';
        link.appendChild(hidden);
      }
    });
  }

  markNewTabLinks(document.body);
  new MutationObserver((mutations) => {
    mutations.forEach((m) => m.addedNodes.forEach((node) => {
      if (node.nodeType === 1) markNewTabLinks(node);
    }));
  }).observe(document.body, { childList: true, subtree: true });

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

  // Team carousel (needs jQuery and Owl Carousel, which only some pages load)
  if (window.jQuery && jQuery.fn.owlCarousel) jQuery(".team-carousel, .related-carousel").owlCarousel({
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