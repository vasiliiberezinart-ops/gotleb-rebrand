/* GOTLEB — minimal vanilla JS */

(function () {
  'use strict';

  const burger = document.querySelector('.header__burger');
  const header = document.querySelector('.header');
  if (burger && header) {
    burger.addEventListener('click', () => {
      header.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', header.classList.contains('is-open'));
    });
  }

  const gallery = document.querySelector('.pdp__gallery-main');
  const thumbs = document.querySelectorAll('.pdp__thumb');
  if (gallery && thumbs.length) {
    const mainImg = gallery.querySelector('img');
    thumbs.forEach((t) => {
      t.addEventListener('click', () => {
        const src = t.querySelector('img').src;
        mainImg.src = src;
        thumbs.forEach((x) => x.classList.remove('is-active'));
        t.classList.add('is-active');
      });
    });
  }

  const pills = document.querySelectorAll('.size-pill');
  pills.forEach((p) => {
    p.addEventListener('click', () => {
      pills.forEach((x) => x.classList.remove('is-active'));
      p.classList.add('is-active');
    });
  });

  const filterLinks = document.querySelectorAll('.catalog-filters__group a');
  filterLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const group = link.closest('.catalog-filters__group');
      if (group) {
        group.querySelectorAll('a').forEach((x) => x.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  });

  const newsForm = document.querySelector('.newsletter__form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lead = newsForm.parentElement.querySelector('.newsletter__lead');
      if (lead) lead.textContent = 'Спасибо. Письмо придёт в начале сезона.';
      newsForm.style.opacity = '0.4';
      newsForm.style.pointerEvents = 'none';
    });
  }
})();
