// Lightbox riutilizzabile per le pagine Studio e Murales.
// Ogni .art-card puo' avere data-title / data-tech / data-dim / data-count (n. immagini previste)
// e, quando le foto reali saranno pronte, un tag <img> dentro .art-ph al posto del placeholder:
// basta aggiungere <img src="images/....jpg" alt="..."> dentro .art-ph e verra' mostrato
// automaticamente al posto dell'icona, sia nella griglia che nel lightbox.

function initArtLightbox(){
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbMedia = document.getElementById('lbMedia');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');

  function render(card){
    const title = card.dataset.title || '';
    const tech = card.dataset.tech || '';
    const dim = card.dataset.dim || '';
    const count = parseInt(card.dataset.count || '1', 10);
    const meta = [tech, dim].filter(Boolean).join(' · ');

    const img = card.querySelector('.art-ph img');
    if (img) {
      lbMedia.innerHTML = '<img src="' + img.src + '" alt="' + (img.alt || title) + '">';
    } else {
      lbMedia.innerHTML = '<div class="lb-ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="3" width="18" height="18" rx="1.5"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>';
    }

    const note = (!img && count > 1) ? '<span class="lb-note">' + count + ' immagini in arrivo per quest\'opera</span>' : '';
    lbCap.innerHTML = (title ? '<b>' + title + '</b>' : '') + (meta ? '<span class="lb-meta">' + meta + '</span>' : '') + note;
  }

  document.querySelectorAll('.art-card').forEach(card => {
    card.addEventListener('click', () => {
      render(card);
      lightbox.classList.add('open');
    });
  });

  function closeLb(){ lightbox.classList.remove('open'); lbMedia.innerHTML=''; }
  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}

document.addEventListener('DOMContentLoaded', initArtLightbox);
