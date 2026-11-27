/* Bottone scuro/chiaro: ricorda la scelta navigando tra le pagine (sessione). ?modo=chiaro|scuro per i link di prova. */
(function(){
  var h=document.documentElement;
  function leggi(){try{return sessionStorage.getItem('emi-modo');}catch(e){return null;}}
  function salva(v){try{sessionStorage.setItem('emi-modo',v);}catch(e){}}
  var q=location.search.match(/modo=(chiaro|scuro)/);if(q)salva(q[1]);
  if(leggi()==='chiaro')h.classList.add('modo-chiaro');
  function bottone(){
    if(document.querySelector('.cambia-modo'))return;
    var b=document.createElement('button');b.type='button';b.className='cambia-modo';
    b.setAttribute('aria-label','Switch light / dark');b.title='Light / dark';
    b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>';
    b.addEventListener('click',function(){var c=!h.classList.contains('modo-chiaro');h.classList.toggle('modo-chiaro',c);salva(c?'chiaro':'scuro');});
    document.body.appendChild(b);
  }
  if(document.body)bottone();else document.addEventListener('DOMContentLoaded',bottone);
})();
