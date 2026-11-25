/* Emi BioLab · scheletro: header, footer e pagine-modello lette da contenuti.js */
(function () {
  const E = window.EMI;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const qs = k => new URLSearchParams(location.search).get(k);
  const pagina = document.body.dataset.pagina || '';
  const sezione = document.body.dataset.sezione || '';

  /* striscia bozza */
  document.body.insertAdjacentHTML('afterbegin',
    '<div class="bozza-barra">Site skeleton from Emi\'s brief · structure for review · photos are placeholders · lilac notes and example entries to write with Emi</div>');

  /* header */
  const voci = [['education', 'Education', 'education.html'], ['research', 'Research', 'research.html'], ['projects', 'Projects', 'projects.html'], ['about', 'About', 'about.html'], ['contact', 'Contact', 'contact.html']];
  const prossimo = prossimoWorkshop();
  $('.bozza-barra').insertAdjacentHTML('afterend', `
  <header class="testa"><div class="wrap">
    <a class="logo" href="index.html">Emi BioLab</a>
    <button class="apri" aria-expanded="false">Menu</button>
    <nav class="menu">
      ${voci.map(v => `<a href="${v[2]}" class="${sezione === v[0] ? 'attivo' : ''}">${v[1]}</a>`).join('')}
      ${prossimo ? `<a class="cta" href="workshop.html?w=${prossimo.slug}">Next workshop · ${giorno(prossimo.data)}</a>` : ''}
    </nav>
  </div></header>`);
  $('.apri').addEventListener('click', e => { const m = $('.menu'); m.classList.toggle('aperto'); e.target.setAttribute('aria-expanded', m.classList.contains('aperto')); });

  /* footer */
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="piede"><div class="wrap">
    <div class="g4">
      <div><a class="logo" href="index.html">Emi BioLab</a><p class="piccolo muto" style="margin-top:10px">Independent Design &amp; Research Practice. Venice, Italy.</p></div>
      <div><p class="occhiello">Practice</p>${voci.slice(0, 3).map(v => `<a href="${v[2]}">${v[1]}</a>`).join('')}<a href="archive.html">Material Archive</a></div>
      <div><p class="occhiello">Studio</p><a href="about.html">About</a><a href="contact.html">Contact</a><a href="mailto:${E.sito.email}">${E.sito.email}</a><a href="${E.sito.instagram}">Instagram</a></div>
      <div><p class="occhiello">Newsletter</p><p class="piccolo">Research notes and new workshops, once a month.</p>
        <form class="news" onsubmit="event.preventDefault();this.innerHTML='<p class=piccolo>Thank you. (demo)</p>'"><input type="email" placeholder="Your email" aria-label="Email" required><button>Join</button></form></div>
    </div>
    <div class="fine"><span>© Emi BioLab · Carola Emanuela Godja</span><span class="bozza">Privacy · Terms · to write</span></div>
  </div></footer>`);

  /* utilità */
  function giorno(d) { if (!d) return ''; const x = new Date(d + 'T12:00:00'); return x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  function prossimoWorkshop() { const oggi = new Date().toISOString().slice(0, 10); return E.workshops.filter(w => w.data >= oggi).sort((a, b) => a.data < b.data ? -1 : 1)[0]; }
  const nomeArea = c => (E.aree.find(a => a.codice === c) || {}).nome || c;
  const bz = o => o.bozza ? ' <span class="bozza piccolo">(example)</span>' : '';

  const cardWorkshop = w => `<a class="porta" href="workshop.html?w=${w.slug}"><div class="foto larga"><img src="${w.foto}" alt="${esc(w.titolo)}" loading="lazy"></div>
    <div class="riga"><div><div class="titolo">${esc(w.titolo)}</div><div class="meta">${esc(w.formato)} · ${esc(w.quando.split('·')[0])}</div></div><span class="vai">Explore →</span></div><p>${esc(w.sottotitolo)}</p></a>`;
  const cardCorso = c => `<a class="porta" href="course.html?c=${c.slug}"><div class="foto larga"><img src="${c.foto}" alt="${esc(c.titolo)}" loading="lazy"></div>
    <div class="riga"><div><div class="titolo">${esc(c.titolo)}</div><div class="meta">${esc(c.livello)} · ${esc(c.durata)}</div></div><span class="vai">Explore →</span></div><p>${esc(c.sottotitolo)}${bz(c)}</p></a>`;
  const cardScheda = s => `<a class="porta" href="entry.html?e=${s.codice}"><div class="foto"><img src="${s.foto}" alt="${esc(s.titolo)}" loading="lazy"></div>
    <div class="riga"><div><div class="codice">${s.codice}</div><div class="titolo">${esc(s.titolo)}</div><div class="meta">${esc(s.materiale)} · ${esc(s.stato)}</div></div><span class="vai">View →</span></div></a>`;
  const cardProgetto = p => `<a class="porta" href="project.html?p=${p.slug}"><div class="foto"><img src="${p.foto}" alt="${esc(p.titolo)}" loading="lazy"></div>
    <div class="riga"><div><div class="titolo">${esc(p.titolo)}</div><div class="meta">${esc(p.categoria)} · ${esc(p.anno)}</div></div><span class="vai">View →</span></div></a>`;

  /* liste generiche: <div data-lista="workshops|corsi|archivio|progetti|passati" data-max="n"> */
  document.querySelectorAll('[data-lista]').forEach(el => {
    const max = +el.dataset.max || 999, tipo = el.dataset.lista;
    if (tipo === 'workshops') { const l = E.workshops.filter(w => w.data >= new Date().toISOString().slice(0, 10)); el.innerHTML = l.length ? l.slice(0, max).map(cardWorkshop).join('') : '<p class="vuoto">New dates soon. Join the newsletter to know first.</p>'; }
    if (tipo === 'corsi') el.innerHTML = E.corsi.slice(0, max).map(cardCorso).join('');
    if (tipo === 'archivio') el.innerHTML = E.archivio.slice(0, max).map(cardScheda).join('');
    if (tipo === 'progetti') el.innerHTML = E.progetti.slice(0, max).map(cardProgetto).join('');
    if (tipo === 'passati') el.innerHTML = E.workshopPassati.map(p => `<li><span class="anno">${p.anno}</span><b>${esc(p.titolo)}</b><span class="muto piccolo">${esc(p.dove)}</span></li>`).join('');
    if (tipo === 'aree') el.innerHTML = E.aree.map((a, i) => `<a class="porta" href="archive.html?area=${a.codice}"><div class="riga"><div><div class="num">0${i + 1}</div><div class="titolo">${esc(a.nome)}</div><p>${esc(a.testo)}</p></div><span class="vai">Archive →</span></div></a>`).join('');
    if (tipo === 'esperienze') el.innerHTML = Object.entries(E.esperienze).map(([g, l]) => `<h3 style="margin-top:36px">${g}</h3><ul class="righe">${l.map(r => `<li><span class="anno">${r[0]}</span><b>${esc(r[1])}</b><span class="muto piccolo">${esc(r[2])}</span></li>`).join('')}</ul>`).join('');
    if (tipo === 'nomi') el.innerHTML = E.affiliazioni.map(n => `<span class="logo-box">Logo · ${esc(n)}</span>`).join('');
  });

  /* riga "next workshop" */
  document.querySelectorAll('[data-prossimo]').forEach(el => {
    if (!prossimo) { el.remove(); return; }
    el.innerHTML = `<span class="pallino"></span><b>Next live workshop</b><span>${esc(prossimo.titolo)} · ${esc(prossimo.quando)}</span><a class="vai" href="workshop.html?w=${prossimo.slug}">Book →</a>`;
  });

  /* box istruttrice (riusato in workshop e corsi) */
  const istruttrice = `<section class="sez"><div class="wrap"><p class="occhiello">Your instructor</p>
    <div class="fondatrice piccola"><div class="ritratto"><img src="../img/ritratto-berlino.jpg" alt="Carola Emanuela Godja" loading="lazy"></div>
    <div><h2>Carola Emanuela Godja</h2><p class="muto" style="margin-top:8px">Designer &amp; Researcher · Founder of Emi BioLab</p>
    <p style="margin-top:16px;max-width:620px">MA in Fashion at Iuav University of Venice, with honours. Years of research on alginate yarn, taught at Kent State University, UIUC and Ocean Space, speaker at TEDxVenezia. Learners in 16+ countries.</p>
    <div class="bottoni"><a class="btn linea" href="about.html">Full profile →</a></div></div></div></div></section>`;

  const vuota = (cosa, link, nome) => { $('main').innerHTML = `<div class="wrap hero"><h1>Not found</h1><p class="lead">This ${cosa} does not exist (yet).</p><div class="bottoni"><a class="btn" href="${link}">${nome}</a></div></div>`; };
  const briciole = l => `<nav class="briciole wrap">${l.map(x => x[1] ? `<a href="${x[1]}">${x[0]}</a>` : `<b>${esc(x[0])}</b>`).join('<span>/</span>')}</nav>`;

  /* PAGINA-MODELLO: workshop */
  if (pagina === 'workshop') {
    const w = E.workshops.find(x => x.slug === qs('w')) || E.workshops[0];
    if (!w) return vuota('workshop', 'workshops.html', 'All workshops');
    document.title = `${w.titolo} · Workshop · Emi BioLab`;
    const correlate = E.archivio.filter(s => (w.collegati || []).includes(s.codice));
    $('main').innerHTML = `${briciole([['Education', 'education.html'], ['Workshops', 'workshops.html'], [w.titolo]])}
    <section class="hero"><div class="wrap hero-due"><div><p class="occhiello">Workshop · ${esc(w.formato)}</p><h1><span class="macchia">${esc(w.titolo)}</span></h1><p class="lead">${esc(w.intro)}</p>
      <div class="bottoni"><a class="btn" href="${w.link}">Reserve your spot →</a><a class="btn linea" href="#programme">Programme</a></div></div>
      <div class="hero-foto"><img src="${w.foto}" alt="${esc(w.titolo)}"></div></div>
      <div class="wrap"><div class="info"><div><small>When</small><b>${giorno(w.data)}</b></div><div><small>Time</small><b>${esc(w.quando.split('·')[1] || '')}</b></div><div><small>Duration</small><b>${esc(w.durata)}</b></div><div><small>Price</small><b>${esc(w.prezzo)}</b></div></div></div></section>
    <section class="sez"><div class="wrap g2"><div><p class="occhiello">01 · Learning outcomes</p><h2>What you will learn</h2></div><ul class="punti">${w.impari.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div></section>
    <section class="sez"><div class="wrap"><p class="occhiello">02 · Process &amp; techniques</p><div class="percorso">${w.tecniche.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="g3" style="margin-top:40px"><div class="porta"><div class="foto larga"><img src="../img/miscela-ciotola.jpg" alt="Mixture" loading="lazy"></div></div><div class="porta"><div class="foto larga"><img src="../img/mani-filato.jpg" alt="Extrusion" loading="lazy"></div></div><div class="porta"><div class="foto larga"><img src="../img/filato-perlato.jpg" alt="Yarn" loading="lazy"></div></div></div></div></section>
    <section class="sez" id="programme"><div class="wrap g2"><div><p class="occhiello">03 · Programme</p><h2>The session</h2></div><ul class="righe">${w.programma.map(p => `<li><span class="anno">${p[0]}</span><b>${esc(p[1])}</b><span></span></li>`).join('')}</ul></div></section>
    <section class="sez"><div class="wrap"><p class="occhiello">04 · Practical information</p>
      <div class="dati"><div><small>Format</small>${esc(w.formato)} on Google Meet</div><div><small>Duration</small>${esc(w.durata)}</div><div><small>Level</small>${esc(w.livello)}</div><div><small>Language</small>English</div></div>
      <div class="blocco"><h3>Materials &amp; tools</h3><p>${esc(w.materiali)}</p></div></div></section>
    ${istruttrice}
    <section class="sez"><div class="wrap g2"><div><p class="occhiello">FAQ</p><h2>Questions</h2></div><div>${w.faq.map(f => `<details class="faq"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('')}</div></div></section>
    ${correlate.length ? `<section class="sez"><div class="wrap"><div class="sez-testa"><div><p class="occhiello">Related research</p><h2>From the archive</h2></div><a class="vai" href="archive.html">All entries →</a></div><div class="g3">${correlate.map(cardScheda).join('')}</div></div></section>` : ''}
    <section class="sez"><div class="wrap" style="text-align:center"><h2><span class="macchia">Join us on ${giorno(w.data)}</span></h2><p class="lead" style="margin:16px auto 0">${esc(w.quando)} · ${esc(w.prezzo)}</p><div class="bottoni" style="justify-content:center"><a class="btn" href="${w.link}">Reserve your spot →</a><a class="btn rosa" href="workshops.html">Other workshops</a></div></div></section>`;
  }

  /* PAGINA-MODELLO: corso */
  if (pagina === 'course') {
    const c = E.corsi.find(x => x.slug === qs('c')) || E.corsi[0];
    if (!c) return vuota('course', 'courses.html', 'All courses');
    document.title = `${c.titolo} · Course · Emi BioLab`;
    $('main').innerHTML = `${briciole([['Education', 'education.html'], ['Online courses', 'courses.html'], [c.titolo]])}
    <section class="hero"><div class="wrap hero-due"><div><p class="occhiello">Online course · ${esc(c.livello)}${bz(c)}</p><h1>${esc(c.titolo)}</h1><p class="lead">${esc(c.sottotitolo)}</p><div class="bottoni"><a class="btn" href="#">Get access →</a></div></div><div class="hero-foto"><img src="${c.foto}" alt="${esc(c.titolo)}"></div></div></section>
    <section class="sez"><div class="wrap g2"><div><p class="occhiello">Learning objectives</p><h2>By the end</h2></div><ul class="punti">${c.obiettivi.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div></section>
    <section class="sez"><div class="wrap g2"><div><p class="occhiello">Modules &amp; lessons</p><h2>${c.moduli.length} modules</h2></div><ul class="righe">${c.moduli.map((m, i) => `<li><span class="anno">Module 0${i + 1}</span><b>${esc(m)}</b><span></span></li>`).join('')}</ul></div></section>
    <section class="sez"><div class="wrap"><div class="dati"><div><small>Level</small>${esc(c.livello)}</div><div><small>Format</small>${esc(c.durata)}</div><div><small>Included</small>${c.incluso.map(esc).join(', ')}</div><div><small>Price</small>${esc(c.prezzo)}</div></div></div></section>
    ${istruttrice}`;
  }

  /* PAGINA-MODELLO: scheda archivio */
  if (pagina === 'entry') {
    const s = E.archivio.find(x => x.codice === qs('e')) || E.archivio[0];
    if (!s) return vuota('entry', 'archive.html', 'Material archive');
    document.title = `${s.codice} ${s.titolo} · Material Archive · Emi BioLab`;
    const simili = E.archivio.filter(x => x !== s && (x.area === s.area || x.materiale === s.materiale)).slice(0, 3);
    $('main').innerHTML = `${briciole([['Research', 'research.html'], ['Material Archive', 'archive.html'], [s.codice]])}
    <section class="hero"><div class="wrap hero-due"><div><p class="occhiello codice">${s.codice}${bz(s)}</p><h1 style="font-size:clamp(36px,6vw,80px)">${esc(s.titolo)}</h1><p style="margin-top:20px"><span class="stato">${esc(s.stato)}</span></p></div><div class="hero-foto"><img src="${s.foto}" alt="${esc(s.titolo)}"></div></div></section>
    <section class="sez"><div class="wrap"><div class="dati"><div><small>Date</small>${esc(s.data)}</div><div><small>Material</small>${esc(s.materiale)}</div><div><small>Technique</small>${esc(s.tecnica)}</div><div><small>Area</small>${esc(nomeArea(s.area))}</div></div>
      <div class="blocco"><h3>Research question</h3><p class="lead" style="font-size:20px">${esc(s.domanda)}</p></div>
      ${s.composizione ? `<div class="blocco"><h3>Composition</h3><p>${esc(s.composizione)}</p></div>` : `<div class="blocco"><h3>Composition</h3><p class="muto">Not published.</p></div>`}
      <div class="blocco"><h3>Parameters</h3><p>${esc(s.parametri)}</p></div>
      <div class="blocco"><h3>Observations</h3><p class="bozza">${esc(s.osservazioni)}</p></div></div></section>
    ${simili.length ? `<section class="sez"><div class="wrap"><div class="sez-testa"><div><p class="occhiello">Related materials</p><h2>Same area</h2></div></div><div class="g3">${simili.map(cardScheda).join('')}</div></div></section>` : ''}`;
  }

  /* PAGINA-MODELLO: progetto */
  if (pagina === 'project') {
    const p = E.progetti.find(x => x.slug === qs('p')) || E.progetti[0];
    if (!p) return vuota('project', 'projects.html', 'All projects');
    document.title = `${p.titolo} · Projects · Emi BioLab`;
    const altri = E.progetti.filter(x => x !== p).slice(0, 3);
    $('main').innerHTML = `${briciole([['Projects', 'projects.html'], [p.titolo]])}
    <section class="hero"><div class="wrap"><p class="occhiello">${esc(p.categoria)} · ${esc(p.anno)}</p><h1>${esc(p.titolo)}</h1><p class="lead">${esc(p.intro)}</p><div class="hero-foto"><img src="${p.foto}" alt="${esc(p.titolo)}"></div></div></section>
    <section class="sez"><div class="wrap"><div class="dati"><div><small>Year</small>${esc(p.anno)}</div><div><small>Place</small>${esc(p.luogo || '·')}</div><div><small>Emi BioLab's role</small>${esc(p.ruolo)}</div><div><small>Credits</small>${esc(p.crediti)}</div></div>
      ${['Concept / research question', 'Materials & processes', 'Development & experimentation', 'Outcomes / applications'].map(t => `<div class="blocco"><h3>${t}</h3><p class="bozza">To write with Emi.</p></div>`).join('')}</div></section>
    <section class="sez"><div class="wrap"><div class="sez-testa"><div><p class="occhiello">More projects</p><h2>Related</h2></div><a class="vai" href="projects.html">All projects →</a></div><div class="g3">${altri.map(cardProgetto).join('')}</div></div></section>`;
  }

  /* ARCHIVIO con filtri e ricerca */
  const arch = $('[data-archivio]');
  if (arch) {
    const f = { area: qs('area') || '', materiale: '', tecnica: '', stato: '', q: '' };
    const opz = (k, nome) => `<select data-f="${k}" aria-label="${nome}"><option value="">${nome}</option>${[...new Set(E.archivio.map(s => s[k]))].map(v => `<option>${esc(v)}</option>`).join('')}</select>`;
    $('[data-filtri]').innerHTML = `<input data-f="q" placeholder="Search the archive" aria-label="Search">
      <select data-f="area" aria-label="Area"><option value="">Area</option>${E.aree.map(a => `<option value="${a.codice}" ${f.area === a.codice ? 'selected' : ''}>${esc(a.nome)}</option>`).join('')}</select>
      ${opz('materiale', 'Material')}${opz('tecnica', 'Technique')}${opz('comportamento', 'Behaviour')}${opz('stato', 'Status')}`;
    const disegna = () => {
      const l = E.archivio.filter(s => Object.entries(f).every(([k, v]) => !v || (k === 'q' ? (s.titolo + s.materiale + s.codice + s.tecnica).toLowerCase().includes(v.toLowerCase()) : s[k] === v)));
      arch.innerHTML = l.length ? l.map(cardScheda).join('') : '<p class="vuoto">No entries match these filters.</p>';
      $('[data-conta]').textContent = `${l.length} of ${E.archivio.length} entries`;
    };
    document.querySelectorAll('[data-f]').forEach(el => el.addEventListener('input', () => { f[el.dataset.f] = el.value; disegna(); }));
    disegna();
  }

  /* PROGETTI con filtri */
  const prog = $('[data-progetti]');
  if (prog) {
    const cats = ['All', 'Independent', 'Collaborative', 'Installations', 'Applications'];
    $('[data-filtri-p]').innerHTML = cats.map((c, i) => `<button class="${i ? '' : 'attivo'}" data-c="${c}">${c}</button>`).join('');
    const disegna = c => { const l = E.progetti.filter(p => c === 'All' || p.categoria === c); prog.innerHTML = l.length ? l.map(cardProgetto).join('') : '<p class="vuoto">No projects in this category yet.</p>'; };
    document.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('[data-c]').forEach(x => x.classList.remove('attivo')); b.classList.add('attivo'); disegna(b.dataset.c); }));
    disegna('All');
  }

  /* BOZZA DI STRUTTURA: ogni foto diventa un riquadro grigio con la descrizione */
  function segnaposti() {
    document.querySelectorAll('main img').forEach(img => {
      const d = document.createElement('div');
      d.className = 'segnaposto';
      d.innerHTML = `<span>${esc(img.alt || 'Photo')}</span>`;
      img.replaceWith(d);
    });
  }
  segnaposti();

})();
