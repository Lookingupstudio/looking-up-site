/* Emi BioLab · sfondo "laguna" (25/11/2026)
   Acqua scura con riflessi lenti nei colori della palette; il mouse è un sasso:
   dove passa apre cerchi d'acqua, il clic lancia un sasso più grande.
   WebGL leggero, a mezza risoluzione. Senza WebGL o con "riduci movimento": gradiente fermo. */
(function () {
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.createElement('canvas');
  cv.className = 'laguna';
  cv.setAttribute('aria-hidden', 'true');
  // stile scritto qui: lo sfondo resta dietro a tutto anche se il CSS non è ancora aggiornato
  Object.assign(cv.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '-1', display: 'block', pointerEvents: 'none' });
  document.documentElement.style.background = '#202326';
  document.body.style.background = 'transparent';
  document.body.prepend(cv);
  const gl = !ridotto && cv.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) { cv.classList.add('ferma'); return; }

  const MAX = 12;
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;
uniform vec2 ris;uniform float t;uniform vec4 gocce[${MAX}];uniform vec2 topo;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/ris; vec2 q=uv; q.x*=ris.x/ris.y;
  /* cerchi d'acqua dai sassi */
  vec2 spinta=vec2(0.); float luce=0.;
  for(int i=0;i<${MAX};i++){
    vec4 g=gocce[i]; float eta=t-g.z; if(g.w<=0.||eta<0.||eta>6.) continue;
    vec2 c=g.xy; c.x*=ris.x/ris.y; vec2 d=q-c; float r=length(d);
    float fronte=eta*.22; float onda=sin((r-fronte)*90.)*exp(-abs(r-fronte)*12.)*exp(-eta*.75)*g.w;
    spinta+=normalize(d+1e-4)*onda*.012; luce+=onda;
  }
  /* superficie lagunare: correnti lente */
  vec2 p=q*1.6+spinta*6.;
  float a=fbm(p+vec2(t*.018,-t*.011));
  float b=fbm(p*1.7-vec2(t*.013,t*.02)+a*1.4);
  float riflesso=smoothstep(.55,.95,b);
  vec3 laguna=vec3(.125,.137,.149);          /* Lagoon black #202326 */
  vec3 petrolio=vec3(.17,.25,.27);
  vec3 seaglass=vec3(.718,.776,.765);        /* #B7C6C3 */
  vec3 lilla=vec3(.659,.631,.733);           /* #A8A1BB */
  vec3 col=mix(laguna,petrolio,smoothstep(.25,.8,a)*.55+uv.y*.12);
  col+=seaglass*riflesso*.085;
  col+=lilla*smoothstep(.7,1.,fbm(p*2.4+t*.01))*.05;
  col+=mix(seaglass,lilla,.4)*clamp(luce,-.4,1.)*.10;
  /* il mouse sfiora l'acqua: un alone appena più chiaro */
  vec2 m=topo; m.x*=ris.x/ris.y; col+=seaglass*.025*exp(-length(q-m)*5.);
  gl_FragColor=vec4(col,1.);
}`;
  function sh(tipo, src) { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.classList.add('ferma'); return; }
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRis = gl.getUniformLocation(pr, 'ris'), uT = gl.getUniformLocation(pr, 't'),
        uG = gl.getUniformLocation(pr, 'gocce'), uTopo = gl.getUniformLocation(pr, 'topo');

  const scala = 0.5;
  function misura() { cv.width = Math.max(1, innerWidth * scala); cv.height = Math.max(1, innerHeight * scala); gl.viewport(0, 0, cv.width, cv.height); }
  addEventListener('resize', misura); misura();

  const gocce = new Float32Array(MAX * 4); let prossima = 0; const t0 = performance.now();
  const ora = () => (performance.now() - t0) / 1000;
  function sasso(x, y, forza) {
    gocce.set([x / innerWidth, 1 - y / innerHeight, ora(), forza], prossima * 4);
    prossima = (prossima + 1) % MAX;
  }
  let topo = [.5, .5], ultima = 0, lx = 0, ly = 0;
  addEventListener('pointermove', e => {
    topo = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
    const adesso = performance.now(), dist = Math.hypot(e.clientX - lx, e.clientY - ly);
    if (adesso - ultima > 140 && dist > 30) { sasso(e.clientX, e.clientY, .45); ultima = adesso; lx = e.clientX; ly = e.clientY; }
  }, { passive: true });
  addEventListener('pointerdown', e => sasso(e.clientX, e.clientY, 1.4), { passive: true });
  setTimeout(() => sasso(innerWidth * .72, innerHeight * .4, 1), 900); // un primo sasso all'arrivo

  let visibile = true;
  document.addEventListener('visibilitychange', () => { visibile = !document.hidden; if (visibile) requestAnimationFrame(giro); });
  function giro() {
    if (!visibile) return;
    gl.uniform2f(uRis, cv.width, cv.height); gl.uniform1f(uT, ora());
    gl.uniform4fv(uG, gocce); gl.uniform2f(uTopo, topo[0], topo[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(giro);
  }
  requestAnimationFrame(giro);
})();
