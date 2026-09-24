/* ═══════════════════════════════════════════════════════════
   ALIA coiffure — content.js
   ► L'UNIQUE FICHIER DE CONTENU. Textes + visuels du site.
   Les images sont dans images/ : pour changer une photo, remplacer
   le fichier en gardant le même nom (ou changer le chemin ici).
   La partie « INJECTION » en bas de fichier ne se modifie pas.
   Tarifs, horaires, adresse : voir index.html (sections
   « PRESTATIONS » et « FOOTER »).
   ═══════════════════════════════════════════════════════════ */

window.SITE_CONTENT = {

  brand: {
    name: 'ALIA',
    title: 'ALIA coiffure — Salon de coiffure à Champigny-sur-Marne',
    description: 'ALIA coiffure, salon de coiffure à Champigny-sur-Marne : brushing, coupe, couleur, mèches, lissage brésilien et soins. Ouvert 7 j/7 de 10 h à 19 h. Réservation en ligne sur Planity.',
    kicker: 'ALIA COIFFURE — SALON, CHAMPIGNY-SUR-MARNE',
    copyright: '© 2026 — ALIA COIFFURE, CHAMPIGNY-SUR-MARNE',
    signature: 'OUVERT 7 J/7 — 10 H → 19 H',
    socials: [
      { label: 'INSTAGRAM ↗', url: 'https://www.instagram.com/_aliacoiffureofficial/' },
      { label: 'TIKTOK ↗', url: 'https://www.tiktok.com/@_aliacoiffureofficial' },
      { label: 'SNAPCHAT ↗', url: 'https://www.snapchat.com/add/aliacoiffure' }
    ]
  },

  nav: { proof: 'RÉALISATIONS', universes: 'EXPÉRIENCE', cta: 'RÉSERVER' },

  /* 1 · ACCROCHE */
  hook: {
    line1: 'L’élégance commence',
    line2a: 'par vos',
    line2b: 'cheveux.',
    image: 'images/hero.jpg',
    imageAlt: 'Chevelure brillante en mouvement, fraîchement coiffée au salon ALIA',
    floaters: [
      'images/fl-01.jpg', 'images/fl-02.jpg', 'images/fl-03.jpg', 'images/fl-04.jpg',
      'images/fl-05.jpg', 'images/fl-06.jpg', 'images/fl-07.jpg', 'images/fl-08.jpg',
      'images/fl-09.jpg', 'images/fl-10.jpg'
    ]
  },

  /* 2 · POSITIONNEMENT — ≤ 42 caractères */
  positioning: 'Coupe, couleur, lissage — à Champigny.',

  /* 3 · DÉMARCHE — [[…]] = 2 à 3 mots max */
  manifesto: {
    text: 'Chez ALIA, chaque rendez-vous commence par une écoute. On lit la matière, la lumière, votre rythme — puis on crée une coiffure [[qui vous ressemble]], et qui tient bien après la sortie du salon.'
  },

  /* 4 · PREUVE — 8 réalisations du salon */
  proof: {
    layout: 'masonry',
    kicker: 'RÉALISATIONS DU SALON',
    title: 'Le travail, en images',
    sub: 'Brushings, couleurs, mèches et lissages, réalisés au salon.',
    meta: 'HUIT RÉALISATIONS — CHAMPIGNY-SUR-MARNE',
    projects: [
      { img: 'images/real-01.jpg', title: 'Brushing wavy', meta: 'BRUSHING — CHEVEUX LONGS' },
      { img: 'images/real-02.jpg', title: 'Blond polaire', meta: 'MÈCHES + PATINE' },
      { img: 'images/real-03.jpg', title: 'Carré net', meta: 'COUPE + BRUSHING' },
      { img: 'images/real-04.jpg', title: 'Lissage miroir', meta: 'LISSAGE BRÉSILIEN' },
      { img: 'images/real-05.jpg', title: 'Brun profond', meta: 'COULEUR RACINE' },
      { img: 'images/real-06.jpg', title: 'Balayage lumière', meta: 'COULEUR + MÈCHES' },
      { img: 'images/real-07.jpg', title: 'Volume bouclé', meta: 'BRUSHING BOUCLÉ' },
      { img: 'images/real-08.jpg', title: 'Soin brillance', meta: 'SOIN BOTOX + BRUSHING' }
    ]
  },

  /* 5 · DEVISE */
  motto: {
    kicker: 'CE QUI GUIDE CHAQUE RENDEZ-VOUS',
    words: [
      { word: 'Écoute', hint: 'Vos envies d’abord, le ciseau ensuite.' },
      { word: 'Précision', hint: 'Une coupe juste, une couleur maîtrisée.' },
      { word: 'Éclat', hint: 'Des cheveux qui brillent longtemps après le salon.' }
    ]
  },

  /* 6-7 · PROCESSUS */
  universes: {
    introA: 'Une',
    introB: 'visite,',
    introC: '3 temps.',
    cta: 'Prendre rendez-vous →',
    image: 'images/process.jpg',
    items: [
      { name: 'Le diagnostic', meta: 'TEMPS — 01', desc: 'On regarde la matière, la longueur, votre routine. Vous repartez avec un conseil clair, pas une coiffure imposée.' },
      { name: 'La création', meta: 'TEMPS — 02', desc: 'Coupe, couleur, mèches ou lissage : chaque geste est pensé pour votre visage et vos cheveux.' },
      { name: 'La finition', meta: 'TEMPS — 03', desc: 'Brushing soigné et conseils d’entretien, pour garder l’éclat à la maison.' }
    ]
  },

  /* 8 · PREUVE SOCIALE — À FAIRE VALIDER : avis et prénom inventés */
  testimonial: {
    kicker: 'OUVERT DU LUNDI AU DIMANCHE, 10 H — 19 H',
    figure: '7',
    unit: 'j/7',
    quote: 'Je suis venue pour un simple brushing, je suis repartie avec des conseils que personne ne m’avait jamais donnés. Maintenant, c’est mon salon.',
    author: 'SARAH B. — CLIENTE FIDÈLE'
  },

  /* 9 · OBJECTIONS */
  objections: {
    items: ['Pas d’attente interminable.', 'Pas de prix cachés.', 'Pas de coiffure standard.'],
    finale: 'Juste vous,',
    pill: 'sublimée.'
  },

  /* 10 · CONVERSION — pas d'e-mail : le footer affiche les réseaux */
  contact: {
    kicker: 'PRENEZ RENDEZ-VOUS',
    email: '',
    reassurance: 'RÉSERVATION EN LIGNE 24 H/24 — CONFIRMATION IMMÉDIATE'
  },

  /* traînée sous la souris — 20 visuels */
  trail: [
    'images/trail-01.jpg', 'images/trail-02.jpg', 'images/trail-03.jpg', 'images/trail-04.jpg',
    'images/trail-05.jpg', 'images/trail-06.jpg', 'images/trail-07.jpg', 'images/trail-08.jpg',
    'images/trail-09.jpg', 'images/trail-10.jpg', 'images/trail-11.jpg', 'images/trail-12.jpg',
    'images/trail-13.jpg', 'images/trail-14.jpg', 'images/trail-15.jpg', 'images/trail-16.jpg',
    'images/trail-17.jpg', 'images/trail-18.jpg', 'images/trail-19.jpg', 'images/trail-20.jpg'
  ]
};

/* ═══════════════════════════════════════════════════════════
   INJECTION — NE PAS MODIFIER (remplit le DOM avant app.js)
   ═══════════════════════════════════════════════════════════ */
(() => {
  const C = window.SITE_CONTENT;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const set = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };

  document.title = C.brand.title;
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', C.brand.description);

  // chrome
  set('.loader-wordmark', C.brand.name);
  set('.dock-wordmark', C.brand.name);
  set('.dock-link[href="#travaux"]', C.nav.proof);
  set('.dock-link[href="#explorer"]', C.nav.universes);
  set('.dock-cta', C.nav.cta);

  // 1 · accroche
  set('#heroKicker', C.brand.kicker);
  set('#heroLine1', C.hook.line1);
  const hls = $$('#heroLine2 .hl');
  if (hls.length === 2) { hls[0].textContent = C.hook.line2a; hls[1].textContent = C.hook.line2b; }
  const g1 = $('#grow1 img');
  if (g1) { g1.src = C.hook.image; g1.alt = C.hook.imageAlt; }
  $$('.floaters .fl img').forEach((img, i) => { if (C.hook.floaters[i]) img.src = C.hook.floaters[i]; });

  // 2 · positionnement (un span par mot)
  const intro = $('#spotIntro');
  if (intro) intro.innerHTML = C.positioning.split(' ').map((w) => `<span>${w}</span>`).join(' ');

  // 3 · démarche
  const fill = $('#fillText');
  if (fill) {
    fill.innerHTML = C.manifesto.text.replace(
      /\[\[(.+?)\]\]/,
      '<span class="boxed" id="boxedPhrase">$1<svg class="box-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path id="boxPath" d="M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z"/></svg></span>'
    );
  }

  // 4 · preuve : masonry (8 photos) ou bento (4 features big/tall/tall/big)
  const head = $$('.coll-head > *');
  if (head.length === 4) {
    head[0].textContent = C.proof.kicker;
    head[1].textContent = C.proof.title;
    head[2].textContent = C.proof.sub;
    head[3].textContent = C.proof.meta;
  }
  const grid = $('#collGrid');
  if (grid && C.proof.layout === 'bento') {
    grid.className = 'bento-grid';
    grid.innerHTML = C.proof.features.map((f) =>
      `<figure class="card${f.size ? ' b-' + f.size : ''}"><div class="card-img"><img src="${f.illu}" alt="${f.title}"></div><figcaption>${f.title}<span class="mono">${f.meta}</span></figcaption></figure>`
    ).join('');
  } else if (grid) {
    grid.className = 'coll-grid';
    const SPEEDS = [-0.05, 0.06, -0.028, 0.085];
    grid.innerHTML = SPEEDS.map((s, ci) =>
      `<div class="col" data-pspeed="${s}">` +
      C.proof.projects.slice(ci * 2, ci * 2 + 2).map((p) =>
        `<figure class="card"><div class="card-img"><img src="${p.img}" alt="${p.title} — ${p.meta}"></div><figcaption>${p.title}<span class="mono">${p.meta}</span></figcaption></figure>`
      ).join('') + '</div>'
    ).join('');
  }

  // 5 · devise (train de mots-clés)
  set('#mottoKicker', C.motto.kicker);
  const mtrack = $('#mottoTrack');
  if (mtrack) mtrack.innerHTML = C.motto.words.map((w) => `<span class="mw">${w.word}</span>`).join('');

  // 6-7 · processus immersif (visuels posés un à un)
  set('#nw1', C.universes.introA);
  set('#nw2', C.universes.introB);
  set('#nw3', C.universes.introC);
  const g2 = $('#grow2 img');
  if (g2) g2.src = C.universes.image || (C.universes.items[0] || {}).img || g2.src;
  const psteps = $('#psteps');
  if (psteps) {
    psteps.innerHTML = C.universes.items.map((u) =>
      `<div class="pstep"><span class="pstep-meta mono ash">${u.meta}</span><h3>${u.name}</h3><p>${u.desc || ''}</p></div>`
    ).join('');
  }
  const sCta = $('#stepsCtaLink');
  if (sCta) sCta.childNodes[0].textContent = C.universes.cta;

  // 8 · preuve sociale — le chiffre qui frappe
  set('#figKicker', C.testimonial.kicker || '');
  const figM = String(C.testimonial.figure || '').trim().match(/^([^\d.,+-]*[+\u2212-]?)\s*(-?[\d.,]+)/);
  set('#figPre', figM ? figM[1] : '');
  set('#figVal', figM ? figM[2] : '');
  set('#figUnit', C.testimonial.unit || '');
  set('#quoteText', C.testimonial.quote);
  set('#quoteAuthor', C.testimonial.author);

  // 9 · objections
  C.objections.items.forEach((t, i) => set('#fs' + (i + 1), t));
  const fs4 = $('#fs4');
  if (fs4) {
    fs4.innerHTML = `${C.objections.finale} <span class="pill" id="pillPhrase">${C.objections.pill}<svg class="pill-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path id="pillPath" d="M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z"/></svg></span>`;
  }
  $$('#trail img').forEach((img, i) => { img.src = C.trail[i % C.trail.length]; });

  // 10 · conversion
  set('.footer-kicker', C.contact.kicker);
  const mail = $('.footer-mail');
  if (mail) { mail.href = 'mailto:' + C.contact.email; mail.querySelector('.footer-mail-text').textContent = C.contact.email; }
  set('.footer-reassurance', C.contact.reassurance);
  const fname = $('#footerName');
  if (fname) { fname.textContent = C.brand.name; fname.setAttribute('aria-label', C.brand.name); }
  const bottom = $$('.footer-bottom > p');
  if (bottom.length === 3) {
    bottom[0].textContent = C.brand.copyright;
    bottom[1].innerHTML = C.brand.socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('&nbsp;&nbsp;&nbsp;');
    bottom[2].textContent = C.brand.signature;
  }
})();
