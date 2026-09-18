/* =====================================================================
   FC DISHWASHER — Hero: "Liquid Chrome" WebGL shader
   Procedural flowing metal surface, reacts to pointer and scroll.
   Falls back silently (canvas removed) when WebGL is unavailable.
   ===================================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.remove(); return; }

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' })
          || canvas.getContext('experimental-webgl');
  if (!gl) { canvas.remove(); return; }

  const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';
  const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uScroll;
uniform float uOct;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float surface(vec2 p){
  float t=uTime*0.09;
  vec2 q=p+0.38*vec2(snoise(vec3(p*0.65,t)),snoise(vec3(p*0.65+vec2(5.2,1.3),t+3.0)));
  float h=0.0;
  h+=0.55*snoise(vec3(q*1.15,t*1.3));
  h+=0.27*snoise(vec3(q*2.4+vec2(1.7,9.2),t*1.7));
  if(uOct>2.5){h+=0.11*snoise(vec3(q*4.9-vec2(3.1,2.4),t*2.2));}
  float d=length(p-uMouse);
  h+=uMouseStrength*0.2*sin(d*20.0-uTime*4.5)*exp(-d*2.6);
  return h;
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/uRes.y;
  vec2 p=(uv-0.5)*vec2(aspect,1.0)*1.7;
  p.y+=uScroll*0.45;
  float e=0.006;
  float h=surface(p);
  float hx=surface(p+vec2(e,0.0));
  float hy=surface(p+vec2(0.0,e));
  vec3 n=normalize(vec3(-(hx-h)/e*0.32,-(hy-h)/e*0.32,1.0));
  vec3 V=vec3(0.0,0.0,1.0);
  vec3 R=reflect(-V,n);
  float y=R.y;
  float env=0.05;
  env+=0.5*smoothstep(-0.4,0.5,y);
  env+=0.95*exp(-pow((y-0.1)*6.5,2.0));
  env-=0.22*exp(-pow((y+0.22)*6.0,2.0));
  env+=0.18*exp(-pow((R.x-0.55)*3.5,2.0));
  env=clamp(env,0.0,1.7);
  vec3 col=vec3(env)*vec3(0.8,0.89,1.0);
  vec3 L=normalize(vec3(0.35,0.75,0.6));
  float spec=pow(max(dot(reflect(-L,n),V),0.0),52.0);
  col+=vec3(0.55,0.95,1.0)*spec*0.9;
  float fres=pow(1.0-max(dot(n,V),0.0),3.0);
  col+=vec3(0.36,0.94,1.0)*fres*0.5;
  col*=0.58;
  float vig=smoothstep(1.35,0.3,length((uv-0.5)*vec2(1.25,1.0))*1.5);
  col*=mix(0.3,1.0,vig);
  col=pow(col,vec3(0.92));
  gl_FragColor=vec4(col,1.0);
}`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[hero-shader]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  let program, uRes, uTime, uMouse, uMouseStrength, uScroll, uOct, raf = 0, running = false, visible = true, lost = false;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, strength: 0 };
  let scrollN = 0;
  const start = performance.now();

  function init() {
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.remove(); return false; }
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.remove(); return false; }
    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(program, 'a');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    uRes = gl.getUniformLocation(program, 'uRes');
    uTime = gl.getUniformLocation(program, 'uTime');
    uMouse = gl.getUniformLocation(program, 'uMouse');
    uMouseStrength = gl.getUniformLocation(program, 'uMouseStrength');
    uScroll = gl.getUniformLocation(program, 'uScroll');
    uOct = gl.getUniformLocation(program, 'uOct');
    resize();
    return true;
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    /* Render at reduced resolution: the soft upscale suits the liquid look and keeps GPUs cool */
    const small = w < 768;
    let scale = Math.min(window.devicePixelRatio || 1, 2) * (small ? 0.4 : 0.5);
    const maxPixels = touch ? 420000 : 1100000;
    if (w * h * scale * scale > maxPixels) scale = Math.sqrt(maxPixels / (w * h));
    canvas.width = Math.max(2, Math.round(w * scale));
    canvas.height = Math.max(2, Math.round(h * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function frame(now) {
    raf = 0;
    if (!running || lost) return;
    const t = (now - start) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    mouse.strength *= 0.965;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uMouseStrength, mouse.strength);
    gl.uniform1f(uScroll, scrollN);
    gl.uniform1f(uOct, touch ? 2.0 : 3.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (running || lost) return;
    running = true;
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function pause() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  function onPointer(e) {
    const r = canvas.getBoundingClientRect();
    const aspect = r.width / r.height;
    mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * aspect * 1.7;
    mouse.ty = (0.5 - (e.clientY - r.top) / r.height) * 1.7;
    mouse.strength = Math.min(1, mouse.strength + 0.12);
  }

  if (!init()) return;

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  if (touch) {
    const onTouch = (e) => { const t = e.touches && e.touches[0]; if (t) onPointer(t); };
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
  }
  window.addEventListener('scroll', () => {
    const vh = window.innerHeight || 1;
    scrollN = Math.min(1.5, Math.max(0, window.scrollY / vh));
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !document.hidden) play(); else pause();
    }, { threshold: 0.01 }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else if (visible) play(); });

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; pause(); }, false);
  canvas.addEventListener('webglcontextrestored', () => { lost = false; if (init()) play(); }, false);

  play();
  /* Fade the canvas in once the first frame has been drawn */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    canvas.style.transition = 'opacity 1.8s ease';
    canvas.style.opacity = '1';
  }));

  window.FCDHero = { play, pause };
})();
