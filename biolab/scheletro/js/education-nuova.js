/* PROVA Education: titolo che sale, passaggi del metodo guidati dallo scroll, video delle card al passaggio */
(function(){
  var qf=location.search.match(/fondo=(antracite|carbone|grigio|panna)/);document.documentElement.classList.add('ed-html');if(qf){document.body.classList.add('fondo-'+qf[1]);document.documentElement.classList.add('fondo-'+qf[1]);}
  var h=document.documentElement,ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var n0=0;document.querySelectorAll('.ed-sale span').forEach(function(sp){var t=sp.textContent;sp.innerHTML=t.split('').map(function(c){return c===' '?' ':'<i class="l" style="--i:'+(n0++)+';font-style:normal">'+c+'</i>';}).join('');});
  requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('ed-pronto');});});
  /* sfondo fisso: zoom lento e velo che si scurisce scendendo, come la home */
  var sf=document.querySelector('.ed-sfondo'),sv=document.querySelector('.ed-sfondo-video');if(sv){sv.muted=true;var pp=sv.play();if(pp&&pp.catch)pp.catch(function(){});}
  if(sf&&!ridotto){var fz=function(){var y=scrollY/innerHeight;sf.style.setProperty('--z',Math.min(1,y/4).toFixed(3));sf.style.setProperty('--vid',Math.max(0,Math.min(1,1.6-y*1.1)).toFixed(3));sf.style.setProperty('--scuro',0);requestAnimationFrame(fz);};requestAnimationFrame(fz);}
  /* Educational approach: le tappe si accendono una dopo l'altra quando il percorso entra nello schermo */
  var perc=document.querySelector('.ed-percorso');
  if(perc){var tp=[].slice.call(perc.children);if(ridotto)tp.forEach(function(t){t.classList.add('su');});else{var pio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;pio.disconnect();tp.forEach(function(t,i){setTimeout(function(){t.classList.add('su');},300+i*650);});});},{threshold:.5});pio.observe(perc);}}

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
