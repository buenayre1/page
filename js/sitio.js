/* ═══════════════════════════════════════════════════════════
   Buen Ayre Tours · sitio

   WhatsApp de Débora: +54 9 11 2260-9166
   (en formato wa.me va sin +, sin espacios y sin guiones)

   El formulario no manda mail: arma un mensaje con los datos cargados
   y abre WhatsApp con todo escrito, listo para que el viajero lo envíe.
   ═══════════════════════════════════════════════════════════ */

var WHATSAPP = '5491122609166';

(function () {
  'use strict';

  var html = document.documentElement;

  /* ── idioma ─────────────────────────────────────────────── */
  var META = {
    en: {
      title: 'Buen Ayre Tours · Private tours in Buenos Aires',
      desc: 'Private, personalized tours in Buenos Aires with Débora, a licensed local guide. City tour, Jewish heritage, Tigre Delta, estancia day, walking tour and a home cooking class.'
    },
    es: {
      title: 'Buen Ayre Tours · Tours privados en Buenos Aires',
      desc: 'Tours privados y personalizados en Buenos Aires con Débora, guía de turismo matriculada. City tour, judaico, Tigre, día de campo, recorrido a pie y clase de cocina.'
    }
  };

  function setLang(lang) {
    if (lang !== 'es') lang = 'en';
    html.setAttribute('lang', lang);
    document.title = META[lang].title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', META[lang].desc);

    var botones = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < botones.length; i++) {
      botones[i].setAttribute('aria-pressed', botones[i].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    }
    try { localStorage.setItem('buenayre-lang', lang); } catch (e) {}
  }

  var guardado = null;
  try { guardado = localStorage.getItem('buenayre-lang'); } catch (e) {}
  if (!guardado) {
    guardado = (navigator.language || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }
  setLang(guardado);

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-set-lang]');
    if (b) setLang(b.getAttribute('data-set-lang'));
  });

  /* ── enlaces de WhatsApp ────────────────────────────────── */
  function waLink(msg) {
    return 'https://wa.me/' + WHATSAPP + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }
  var enlacesWa = document.querySelectorAll('[data-wa]');
  for (var j = 0; j < enlacesWa.length; j++) {
    var a = enlacesWa[j];
    a.setAttribute('href', waLink(a.getAttribute('data-wa-msg') || ''));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  }

  /* ── menú móvil ─────────────────────────────────────────── */
  var hamb = document.getElementById('hamb');
  var menu = document.getElementById('menu');
  if (hamb && menu) {
    hamb.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      hamb.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) {
        menu.classList.remove('abierto');
        hamb.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── barra: sombra al bajar + link activo ───────────────── */
  var barra = document.getElementById('barra');
  var links = document.querySelectorAll('.menu a[href^="#"]');
  var secciones = [];
  for (var k = 0; k < links.length; k++) {
    var s = document.querySelector(links[k].getAttribute('href'));
    if (s) secciones.push({ link: links[k], sec: s });
  }

  var pendiente = false;
  function alScroll() {
    if (barra) barra.classList.toggle('scrolled', window.scrollY > 12);
    var y = window.scrollY + (window.innerHeight * 0.32);
    var activa = null;
    for (var i = 0; i < secciones.length; i++) {
      if (secciones[i].sec.offsetTop <= y) activa = secciones[i];
    }
    for (var m = 0; m < secciones.length; m++) {
      secciones[m].link.classList.toggle('activo', secciones[m] === activa);
    }
    pendiente = false;
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; window.requestAnimationFrame(alScroll); }
  }, { passive: true });
  alScroll();

  /* ── revelado al entrar en pantalla ─────────────────────── */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    for (var n = 0; n < rv.length; n++) io.observe(rv[n]);
  } else {
    for (var p = 0; p < rv.length; p++) rv[p].classList.add('in');
  }

  /* ── formulario ─────────────────────────────────────────── */
  var form = document.getElementById('form');
  var estado = document.getElementById('form-estado');

  var TXT = {
    en: {
      faltan: 'Please fill in your name and how I can reach you.',
      abriendo: 'Opening WhatsApp with your request — press send there.',
      saludo: 'Hi Débora! I\'d like to ask about a tour in Buenos Aires.',
      nombre: 'Name', contacto: 'Contact', tour: 'Tour', fecha: 'Date',
      personas: 'Travelers', hotel: 'Staying at', notas: 'Notes'
    },
    es: {
      faltan: 'Completá tu nombre y por dónde te contesto.',
      abriendo: 'Abriendo WhatsApp con tu consulta — ahí le das enviar.',
      saludo: '¡Hola Débora! Quería consultarte por un tour en Buenos Aires.',
      nombre: 'Nombre', contacto: 'Contacto', tour: 'Tour', fecha: 'Fecha',
      personas: 'Personas', hotel: 'Se hospeda en', notas: 'Notas'
    }
  };
  function t(clave) { return TXT[html.getAttribute('lang') === 'es' ? 'es' : 'en'][clave]; }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var nombre = (d.get('nombre') || '').trim();
      var contacto = (d.get('contacto') || '').trim();

      if (!nombre || !contacto) {
        estado.textContent = t('faltan');
        document.getElementById(nombre ? 'f-wa' : 'f-nombre').focus();
        return;
      }

      var lineas = [t('saludo'), ''];
      function sumar(clave, valor) {
        valor = (valor || '').toString().trim();
        if (valor) lineas.push(t(clave) + ': ' + valor);
      }
      sumar('nombre', nombre);
      sumar('contacto', contacto);
      sumar('tour', d.get('tour'));
      sumar('fecha', d.get('fecha'));
      sumar('personas', d.get('personas'));
      sumar('hotel', d.get('hotel'));
      sumar('notas', d.get('notas'));

      estado.textContent = t('abriendo');
      window.open(waLink(lineas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ── año dinámico ───────────────────────────────────────── */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
