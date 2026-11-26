/* Pagina workshop Algi Yarn: movimenti guidati dallo scroll (stile alethia.earth) */
(function(){
  var h=document.documentElement,ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* caricamento: punto che pulsa, poi via */
  function pronto(){setTimeout(function(){h.classList.add('pronto');},ridotto?0:600);}
  if(document.readyState==='complete')pronto();else addEventListener('load',pronto);
  setTimeout(function(){h.classList.add('pronto');},3500);

  function prog(el){var r=el.getBoundingClientRect(),tot=r.height-innerHeight;return Math.min(1,Math.max(0,-r.top/(tot||1)));}
  function lerp(a,b,t){return a+(b-a)*t;}
  function tra(p,a,b){return Math.min(1,Math.max(0,(p-a)/(b-a)));}

  var hero=document.querySelector('.hero'),ogg=[].slice.call(document.querySelectorAll('.ogg'));
  var zoom=document.querySelector('.zoom'),zf=zoom&&zoom.querySelector('.zoom-foto'),zfr=zoom&&zoom.querySelector('.zoom-frase'),neb=zoom&&zoom.querySelector('.nebbia');
  var proc=document.querySelector('.processo'),passi=[].slice.call(document.querySelectorAll('.passi li')),foto=[].slice.call(document.querySelectorAll('.processo-foto .segnaposto'));
  var vetro=document.querySelector('.vetro'),vpasso=document.querySelector('.vetro-passo');
  var nera=document.querySelector('.nera[data-scena]'),ruota=document.querySelector('.ruota'),righe=[].slice.call(document.querySelectorAll('.frase-grande span'));
  var viaggio=document.querySelector('.fondo-viaggio'),tela=document.querySelector('.viaggio-tela'),vtxt=[].slice.call(document.querySelectorAll('.viaggio-testi li')),vbar=document.querySelector('.viaggio-barra'),vt=0;
  /* fotogrammi del video: si caricano prima uno ogni 8, poi si riempiono i buchi */
  var fot=[],TOT=tela?+tela.dataset.totale:0,ctx=tela&&tela.getContext('2d'),ultimo=-1;
  function nome(i){return tela.dataset.frame.replace('{n}',('00'+(i+1)).slice(-3));}
  if(tela){var ordine=[],vis={};[8,4,2,1].forEach(function(p){for(var i=0;i<TOT;i+=p)if(!vis[i]){vis[i]=1;ordine.push(i);}});
    var attivi=0,pos=0;function prossimo(){while(attivi<6&&pos<ordine.length){(function(i){var im=new Image();attivi++;im.onload=function(){fot[i]=im;attivi--;ultimo=-1;prossimo();};im.onerror=function(){attivi--;prossimo();};im.src=nome(i);})(ordine[pos++]);}}
    prossimo();
    var dim=function(){var r=window.devicePixelRatio||1;tela.width=Math.round(tela.clientWidth*Math.min(r,2));tela.height=Math.round(tela.clientHeight*Math.min(r,2));ultimo=-1;};dim();addEventListener('resize',dim);}
  function disegna(p){var t=Math.round(p*(TOT-1));if(t===ultimo)return;
    var im=null;for(var d=0;d<TOT;d++){if(fot[t-d]){im=fot[t-d];break;}if(fot[t+d]){im=fot[t+d];break;}}
    if(!im)return;ultimo=t;var W=tela.width,H=tela.height,s=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);}
  var chiara=document.querySelector('.chiara'),barra=document.querySelector('.barra');
  var mx=0,my=0,cx=0,cy=0,attuale=-1;

  addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;},{passive:true});

  function giro(){
    cx=lerp(cx,mx,.06);cy=lerp(cy,my,.06);
    /* hero: oggetti con parallasse di mouse e scroll */
    var sh=Math.min(1,scrollY/innerHeight);
    ogg.forEach(function(o){var p=+o.dataset.p;o.style.transform='translate3d('+(cx*p*-26)+'px,'+(cy*p*-20-sh*p*90)+'px,0) scale('+(1+sh*p*.05)+')';});
    /* zoom: la foto cresce fino a tutto schermo, poi la frase */
    if(zoom){var p=prog(zoom),s=lerp(.32,1,tra(p,0,.55));zf.style.setProperty('--s',s.toFixed(4));
      neb.style.setProperty('--n',tra(p,.45,.7).toFixed(3));
      var f=tra(p,.55,.75);zfr.style.setProperty('--f',f.toFixed(3));zfr.style.setProperty('--fy',((1-f)*40).toFixed(1)+'px');}
    /* viaggio: il video avanza con lo scroll, fotogramma per fotogramma */
    if(viaggio&&tela){var pv=Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));vt+=(pv-vt)*.14;disegna(vt);
      var k=0;vtxt.forEach(function(l,i){if(vt>=+l.dataset.t-0.045)k=i;});vtxt.forEach(function(l,i){l.classList.toggle('su',i===k);});
      if(vbar)vbar.style.setProperty('--p',pv.toFixed(3));}
    /* processo: passo attivo in base allo scroll */
    if(proc){var pp=prog(proc),n=Math.min(passi.length-1,Math.floor(pp*passi.length*0.999));
      if(n!==attuale){attuale=n;passi.forEach(function(l,i){l.classList.toggle('attivo',i===n);});foto.forEach(function(f,i){f.classList.toggle('attiva',i===n);});if(vpasso)vpasso.textContent='0'+(n+1);}
      if(vetro)vetro.style.setProperty('--p',pp.toFixed(3));}
    /* nera: oggetto che ruota e righe che si accendono */
    if(nera){var pn=prog(nera);ruota.style.setProperty('--rr',(pn*140-20).toFixed(1)+'deg');ruota.style.setProperty('--rs',(.85+pn*.3).toFixed(3));ruota.style.setProperty('--ry',((pn-.5)*-80).toFixed(1)+'px');
      righe.forEach(function(r,i){r.classList.toggle('su',pn>.15+i*.22);});}
    if(chiara&&barra){var rc=chiara.getBoundingClientRect();barra.classList.toggle('su-chiaro',rc.top<40&&rc.bottom>40);}
    requestAnimationFrame(giro);
  }
  if(ridotto){passi.forEach(function(l){l.classList.add('attivo');});righe.forEach(function(r){r.classList.add('su');});}
  else requestAnimationFrame(giro);

  /* entrate allo scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visto');io.unobserve(e.target);}});},{threshold:.15});
  document.querySelectorAll('.entra').forEach(function(el,i){el.style.transitionDelay=(i%3*0.08)+'s';io.observe(el);});
})();
