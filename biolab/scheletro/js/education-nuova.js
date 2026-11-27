/* PROVA Education: titolo che sale, passaggi del metodo guidati dallo scroll, video delle card al passaggio */
(function(){
  var h=document.documentElement,ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('ed-pronto');});});

  function prog(el){var r=el.getBoundingClientRect(),tot=r.height-innerHeight;return Math.min(1,Math.max(0,-r.top/(tot||1)));}
  var hero=document.querySelector('.ed-hero'),hv=document.querySelector('.ed-hero-video');
  var metodo=document.querySelector('.ed-metodo'),passi=[].slice.call(document.querySelectorAll('.ed-passi li')),barra=document.querySelector('.ed-metodo-barra');
  var attuale=-1,mfoto=[].slice.call(document.querySelectorAll('.ed-metodo-foto img'));
  function giro(){
    if(hv){var z=Math.min(1,Math.max(0,scrollY/innerHeight));hv.style.setProperty('--z',z.toFixed(3));}
    if(metodo){var p=prog(metodo),n=Math.min(passi.length-1,Math.floor(p*passi.length*0.999));
      if(n!==attuale){attuale=n;passi.forEach(function(l,i){l.classList.toggle('su',i<=n);l.classList.toggle('ora',i===n);});mfoto.forEach(function(f,i){f.classList.toggle('ora',i===n);});}
      if(barra)barra.style.setProperty('--p',p.toFixed(3));}
    requestAnimationFrame(giro);
  }
  if(!ridotto)requestAnimationFrame(giro);else passi.forEach(function(l){l.classList.add('su');});

  /* entrate allo scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visto');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.ed .entra').forEach(function(el,i){el.style.transitionDelay=(i%2*0.1)+'s';io.observe(el);});
})();
