// Lightbox con mini slideshow per le pagine Studio e Murales.
// Ogni .art-card ha un'immagine di copertina dentro .art-ph e, se l'opera
// ha piu' scatti, un data-images="img1.jpg|img2.jpg|img3.jpg" (max 2-3)
// con cui il lightbox mostra le frecce avanti/indietro.

function initArtLightbox(){
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbMedia = document.getElementById('lbMedia');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let images = [];
  let idx = 0;
  let activeCard = null;

  function getImages(card){
    const attr = card.dataset.images;
    if (attr) return attr.split('|');
    const img = card.querySelector('.art-ph img');
    return img ? [img.getAttribute('src')] : [];
  }

  function renderImage(){
    const src = images[idx];
    lbMedia.innerHTML = src
      ? '<img src="' + src + '" alt="">'
      : '<div class="lb-ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="3" width="18" height="18" rx="1.5"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>';
    const multi = images.length > 1;
    lbPrev.style.display = multi ? 'flex' : 'none';
    lbNext.style.display = multi ? 'flex' : 'none';
  }

  function renderCaption(){
    const title = activeCard.dataset.title || '';
    const tech = activeCard.dataset.tech || '';
    const dim = activeCard.dataset.dim || '';
    const meta = [tech, dim].filter(Boolean).join(' · ');
    const count = images.length > 1 ? '<span class="lb-note">' + (idx + 1) + ' / ' + images.length + '</span>' : '';
    lbCap.innerHTML = (title ? '<b>' + title + '</b>' : '') + (meta ? '<span class="lb-meta">' + meta + '</span>' : '') + count;
  }

  function open(card){
    activeCard = card;
    images = getImages(card);
    idx = 0;
    renderImage();
    renderCaption();
    lightbox.classList.add('open');
  }

  function step(dir){
    if (images.length < 2) return;
    idx = (idx + dir + images.length) % images.length;
    renderImage();
    renderCaption();
  }

  document.querySelectorAll('.art-card').forEach(card => {
    card.addEventListener('click', () => open(card));
  });

  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); step(1); });

  function closeLb(){ lightbox.classList.remove('open'); lbMedia.innerHTML=''; }
  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
}

document.addEventListener('DOMContentLoaded', initArtLightbox);
