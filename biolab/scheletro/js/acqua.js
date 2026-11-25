/* Emi BioLab · sfondo "acqua" (25/11/2026)
   Come guardare la laguna dall'alto: fondo profondo blu-verde e, sopra,
   la luce che passa dalla superficie e disegna reti morbide (caustiche) che si muovono piano.
   Niente particelle, niente onde finte: solo luce nell'acqua. Se WebGL manca resta il colore di fondo. */
(function () {
  const FONDO = '#14202a';
  document.documentElement.style.background = FONDO;
  document.body.style.background = 'transparent';
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  Object.assign(cv.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '-1', pointerEvents: 'none', display: 'block' });
  document.body.prepend(cv);
  const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) return;

  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;
uniform vec2 R;uniform float T;uniform float S;
/* caustiche: somma di onde che si piegano l'una sull'altra */
float caustica(vec2 uv,float t){
  vec2 p=mod(uv*6.2831,6.2831)-250.;vec2 i=p;float c=1.;float k=.005;
  for(int n=0;n<4;n++){
    float tt=t*(1.-(3.5/float(n+1)));
    i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));
    c+=1./length(vec2(p.x/(sin(i.x+tt)/k),p.y/(cos(i.y+tt)/k)));
  }
  c/=4.;c=1.17-pow(c,1.4);return pow(abs(c),8.);
}
void main(){
  vec2 uv=gl_FragCoord.xy/R.y;
  uv.y+=S*.15;                                   /* lo scroll sposta appena l'acqua */
  float t=T*.06;
  /* due strati di luce a scale diverse, il secondo più lento e più largo */
  float l=caustica(uv*1.25+vec2(t*.05,t*.03),t)*.65+caustica(uv*.8-vec2(t*.02,0.),t*.7)*.45;
  /* profondità: più chiaro in alto (superficie), più scuro in basso */
  float prof=gl_FragCoord.y/R.y;
  vec3 fondo=mix(vec3(.04,.085,.11),vec3(.07,.17,.2),prof);
  vec3 luce=mix(vec3(.55,.72,.74),vec3(.66,.64,.74),.5+.5*sin(uv.x*1.3+t*.4)); /* sea glass che vira al lilla */
  vec3 c=fondo+luce*l*(.22+.22*prof);
  /* vignetta morbida */
  vec2 q=gl_FragCoord.xy/R-.5;c*=1.-dot(q,q)*.55;
  gl_FragColor=vec4(c,1.);
}`;
  function sh(t, s) { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const ap = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uS = gl.getUniformLocation(pr, 'S');

  const D = Math.min(1, devicePixelRatio || 1) * .75;            // risoluzione ridotta: è sfumato, non serve di più
  function size() { cv.width = innerWidth * D; cv.height = innerHeight * D; gl.viewport(0, 0, cv.width, cv.height); }
  size(); addEventListener('resize', size);

  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let s = 0;
  function giro(ms) {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0; s += (p - s) * .06;
    gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, ridotto ? 40 : 40 + ms / 1000); gl.uniform1f(uS, s);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!ridotto) requestAnimationFrame(giro);
  }
  requestAnimationFrame(giro);
  if (ridotto) addEventListener('scroll', () => requestAnimationFrame(giro), { passive: true });
})();
