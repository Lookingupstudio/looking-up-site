/* Variante palette chiara (prova 26/11, solo home): bottone con icona per passare chiaro/scuro dal vivo.
   Anche ?palette=chiara / ?palette=scura. La scelta resta per la sessione. */
(function(){
  var nomi=['tema-test3.css','arte.css','palette.css','intro.css','animazioni.css'];
  function leggi(){try{return sessionStorage.getItem('emi-palette');}catch(e){return null;}}
  function salva(v){try{sessionStorage.setItem('emi-palette',v);}catch(e){}}
  function applica(v){
    var chiara=v==='chiara';document.documentElement.classList.toggle('palette-chiara',chiara);
    [].forEach.call(document.querySelectorAll('link[rel=stylesheet]'),function(l){
      var h=l.getAttribute('href'),base=h.replace(/^css\/chiara\//,'css/');
      nomi.forEach(function(n){if(base.indexOf('css/'+n)===0)l.setAttribute('href',chiara?'css/chiara/'+base.slice(4):base);});
    });
  }
  var q=location.search.match(/palette=(chiara|scura)/);if(q)salva(q[1]);
  var v=leggi()||'scura';if(v==='chiara')applica(v);
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.createElement('button');b.type='button';b.className='cambia-palette';
    b.setAttribute('aria-label','Switch colour palette');b.title='Light / dark';
    b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>';
    b.addEventListener('click',function(){v=(leggi()||'scura')==='chiara'?'scura':'chiara';salva(v);applica(v);});
    var dx=document.querySelector('.arte-piede .piede-dx');if(dx&&matchMedia('(max-width: 760px)').matches){b.classList.add('nel-piede');dx.appendChild(b);}else document.body.appendChild(b);
  });
})();
