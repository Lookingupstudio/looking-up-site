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


  /* filo ondulato dietro alle tappe (orizzontale su PC, verticale sul telefono): si muove appena e si colora di rosa man mano che le tappe si accendono */
  (function(){
    var ol=document.querySelector('.ed-percorso');if(!ol)return;
    var NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('class','ed-onda');svg.setAttribute('aria-hidden','true');
    var base=document.createElementNS(NS,'path'),rosa=document.createElementNS(NS,'path');base.setAttribute('class','base');rosa.setAttribute('class','rosa');
    svg.appendChild(base);svg.appendChild(rosa);ol.insertBefore(svg,ol.firstChild);
    var li=[].slice.call(ol.querySelectorAll('li')),lun=0,att=0,t0=performance.now(),fermo=matchMedia('(prefers-reduced-motion: reduce)').matches,mq=matchMedia('(max-width: 760px)');
    function giro(t){
      var s=(t-t0)/1000,d='',vert=mq.matches,last=li[li.length-1];
      if(vert){svg.style.height=ol.clientHeight+'px';var y0=11,y1=last.offsetTop+11,cx=5.5;
        for(var y=y0;y<=y1;y+=4){var k=(y-y0)/(y1-y0),amp=3.2*Math.sin(Math.PI*k);var x=cx+amp*Math.sin(y/30-s*0.9)+1.1*Math.sin(y/14+s*0.6);d+=(d?'L':'M')+x.toFixed(2)+' '+y.toFixed(1);}}
      else{svg.style.height='';var x0=5.5,x1=last.offsetLeft+5.5,cy=11.5;
        for(var x2=x0;x2<=x1;x2+=4){var k2=(x2-x0)/(x1-x0),a2=3.2*Math.sin(Math.PI*k2);var yy=cy+a2*Math.sin(x2/38-s*0.9)+1.2*Math.sin(x2/17+s*0.6);d+=(d?'L':'M')+x2.toFixed(1)+' '+yy.toFixed(2);}}
      if(svg.dataset.v!==String(vert)){svg.dataset.v=String(vert);lun=0;}
      base.setAttribute('d',d);rosa.setAttribute('d',d);
      if(!lun){lun=rosa.getTotalLength()||1;rosa.style.strokeDasharray=lun;}
      var accese=li.filter(function(l){return l.classList.contains('su');}).length,meta=accese<=1?0:(accese-1)/(li.length-1);
      att+=(meta-att)*0.04;rosa.style.strokeDashoffset=(lun*(1-att)).toFixed(1);
      if(!fermo)requestAnimationFrame(giro);
    }
    addEventListener('resize',function(){lun=0;});
    requestAnimationFrame(giro);
  })();
  /* la notifica del prossimo workshop scende quando entra nello schermo */
  var nt=document.querySelector('.ed-notifica');
  if(nt){var nio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){setTimeout(function(){nt.classList.add('su');},150);nio.disconnect();}});},{threshold:.6});nio.observe(nt);}
  /* entrate allo scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visto');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.ed .entra').forEach(function(el,i){el.style.transitionDelay=(i%2*0.1)+'s';io.observe(el);});
})();
