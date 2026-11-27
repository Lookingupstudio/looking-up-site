/* Pagine interne: sfondo fisso (foto dell'apertura o video della sezione) che sfuma nel fondo morbido, titolo che si accende, sezioni che entrano */
(function(){
  var h=document.documentElement,b=document.body,ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  h.classList.add('pg-html');b.classList.add('pg');
  var VIDEO={education:'education',research:'research',projects:'projects'};
  var sf=document.createElement('div');sf.className='pg-sfondo';sf.setAttribute('aria-hidden','true');sf.innerHTML='<div class="pg-sfumato"></div>';
  var foto=document.querySelector('.hero .hero-foto img'),media=null,sez=b.dataset.sezione;
  if(foto&&foto.getAttribute('src')){media=document.createElement('img');media.src=foto.getAttribute('src');media.alt='';}
  else if(VIDEO[sez]){media=document.createElement('video');media.muted=true;media.loop=true;media.playsInline=true;media.setAttribute('playsinline','');media.autoplay=true;media.preload='auto';
    media.poster='video/sezioni/'+VIDEO[sez]+'.jpg';media.innerHTML='<source src="video/sezioni/'+VIDEO[sez]+'.webm" type="video/webm"><source src="video/sezioni/'+VIDEO[sez]+'.mp4" type="video/mp4">';}
  if(media){media.className='pg-media';media.setAttribute('data-vera','');sf.appendChild(media);var v=document.createElement('div');v.className='velo';sf.appendChild(v);}
  b.insertBefore(sf,b.firstChild);
  if(media&&media.play){var p=media.play();if(p&&p.catch)p.catch(function(){});}
  if(!ridotto){(function giro(){var y=scrollY/innerHeight;sf.style.setProperty('--z',Math.min(1,y/4).toFixed(3));sf.style.setProperty('--vid',Math.max(0,Math.min(1,1.5-y*1.1)).toFixed(3));requestAnimationFrame(giro);})();}
  /* titolo: lettere che si accendono come in home */
  var h1=document.querySelector('.hero h1 .macchia')||document.querySelector('.hero h1');
  if(h1&&!h1.querySelector('*')){var n=0;h1.innerHTML=h1.textContent.split(' ').map(function(w){return '<span style="white-space:nowrap">'+w.split('').map(function(c){return '<i class="pg-l" style="--i:'+(n++)+'">'+c+'</i>';}).join('')+'</span>';}).join(' ');}
  requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('pg-pronto');});});
  /* sezioni che entrano, percorsi che si accendono */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
    if(el.classList.contains('percorso')){[].forEach.call(el.children,function(t,i){setTimeout(function(){t.classList.add('su');},250+i*600);});}else el.classList.add('visto');});},{threshold:.12});
  function osserva(){document.querySelectorAll('main .sez>.wrap').forEach(function(w){if(!w.classList.contains('pg-entra')){w.classList.add('pg-entra');if(ridotto)w.classList.add('visto');else io.observe(w);}});
    document.querySelectorAll('main .percorso').forEach(function(p){if(ridotto)[].forEach.call(p.children,function(t){t.classList.add('su');});else io.observe(p);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(osserva,50);});else setTimeout(osserva,50);
})();
