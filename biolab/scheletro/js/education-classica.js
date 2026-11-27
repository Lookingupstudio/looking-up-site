/* Education: foto d'apertura che si posa, percorso dell'approccio che si accende una tappa alla volta quando entra nello schermo */
(function(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.add('edc-pronto');});});
  var p=document.querySelector('.percorso');if(!p)return;
  var tappe=[].slice.call(p.querySelectorAll('span'));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){tappe.forEach(function(t){t.classList.add('su');});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.disconnect();
    tappe.forEach(function(t,i){setTimeout(function(){t.classList.add('su');},300+i*650);});});},{threshold:.6});
  io.observe(p);
})();
