/* Fallback per i browser senza transizioni native tra pagine */
(function(){
  if('onpagereveal' in window||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.documentElement.classList.add('vt-fallback');
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');
    if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey)return;
    var h=a.getAttribute('href')||'';
    if(!h||h[0]==='#'||/^(https?:|mailto:|tel:)/.test(h))return;
    e.preventDefault();document.documentElement.classList.add('vt-esce');
    setTimeout(function(){location.href=a.href;},320);
  });
  addEventListener('pageshow',function(){document.documentElement.classList.remove('vt-esce');});
})();
