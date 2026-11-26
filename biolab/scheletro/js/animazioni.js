/* Emi BioLab home: parole a lettere + sipario dopo il caricamento iniziale */
(function(){
  document.querySelectorAll('.arte-porte .parola').forEach(function(p){
    var t=p.textContent;p.setAttribute('aria-label',t);
    p.innerHTML='<span class="riga" aria-hidden="true">'+t.split('').map(function(c,i){return '<span class="lettera" style="--i:'+i+'">'+c+'</span>';}).join('')+'</span>';
  });
  var h=document.documentElement;
  function su(){requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('sipario-su');});});}
  if(!h.classList.contains('con-intro')){su();return;}
  var o=new MutationObserver(function(){if(!h.classList.contains('con-intro')){o.disconnect();setTimeout(su,250);}});
  o.observe(h,{attributes:true,attributeFilter:['class']});
})();
