/* ═══════════════════════════════════════════════════════════
   Buen Ayre Tours · sitio

   WhatsApp de Débora: +54 9 11 2260-9166
   (en formato wa.me va sin +, sin espacios y sin guiones)

   El formulario manda un mail a buenayretours@gmail.com a través de
   Web3Forms. El botón de WhatsApp queda aparte, como vía rápida: así el
   que no usa WhatsApp igual tiene por dónde escribir.
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
      enviando: 'Sending…',
      ok: 'Thanks! I got your message and I\'ll get back to you shortly.',
      error: 'It didn\'t go through. Please write to me on WhatsApp instead.'
    },
    es: {
      faltan: 'Completá tu nombre y por dónde te contesto.',
      enviando: 'Enviando…',
      ok: '¡Gracias! Recibí tu consulta y te respondo a la brevedad.',
      error: 'No se pudo enviar. Escribime por WhatsApp, por favor.'
    }
  };
  function t(clave) { return TXT[html.getAttribute('lang') === 'es' ? 'es' : 'en'][clave]; }

  if (form) {
    var boton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var datos = new FormData(form);
      var nombre = (datos.get('nombre') || '').trim();
      var contacto = (datos.get('contacto') || '').trim();

      if (!nombre || !contacto) {
        estado.textContent = t('faltan');
        document.getElementById(nombre ? 'f-wa' : 'f-nombre').focus();
        return;
      }

      // si dejó un mail, que ella pueda contestar con Responder
      if (contacto.indexOf('@') > 0) datos.append('replyto', contacto);
      datos.append('idioma', html.getAttribute('lang') === 'es' ? 'Español' : 'Inglés');

      // va como JSON a propósito: con FormData, Web3Forms contesta con una
      // página HTML de éxito y r.json() explota, así que el visitante vería
      // un error aunque el mail haya salido
      var cuerpo = {};
      datos.forEach(function (valor, clave) { cuerpo[clave] = valor; });

      estado.textContent = t('enviando');
      if (boton) boton.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(cuerpo)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) {
          if (d && d.success) {
            form.reset();
            estado.textContent = t('ok');
          } else {
            estado.textContent = t('error');
          }
        })
        .catch(function () {
          estado.textContent = t('error');
        })
        .then(function () {
          if (boton) boton.disabled = false;
        });
    });
  }

  /* ── año dinámico ───────────────────────────────────────── */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
