/* riquadro di Education / Research / Projects in home: al posto del segnaposto parte il video della sezione (Mattia 26/11).
   Si aggancia al testo del riquadro, che cambia sia al passaggio del mouse sia nel giro automatico da telefono. */
(function(){
  var vis=document.querySelector('.arte-vis'),et=vis&&vis.querySelector('span');if(!vis||!et)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var mappa={};
  document.querySelectorAll('.arte-porte .voce').forEach(function(a){
    var n=(a.querySelector('.parola').textContent||'').trim().toLowerCase();
    var v=document.createElement('video');
    v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.preload='none';
    v.poster='video/sezioni/'+n+'.jpg';
    v.innerHTML='<source src="video/sezioni/'+n+'.webm" type="video/webm"><source src="video/sezioni/'+n+'.mp4" type="video/mp4">';
    vis.insertBefore(v,et);mappa[a.dataset.vis]=v;
  });
  vis.classList.add('con-video');
  function mostra(){
    var scelto=mappa[et.textContent];
    Object.keys(mappa).forEach(function(k){var v=mappa[k];
      if(v===scelto){v.classList.add('on');var p=v.play();if(p&&p.catch)p.catch(function(){});}
      else{v.classList.remove('on');setTimeout(function(){if(!v.classList.contains('on'))v.pause();},500);}
    });
  }
  new MutationObserver(mostra).observe(et,{childList:true,characterData:true,subtree:true});
  /* precarica i video quando la pagina è pronta, così al primo passaggio partono subito */
  addEventListener('load',function(){setTimeout(function(){Object.keys(mappa).forEach(function(k){mappa[k].preload='auto';mappa[k].load();});},1200);});
})();
