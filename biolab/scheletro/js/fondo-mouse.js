/* Emi BioLab: macchia rosa che segue il mouse, più grande se ti muovi veloce (come itscraft.com) */
(function(){
  var f=document.querySelector('.fondo-mouse');if(!f)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var rosa=f.querySelector('.rosa'),W=innerWidth,H=innerHeight;
  var tx=W*.62,ty=H*.45,x=tx,y=ty,vel=0,r=140,toccato=0,t0=performance.now(),ultimo={x:tx,y:ty,t:t0};
  var touch=matchMedia('(hover: none)').matches;
  addEventListener('resize',function(){W=innerWidth;H=innerHeight;});
  addEventListener('pointermove',function(e){
    var t=performance.now(),dt=Math.max(16,t-ultimo.t),d=Math.hypot(e.clientX-ultimo.x,e.clientY-ultimo.y);
    vel=Math.max(vel,d/dt*1000);ultimo={x:e.clientX,y:e.clientY,t:t};tx=e.clientX;ty=e.clientY;toccato=t;
  },{passive:true});
  function giro(t){
    if(touch&&t-toccato>2500){var s=(t-t0)/1000;tx=W*(.55+.3*Math.sin(s*.31));ty=H*(.45+.28*Math.sin(s*.23+1.3));}
    x+=(tx-x)*.09;y+=(ty-y)*.09;
    vel*=.92;var v=Math.min(vel/1000,1);v=v*v*(3-2*v);
    var meta=(Math.min(W,H)*.16)*(1+v*2);r+=(meta-r)*.08;
    rosa.style.setProperty('--mx',x.toFixed(1)+'px');rosa.style.setProperty('--my',y.toFixed(1)+'px');rosa.style.setProperty('--r',r.toFixed(1)+'px');
    requestAnimationFrame(giro);
  }
  requestAnimationFrame(giro);
})();
