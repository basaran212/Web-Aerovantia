// Portada animada, tarjetas, antes/después, calculadoras y formulario.
(function(){
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const eur = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Math.round(n/10)*10);
const eurK = n => n>=100000 ? (Math.round(n/1000)).toLocaleString('es-ES')+'.000 €' : eur(Math.round(n/100)*100);
const num = (n,d=1) => n.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function mix(c1,c2,t){const a=parseInt(c1.slice(1),16),b=parseInt(c2.slice(1),16);
  const r=Math.round(lerp(a>>16,b>>16,t)),g=Math.round(lerp((a>>8)&255,(b>>8)&255,t)),bl=Math.round(lerp(a&255,b&255,t));
  return 'rgb('+r+','+g+','+bl+')';}
function shade(hex,f){const a=parseInt(hex.slice(1),16);const r=clamp((a>>16)*f,0,255),g=clamp(((a>>8)&255)*f,0,255),b=clamp((a&255)*f,0,255);return 'rgb('+(r|0)+','+(g|0)+','+(b|0)+')';}
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}

/* Bucle de animación compartido, solo para lo que está en pantalla */
const scenes=[];
const vis=new IntersectionObserver(es=>es.forEach(e=>{const s=scenes.find(x=>x.el===e.target);if(s)s.on=e.isIntersecting}),{rootMargin:'100px'});
function addScene(el,draw){const s={el,draw,on:true};scenes.push(s);vis.observe(el);return s}
function fit(c){const dpr=Math.min(2,devicePixelRatio||1);const w=c.clientWidth,h=c.clientHeight;if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr)}const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return [x,w,h]}
let t0=performance.now();
function loop(now){const t=RM?0:(now-t0)/1000;scenes.forEach(s=>{if(s.on)s.draw(t)});requestAnimationFrame(loop)}

/* ===== VILLA ISOMÉTRICA (dibujo parametrizable: hora del día + cámara) ===== */
const SKY={night:['#07111C','#16263A'],dawn:['#3B4E78','#F0A167'],day:['#5FA9DA','#CFE7F3'],dusk:['#2C3460','#E57B4C']};
const STARS=[];(function(){const R=rng(7);for(let i=0;i<120;i++)STARS.push([R(),R()*.6,R()*1.2+.3,R()*6])})();
function skyAt(e,rising){
  if(e>0.25)return SKY.day;const s=rising?SKY.dawn:SKY.dusk;
  if(e>-0.05){const k=(e+0.05)/0.3;return [mix(s[0],SKY.day[0],k),mix(s[1],SKY.day[1],k)]}
  if(e>-0.3){const k=(e+0.3)/0.25;return [mix(SKY.night[0],s[0],k),mix(SKY.night[1],s[1],k)]}
  return SKY.night;
}
// cam = {z: zoom, fx,fy,fz: punto enfocado, ax,ay: posición en pantalla 0..1, heat: 0..1 flujo de calor al suelo}
function renderVilla(x,W,H,t,ph,cam){
  const e=Math.sin(ph*2*Math.PI), rising=ph<0.25||ph>0.75, day=clamp((e+0.15)/0.45,0,1), night=1-day;
  const sk=skyAt(e,rising);const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,sk[0]);g.addColorStop(1,sk[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
  if(night>0.05){STARS.forEach(s=>{x.globalAlpha=night*(0.5+0.5*Math.sin(t*s[2]+s[3]))*0.9;x.fillStyle='#fff';x.fillRect(s[0]*W,s[1]*H,1.4,1.4)});x.globalAlpha=1}
  const cx0=W*0.6, arcR=Math.min(W,H)*0.55, sa=Math.PI-ph*2*Math.PI;
  const sx=cx0+Math.cos(sa)*arcR*1.1, sy=H*0.8-Math.sin(ph*2*Math.PI)*arcR*0.95;
  if(e>-0.15){const sg=x.createRadialGradient(sx,sy,0,sx,sy,90);sg.addColorStop(0,'rgba(255,236,190,'+(0.9*clamp(e+0.3,0,1))+')');sg.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=sg;x.beginPath();x.arc(sx,sy,90,0,7);x.fill();x.fillStyle='#FFF4D6';x.beginPath();x.arc(sx,sy,14,0,7);x.fill()}
  const ma=sa+Math.PI,mx=cx0+Math.cos(ma)*arcR*1.1,my=H*0.8+Math.sin(ph*2*Math.PI)*arcR*0.95;
  if(e<0.15){x.globalAlpha=clamp(-e+0.2,0,1);x.fillStyle='#E9EEF5';x.beginPath();x.arc(mx,my,11,0,7);x.fill();x.fillStyle=sk[0];x.beginPath();x.arc(mx+5,my-3,10,0,7);x.fill();x.globalAlpha=1}
  const mobile=W<760;
  const S=(mobile?Math.min(W/27,H/30):Math.min(W/44,H/25))*cam.z;
  const ox=cam.ax*W-(cam.fx-cam.fy)*0.866*S, oy=cam.ay*H-((cam.fx+cam.fy)*0.5*S-cam.fz*S);
  const P=(X,Y,Z)=>[ox+(X-Y)*0.866*S, oy+(X+Y)*0.5*S-Z*S];
  const poly=(pts,fill)=>{x.beginPath();pts.forEach((p,i)=>{const q=P(...p);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.closePath();x.fillStyle=fill;x.fill()};
  const az=ph*2*Math.PI,lx=Math.cos(az),amb=0.42+0.58*day;
  const fTop=amb*(0.92+0.08*day),fL=amb*(0.78+0.14*clamp(-lx,0,1)*day),fR=amb*(0.70+0.22*clamp(lx,0,1)*day);
  function box(x0,y0,z0,x1,y1,z1,col,topCol){
    poly([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],shade(col,fL));
    poly([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],shade(col,fR));
    poly([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],shade(topCol||col,fTop));
  }
  function winY(y,xa,xb,za,zb){const glow=night*0.95;const col=glow>0.3?mix('#2A3B48','#FFC56E',glow):mix('#2A3B48','#9FC3D6',day*0.6);
    if(glow>0.3){x.shadowColor='rgba(255,190,100,.8)';x.shadowBlur=24*glow}poly([[xa,y+.01,za],[xb,y+.01,za],[xb,y+.01,zb],[xa,y+.01,zb]],col);x.shadowBlur=0;
    if(day>0.3){x.globalAlpha=0.25*day;poly([[xa,y+.02,lerp(za,zb,.55)],[lerp(xa,xb,.35),y+.02,zb],[lerp(xa,xb,.5),y+.02,zb],[xa,y+.02,lerp(za,zb,.3)]],'#ffffff');x.globalAlpha=1}
    x.strokeStyle='rgba(20,28,34,.55)';x.lineWidth=1;const n=Math.max(1,Math.round((xb-xa)/1.6));for(let i=1;i<n;i++){const xx=lerp(xa,xb,i/n);const a=P(xx,y+.02,za),b=P(xx,y+.02,zb);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}}
  function winX(X,ya,yb,za,zb){const glow=night*0.95;const col=glow>0.3?mix('#24343F','#FFB85C',glow):mix('#24343F','#8DB4C9',day*0.5);
    if(glow>0.3){x.shadowColor='rgba(255,190,100,.8)';x.shadowBlur=20*glow}poly([[X+.01,ya,za],[X+.01,yb,za],[X+.01,yb,zb],[X+.01,ya,zb]],col);x.shadowBlur=0}
  function tree(X,Y,h,r){const b=P(X,Y,0),top=P(X,Y,h);x.strokeStyle=shade('#5A4632',amb);x.lineWidth=S*0.18;x.beginPath();x.moveTo(b[0],b[1]);x.lineTo(top[0],top[1]+r*S*0.4);x.stroke();
    x.fillStyle=shade('#3E6B45',amb);x.beginPath();x.ellipse(top[0],top[1],r*S,r*S*1.25,0,0,7);x.fill();x.fillStyle=shade('#4F8456',amb);x.beginPath();x.ellipse(top[0]+r*S*0.25,top[1]-r*S*0.3,r*S*0.6,r*S*0.75,0,0,7);x.fill()}
  poly([[-6,-6,0],[30,-6,0],[30,22,0],[-6,22,0]],shade('#5E7F52',0.35+0.65*day));
  poly([[2,2,0],[20,2,0],[20,13.5,0],[2,13.5,0]],shade('#7C9A63',0.35+0.65*day));
  poly([[3,9,0.02],[17,9,0.02],[17,13,0.02],[3,13,0.02]],shade('#C9BBA3',0.4+0.6*day));
  // suelo radiante visible en la terraza/planta (efecto rayos X)
  if(cam.heat>0.01){x.save();x.globalAlpha=cam.heat*0.85;x.strokeStyle='#FF8A3D';x.lineWidth=Math.max(1.5,S*0.08);x.shadowColor='rgba(255,140,60,.9)';x.shadowBlur=10;
    x.beginPath();for(let i=0;i<7;i++){const Y=3.5+i*0.8;const a=P(3.5,Y,0.05),b=P(14.5,Y,0.05);if(i%2){x.lineTo(b[0],b[1]);x.lineTo(a[0],a[1])}else{x.lineTo(a[0],a[1]);x.lineTo(b[0],b[1])}}x.stroke();x.restore()}
  poly([[4.5,10,0.03],[13,10,0.03],[13,12.3,0.03],[4.5,12.3,0.03]],night>0.5?mix('#1B5D7A','#3FB6D9',night*0.8):mix('#2C7FA3','#59C2E0',day));
  x.save();x.globalAlpha=0.35;x.strokeStyle='#E8FAFF';x.lineWidth=1.2;
  for(let i=0;i<5;i++){x.beginPath();for(let k=0;k<=20;k++){const X=4.7+k*0.41,Y=10.3+i*0.45+Math.sin(t*1.6+k*0.7+i)*0.08;const q=P(X,Y,0.04);k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke()}x.restore();
  tree(3,2.5,4.5,1.3);tree(19,2.5,5,1.5);tree(1.5,6,3.8,1.1);
  x.globalAlpha=1-cam.heat*0.55;box(3,3,0,15,9,3.2,'#ECE7DD');x.globalAlpha=1;
  winY(9,4,12.5,0.25,2.9);winX(15,4,8.2,0.4,2.7);
  box(16.6,8,0,16.9,8.3,3.2,'#3A3F44');
  box(6,3.6,3.2,17,8.4,6.2,'#2E3338','#3B4045');
  winY(8.4,7,16,3.7,5.8);winX(17,4.6,7.8,3.7,5.8);
  x.strokeStyle=shade('#B0814F',amb);x.lineWidth=2;
  for(let i=0;i<6;i++){const X=6.3+i*0.12;const a=P(X,8.41,3.3),b=P(X,8.41,6.1);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}
  const glintX=((t*0.08)%1.3)*12;
  for(let r=0;r<2;r++)for(let k=0;k<6;k++){const X0=7+k*1.6,Y0=4.2+r*2.1;const pts=[[X0,Y0,6.25],[X0+1.45,Y0,6.25],[X0+1.45,Y0+1.6,6.75],[X0,Y0+1.6,6.75]];
    const near=Math.max(0,1-Math.abs((X0-7)-glintX)/2.2)*day;poly(pts,mix(shade('#1B2C4A',0.5+0.5*day),'#BFD9FF',near*0.7));
    x.strokeStyle='rgba(200,215,235,.35)';x.lineWidth=.7;x.beginPath();pts.forEach((p,i)=>{const q=P(...p);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.closePath();x.stroke()}
  if(day>0.2){x.fillStyle='rgba(255,214,102,'+day+')';for(let i=0;i<10;i++){const u=((t*0.35+i/10)%1);let X,Y,Z;if(u<0.5){X=lerp(12,17.2,u*2);Y=8.6;Z=6.4}else{X=17.2;Y=8.6;Z=lerp(6.4,1.2,(u-0.5)*2)}const q=P(X,Y,Z);x.beginPath();x.arc(q[0],q[1],Math.max(2.2,S*0.09),0,7);x.fill()}}
  box(17.4,9.3,0,19.2,10,1.3,'#E9ECEE');
  const fc=P(18.3,10.01,0.65);x.save();x.translate(fc[0],fc[1]);x.fillStyle='#1C2227';x.beginPath();x.ellipse(0,0,S*0.62,S*0.5,-0.52,0,7);x.fill();
  const rot=t*9;x.strokeStyle='#8A949B';x.lineWidth=Math.max(2,S*0.06);for(let i=0;i<4;i++){const a=rot+i*Math.PI/2;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a)*S*0.55,Math.sin(a)*S*0.42);x.stroke()}x.restore();
  // calor: de la bomba al suelo de la casa
  if(cam.heat>0.01){x.fillStyle='rgba(255,140,60,'+cam.heat+')';for(let i=0;i<14;i++){const u=((t*0.3+i/14)%1);let X,Y;if(u<0.35){X=lerp(17.6,15,u/0.35);Y=9.4}else{X=lerp(15,4,(u-0.35)/0.65);Y=lerp(9.4,4.5,(u-0.35)/0.65)}const q=P(X,Y,0.1);x.beginPath();x.arc(q[0],q[1],Math.max(2,S*0.08),0,7);x.fill()}}
  x.save();x.strokeStyle=night>0.5?'rgba(255,170,90,.45)':'rgba(120,190,230,.45)';x.lineWidth=1.5;
  for(let i=0;i<3;i++){const u=((t*0.5+i/3)%1);x.globalAlpha=1-u;x.beginPath();for(let k=0;k<10;k++){const q=P(18.3+Math.sin(k*0.9+t*3)*0.12,10.2+u*2+k*0.05,0.6+k*0.1);k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke()}x.restore();
  box(19.6,4,0,19.8,4.25,1.3,'#2E3338');
  const led=P(19.81,4.12,1.05);x.fillStyle=(Math.sin(t*3)>0)?'#5DBB8E':'#2F7D5B';x.beginPath();x.arc(led[0],led[1],Math.max(2.2,S*0.08),0,7);x.fill();
  box(20.2,4.5,0,23,6.2,0.9,'#7E8C94');box(20.8,4.7,0.9,22.4,6,1.5,'#6A7880');
  if(night>0.4){x.strokeStyle='rgba(93,187,142,'+night+')';x.lineWidth=2;x.setLineDash([4,6]);x.lineDashOffset=-t*20;const a=P(19.8,4.2,1),b=P(20.2,5.2,0.7);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.setLineDash([])}
  tree(21.5,11.5,4,1.2);tree(2.4,12.5,3.5,1);
  if(night>0){x.fillStyle='rgba(5,12,24,'+(night*0.25)+')';x.fillRect(0,0,W,H)}
  return e;
}

/* ===== PELÍCULA CONTROLADA POR SCROLL ===== */
(function(){
  const film=$('film'),c=$('filmc');let target=0,cur=0;
  const caps=[...film.querySelectorAll('.cap')];
  function onScroll(){const r=film.getBoundingClientRect();target=clamp(-r.top/(film.offsetHeight-innerHeight),0,1)}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
  const sm=v=>v*v*(3-2*v);
  // fotogramas clave: p, hora(ph), zoom, foco x,y,z, ancla x, calor
  const K=[[0,.01,1,11,8,2,.62,0],[.10,.035,1,11,8,2,.6,0],[.22,.06,1.05,11,8,2,.56,0],[.34,.25,2.1,12,6.3,6.5,.5,0],[.42,.28,2.4,12,6.3,6.5,.5,0],[.50,.37,2.2,16,9.6,1,.5,.4],[.56,.39,1.5,11,8,1,.5,1],[.62,.45,1.5,11,8,1,.5,1],[.80,.52,1.15,11,8,2,.5,0],[.86,.64,1.05,13,8,2,.5,0],[1,.69,1,12,8,2,.5,0]];
  function camAt(p){let i=0;while(i<K.length-2&&p>K[i+1][0])i++;const a=K[i],b=K[i+1];const k=sm(clamp((p-a[0])/(b[0]-a[0]),0,1));const v=a.map((n,j)=>lerp(n,b[j],k));
    return {ph:v[1],cam:{z:v[2],fx:v[3],fy:v[4],fz:v[5],ax:v[6],ay:.56,heat:v[7]}}}
  addScene(c,t=>{
    cur=RM?target:cur+(target-cur)*0.1;const p=cur;
    const [x,W,H]=fit(c);const mob=W<760;
    const {ph,cam}=camAt(p);if(mob){cam.ax=.5;cam.ay=.42}
    const e=renderVilla(x,W,H,t,ph,cam);
    // interior: fundido 0.56-0.62, salida 0.78-0.84
    const iin=clamp((p-0.56)/0.06,0,1)*(1-clamp((p-0.78)/0.06,0,1));
    if(iin>0){x.fillStyle='rgba(6,12,18,'+(iin*0.92)+')';x.fillRect(0,0,W,H);x.save();x.globalAlpha=iin;const split=1-sm(clamp((p-0.62)/0.15,0,1));
      let ih=mob?H*0.5:Math.min(W*9/16,H), iw=ih*16/9; if(!mob&&iw<W){iw=W;ih=W*9/16}
      const ix=(W-iw)/2, iy=mob?H*0.1:(H-ih)/2;
      x.beginPath();x.rect(0,0,W,H);x.clip();x.translate(ix,iy);drawInterior(x,iw,ih,t,split,true);x.restore()}
    // textos
    $('intro').style.opacity=1-clamp(p/0.07,0,1);$('intro').style.pointerEvents=p<0.05?'auto':'none';
    $('scrim').style.opacity=1-clamp(p/0.08,0,1);$('hint').style.opacity=1-clamp(p/0.03,0,1);
    $('capscrim').style.opacity=clamp((p-0.06)/0.05,0,1);
    caps.forEach(cp=>{const a=+cp.dataset.a,b=+cp.dataset.b;const o=clamp((p-a)/0.03,0,1)*(1-clamp((p-b+0.03)/0.03,0,1));cp.style.opacity=o;cp.style.transform='translateY('+((1-o)*16)+'px)';cp.classList.toggle('on',o>0.6)});
    $('pbar').style.width=(p*100)+'%';
    const hour=(ph*24+6)%24,hh=Math.floor(hour),mm=Math.floor((hour-hh)*60);$('clock').textContent=String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');
    $('lv-pv').textContent=num(Math.max(0,e)*5.4)+' kW';$('lv-ext').textContent=num(9+9*e)+' °C';
  });
})();

/* ===== TARJETAS DE SERVICIOS ===== */
document.querySelectorAll('canvas[data-scene]').forEach(c=>{
  const k=c.dataset.scene;const R=rng(k.length*99);
  const parts=Array.from({length:60},()=>[R(),R(),R()*0.6+0.4,R()]);
  addScene(c,t=>{const [x,W,H]=fit(c);
    if(k==='heat'){const g=x.createLinearGradient(0,H,W,0);g.addColorStop(0,'#123A52');g.addColorStop(1,'#B5562A');x.fillStyle=g;x.fillRect(0,0,W,H);
      // ondas térmicas
      for(let i=0;i<9;i++){x.beginPath();for(let X=0;X<=W;X+=8){const Y=H*0.1+i*H*0.09+Math.sin(X*0.015+t*(0.6+i*0.05)+i)*14;X?x.lineTo(X,Y):x.moveTo(X,Y)}
        x.strokeStyle=mix('#6FB7DA','#FFB36B',i/8);x.globalAlpha=0.55;x.lineWidth=2;x.stroke()}x.globalAlpha=1;
      // ventilador
      const cx=W*0.72,cy=H*0.3,r=Math.min(W,H)*0.17;x.fillStyle='rgba(255,255,255,.08)';x.beginPath();x.arc(cx,cy,r*1.25,0,7);x.fill();
      x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=3;for(let i=0;i<5;i++){const a=t*4+i*1.2566;x.beginPath();x.moveTo(cx,cy);x.quadraticCurveTo(cx+Math.cos(a+.5)*r*.7,cy+Math.sin(a+.5)*r*.7,cx+Math.cos(a)*r,cy+Math.sin(a)*r);x.stroke()}
    }
    if(k==='sun'){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3E7FB3');g.addColorStop(.6,'#F2B35E');g.addColorStop(1,'#B9652F');x.fillStyle=g;x.fillRect(0,0,W,H);
      const sx=W*0.75,sy=H*0.22;for(let i=0;i<14;i++){const a=t*0.15+i*0.4488;x.strokeStyle='rgba(255,240,200,.25)';x.lineWidth=6;x.beginPath();x.moveTo(sx,sy);x.lineTo(sx+Math.cos(a)*W,sy+Math.sin(a)*W);x.stroke()}
      x.fillStyle='#FFF1C9';x.beginPath();x.arc(sx,sy,26,0,7);x.fill();
      // filas de paneles en perspectiva
      for(let r=0;r<5;r++){const y=H*0.42+r*H*0.08,h=H*0.05,sk=r*6;for(let i=-2;i<8;i++){const w=W/6.5;const X=i*w+sk-((t*8)%w);
        const gl=Math.max(0,1-Math.abs(X-(W*((t*0.12)%1.4-0.2)))/(w*1.2));x.fillStyle=mix('#13233C','#C9DDF8',gl*0.6);x.beginPath();x.moveTo(X,y+h);x.lineTo(X+w*0.9,y+h);x.lineTo(X+w*0.9+12,y);x.lineTo(X+12,y);x.closePath();x.fill();
        x.strokeStyle='rgba(180,200,230,.35)';x.lineWidth=.8;x.stroke()}}
    }
    if(k==='lux'){const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#2B2621');g.addColorStop(1,'#0F0D0B');x.fillStyle=g;x.fillRect(0,0,W,H);
      // haz de luz que se mueve
      const bx=W*(0.2+0.25*Math.sin(t*0.25));x.fillStyle='rgba(255,226,170,.10)';x.beginPath();x.moveTo(bx,0);x.lineTo(bx+W*0.25,0);x.lineTo(bx+W*0.65,H);x.lineTo(bx+W*0.2,H);x.closePath();x.fill();
      // lámparas colgantes
      for(let i=0;i<3;i++){const px=W*(0.28+i*0.22),sw=Math.sin(t*1.1+i)*0.06,len=H*(0.2+i*0.04);const lx=px+Math.sin(sw)*len,ly=Math.cos(sw)*len;
        x.strokeStyle='rgba(220,200,160,.6)';x.lineWidth=1;x.beginPath();x.moveTo(px,0);x.lineTo(lx,ly);x.stroke();
        const lg=x.createRadialGradient(lx,ly+10,0,lx,ly+10,70);lg.addColorStop(0,'rgba(255,210,140,.55)');lg.addColorStop(1,'rgba(255,210,140,0)');x.fillStyle=lg;x.beginPath();x.arc(lx,ly+10,70,0,7);x.fill();
        x.fillStyle='#C9A062';x.beginPath();x.arc(lx,ly+6,14,Math.PI,0);x.fill()}
      // encimera de mármol
      x.fillStyle='#EDE9E2';x.fillRect(W*0.12,H*0.55,W*0.76,H*0.06);x.fillStyle='#3A2F26';x.fillRect(W*0.14,H*0.61,W*0.72,H*0.25);
      x.strokeStyle='rgba(120,110,100,.5)';x.lineWidth=1;x.beginPath();x.moveTo(W*0.2,H*0.56);x.bezierCurveTo(W*0.4,H*0.6,W*0.5,H*0.55,W*0.8,H*0.6);x.stroke();
      x.strokeStyle='rgba(201,160,98,.6)';for(let i=1;i<4;i++){x.beginPath();x.moveTo(W*0.14+i*W*0.18,H*0.63);x.lineTo(W*0.14+i*W*0.18,H*0.84);x.stroke()}
    }
    parts.forEach(p=>{const y=((p[1]-t*0.02*p[2])%1+1)%1;x.fillStyle='rgba(255,255,255,'+(0.15*p[2])+')';x.beginPath();x.arc(p[0]*W,y*H,p[2]*1.6,0,7);x.fill()});
  });
});

/* ===== INTERIOR ANTES / DESPUÉS ===== */
const marbleTex=document.createElement('canvas');marbleTex.width=600;marbleTex.height=80;
  (function(){const x=marbleTex.getContext('2d');x.fillStyle='#F1EEE8';x.fillRect(0,0,600,80);const R=rng(3);
    for(let v=0;v<7;v++){let X=R()*600,Y=R()*80;x.beginPath();x.moveTo(X,Y);for(let i=0;i<40;i++){X+=8+R()*10;Y+=(R()-.5)*14;x.lineTo(X,Y)}x.strokeStyle='rgba(110,100,92,'+(0.15+R()*0.3)+')';x.lineWidth=R()*2+.4;x.stroke()}})();
function drawInterior(x,W,H,t,split,film){
    const sp=W*split;
    // ===== DESPUÉS (todo el lienzo) =====
    x.fillStyle='#E8E2D8';x.fillRect(0,0,W,H);
    // gran ventanal
    const wx=W*0.3,wy=H*0.1,ww=W*0.55,wh=H*0.52;
    const sk=x.createLinearGradient(0,wy,0,wy+wh);sk.addColorStop(0,'#8FC2E3');sk.addColorStop(1,'#E7F1F5');x.fillStyle=sk;x.fillRect(wx,wy,ww,wh);
    x.fillStyle='#6D9663';x.fillRect(wx,wy+wh*0.62,ww,wh*0.38);x.fillStyle='#4FA9CF';x.fillRect(wx+ww*0.1,wy+wh*0.8,ww*0.6,wh*0.12);
    x.fillStyle='#3E6B45';[0.15,0.8].forEach(k=>{x.beginPath();x.ellipse(wx+ww*k,wy+wh*0.5,ww*0.08,wh*0.2,0,0,7);x.fill()});
    x.strokeStyle='#1E2226';x.lineWidth=4;x.strokeRect(wx,wy,ww,wh);x.lineWidth=2;[1,2].forEach(i=>{x.beginPath();x.moveTo(wx+ww*i/3,wy);x.lineTo(wx+ww*i/3,wy+wh);x.stroke()});
    // armarios de roble a la izquierda
    x.fillStyle='#A47A4E';x.fillRect(W*0.03,H*0.1,W*0.22,H*0.62);
    x.strokeStyle='rgba(60,40,20,.35)';x.lineWidth=1;for(let i=1;i<4;i++){x.beginPath();x.moveTo(W*0.03+i*W*0.055,H*0.1);x.lineTo(W*0.03+i*W*0.055,H*0.72);x.stroke()}
    x.fillStyle='#C9A062';for(let i=0;i<4;i++)x.fillRect(W*0.03+i*W*0.055+W*0.046,H*0.36,2,H*0.1);
    // suelo de roble
    const fl=x.createLinearGradient(0,H*0.72,0,H);fl.addColorStop(0,'#B98D5E');fl.addColorStop(1,'#8E6640');x.fillStyle=fl;x.fillRect(0,H*0.72,W,H*0.28);
    x.strokeStyle='rgba(70,45,20,.25)';for(let i=0;i<14;i++){const X=i*W/13;x.beginPath();x.moveTo(W/2+(X-W/2)*0.6,H*0.72);x.lineTo(X,H);x.stroke()}
    // haz de sol
    const bx=W*(0.42+0.12*Math.sin(t*0.2));x.fillStyle='rgba(255,236,190,.22)';x.beginPath();x.moveTo(bx,H*0.72);x.lineTo(bx+W*0.28,H*0.72);x.lineTo(bx+W*0.4,H);x.lineTo(bx+W*0.06,H);x.closePath();x.fill();
    // isla de mármol
    const ix=W*0.36,iy=H*0.6,iw=W*0.42,ih=H*0.25;
    x.drawImage(marbleTex,ix-6,iy-H*0.035,iw+12,H*0.035);x.drawImage(marbleTex,0,20,600,60,ix,iy,iw,ih);
    x.fillStyle='rgba(0,0,0,.08)';x.fillRect(ix,iy+ih-6,iw,6);
    // taburetes
    x.strokeStyle='#C9A062';x.lineWidth=2;[0.45,0.6].forEach(k=>{const sx=W*k;x.beginPath();x.moveTo(sx,iy+ih*0.5);x.lineTo(sx-8,H*0.93);x.moveTo(sx,iy+ih*0.5);x.lineTo(sx+8,H*0.93);x.stroke();x.fillStyle='#2B2B2B';x.fillRect(sx-14,iy+ih*0.45,28,6)});
    // lámparas
    for(let i=0;i<3;i++){const px=ix+iw*(0.2+i*0.3),sw=Math.sin(t*1.3+i)*0.04,len=H*0.3;const lx=px+Math.sin(sw)*len,ly=Math.cos(sw)*len;
      x.strokeStyle='#2B2B2B';x.lineWidth=1;x.beginPath();x.moveTo(px,0);x.lineTo(lx,ly);x.stroke();
      const lg=x.createRadialGradient(lx,ly+8,0,lx,ly+8,W*0.07);lg.addColorStop(0,'rgba(255,214,150,.6)');lg.addColorStop(1,'rgba(255,214,150,0)');x.fillStyle=lg;x.beginPath();x.arc(lx,ly+8,W*0.07,0,7);x.fill();
      x.fillStyle='#C9A062';x.beginPath();x.arc(lx,ly+6,W*0.018,Math.PI,0);x.fill()}
    // sofá a la derecha
    x.fillStyle='#D7D0C4';x.fillRect(W*0.82,H*0.7,W*0.18,H*0.1);x.fillStyle='#CFC6B8';x.fillRect(W*0.84,H*0.62,W*0.16,H*0.09);
    // icono suelo radiante: ondas tenues
    x.strokeStyle='rgba(255,150,80,.18)';x.lineWidth=2;for(let i=0;i<3;i++){x.beginPath();for(let X=0;X<=W;X+=10){const Y=H*(0.8+i*0.06)+Math.sin(X*0.03+t*1.5+i)*3;X?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}

    // ===== ANTES (recortado a la izquierda) =====
    x.save();x.beginPath();x.rect(0,0,sp,H);x.clip();
    x.fillStyle='#CFC8B2';x.fillRect(0,0,W,H);
    // gotelé
    const R=rng(11);x.fillStyle='rgba(0,0,0,.05)';for(let i=0;i<500;i++)x.fillRect(R()*W,R()*H*0.72,2,2);
    // ventana pequeña con persiana
    const vx=W*0.44,vy=H*0.16,vw=W*0.2,vh=H*0.3;x.fillStyle='#B9CBD3';x.fillRect(vx,vy,vw,vh);
    x.fillStyle='#A08E6C';for(let i=0;i<8;i++)x.fillRect(vx,vy+i*vh*0.06,vw,vh*0.045);
    x.strokeStyle='#8A7350';x.lineWidth=6;x.strokeRect(vx,vy,vw,vh);
    // radiador
    x.fillStyle='#E8E6E0';x.fillRect(vx,H*0.52,vw,H*0.14);x.strokeStyle='#BDB9AF';x.lineWidth=2;for(let i=1;i<10;i++){x.beginPath();x.moveTo(vx+i*vw/10,H*0.52);x.lineTo(vx+i*vw/10,H*0.66);x.stroke()}
    // muebles de cocina anticuados
    x.fillStyle='#8C6B3F';x.fillRect(W*0.03,H*0.12,W*0.3,H*0.2);x.fillRect(W*0.03,H*0.46,W*0.3,H*0.26);
    x.fillStyle='#E1DCCF';x.fillRect(W*0.03,H*0.43,W*0.3,H*0.035);
    x.strokeStyle='#5E4628';x.lineWidth=2;for(let i=0;i<3;i++){x.strokeRect(W*0.04+i*W*0.097,H*0.13,W*0.087,H*0.18);x.strokeRect(W*0.04+i*W*0.097,H*0.48,W*0.087,H*0.23)}
    // azulejos de cocina
    x.strokeStyle='rgba(120,110,90,.35)';x.lineWidth=1;for(let X=W*0.03;X<W*0.33;X+=W*0.025){x.beginPath();x.moveTo(X,H*0.32);x.lineTo(X,H*0.43);x.stroke()}for(let Y=H*0.32;Y<H*0.43;Y+=H*0.027){x.beginPath();x.moveTo(W*0.03,Y);x.lineTo(W*0.33,Y);x.stroke()}
    // suelo de terrazo
    x.fillStyle='#BDB39E';x.fillRect(0,H*0.72,W,H*0.28);x.strokeStyle='rgba(90,80,60,.3)';
    for(let i=0;i<10;i++){const Y=H*0.72+i*H*0.03*(1+i*0.15);x.beginPath();x.moveTo(0,Y);x.lineTo(W,Y);x.stroke()}
    for(let i=0;i<20;i++){x.beginPath();x.moveTo(W/2+(i*W/19-W/2)*0.5,H*0.72);x.lineTo(i*W/19,H);x.stroke()}
    // fluorescente parpadeante
    const fl2=(Math.sin(t*13)>0.92)?0.25:0.85;x.fillStyle='rgba(240,250,255,'+fl2+')';x.fillRect(W*0.12,H*0.03,W*0.22,H*0.02);
    x.fillStyle='rgba(220,235,240,'+(fl2*0.12)+')';x.fillRect(0,0,W,H*0.72);
    // mesa con hule
    x.fillStyle='#9C7A4E';x.fillRect(W*0.38,H*0.7,W*0.3,H*0.04);x.fillRect(W*0.4,H*0.74,6,H*0.18);x.fillRect(W*0.65,H*0.74,6,H*0.18);
    x.restore();
    // separador
    x.fillStyle='#fff';x.fillRect(sp-1.5,0,3,H);x.beginPath();x.arc(sp,H/2,16,0,7);x.fill();
    x.fillStyle='#0E1C22';x.beginPath();x.moveTo(sp-9,H/2);x.lineTo(sp-3,H/2-6);x.lineTo(sp-3,H/2+6);x.closePath();x.fill();x.beginPath();x.moveTo(sp+9,H/2);x.lineTo(sp+3,H/2-6);x.lineTo(sp+3,H/2+6);x.closePath();x.fill();
}
(function(){
  const c=$('interior'),rng2=$('ba-r');let split=0.5,user=false;
  rng2.addEventListener('input',()=>{user=true;split=rng2.value/100});
  addScene(c,t=>{const [x,W,H]=fit(c);if(!user&&!RM){split=0.5+0.32*Math.sin(t*0.45);rng2.value=split*100}drawInterior(x,W,H,t,split)});
})();

/* ===== MATERIALES ===== */
document.querySelectorAll('canvas[data-mat]').forEach(c=>{
  const k=c.dataset.mat;const w=c.width=240,h=c.height=320;const x=c.getContext('2d');const R=rng(k.charCodeAt(0)*31);
  if(k==='marble'){x.fillStyle='#F2EFEA';x.fillRect(0,0,w,h);
    for(let v=0;v<9;v++){let X=R()*w,Y=-10;x.beginPath();x.moveTo(X,Y);while(Y<h+10){Y+=6+R()*8;X+=(R()-.5)*16+(v%2?2:-2);x.lineTo(X,Y)}
      x.strokeStyle=v<2?'rgba(170,135,80,.55)':'rgba(95,90,88,'+(.12+R()*.35)+')';x.lineWidth=v<2?2.4:R()*2+.4;x.stroke()}}
  if(k==='oak'){for(let p=0;p<4;p++){const X=p*w/4;x.fillStyle=['#B78B5B','#AC7F50','#BF9566','#A97B4C'][p];x.fillRect(X,0,w/4,h);
      for(let i=0;i<26;i++){const ox=X+R()*w/4;x.beginPath();for(let Y=0;Y<=h;Y+=6){const xx=ox+Math.sin(Y*0.04+i)*3;Y?x.lineTo(xx,Y):x.moveTo(xx,Y)}x.strokeStyle='rgba(80,50,20,'+(.1+R()*.15)+')';x.lineWidth=.8;x.stroke()}
      x.fillStyle='rgba(40,25,10,.4)';x.fillRect(X,0,1.5,h)}x.fillRect(0,h*0.55,w/2,1.5);x.fillRect(w/2,h*0.25,w/2,1.5)}
  if(k==='trav'){x.fillStyle='#D9C7A8';x.fillRect(0,0,w,h);for(let i=0;i<70;i++){const Y=R()*h;x.fillStyle='rgba('+(150+R()*60|0)+','+(120+R()*50|0)+',80,'+(.12+R()*.2)+')';x.fillRect(0,Y,w,R()*5+1)}
      for(let i=0;i<60;i++){x.fillStyle='rgba(120,95,60,.35)';x.beginPath();x.ellipse(R()*w,R()*h,R()*5+1,R()*1.5+.5,0,0,7);x.fill()}}
  if(k==='micro'){x.fillStyle='#A6A39C';x.fillRect(0,0,w,h);for(let i=0;i<2500;i++){x.fillStyle='rgba('+(R()>.5?255:0)+','+(R()>.5?255:0)+','+(R()>.5?255:0)+',0.035)';x.fillRect(R()*w,R()*h,3,3)}
      for(let i=0;i<18;i++){const g=x.createRadialGradient(R()*w,R()*h,0,R()*w,R()*h,60+R()*80);g.addColorStop(0,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h)}}
  if(k==='brass'){const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#7A5A2E');g.addColorStop(.35,'#D6B072');g.addColorStop(.55,'#F1D7A2');g.addColorStop(.8,'#A9824B');g.addColorStop(1,'#6D4F27');x.fillStyle=g;x.fillRect(0,0,w,h);
      for(let i=0;i<500;i++){x.fillStyle='rgba(255,255,255,'+(R()*.08)+')';x.fillRect(0,R()*h,w,.6)}}
});

/* ===== Revelado al hacer scroll (estado en reposo visible) ===== */
if(!RM&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>{const r=el.getBoundingClientRect();if(r.top>innerHeight){el.classList.add('pre');io.observe(el)}})}
// duplicar marquee para bucle continuo
const mq=$('mq');mq.innerHTML+=mq.innerHTML;

requestAnimationFrame(loop);

/* ===== CALCULADORAS ===== */
let lastCalc={tipo:'aero'};
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(o=>{const on=o===b;o.setAttribute('aria-selected',on);$('p-'+o.dataset.k).hidden=!on});
}));

// Aerotermia
const UTIL={gasoleo:1.15/10/0.85,propano:0.15,gas:0.085,elec:0.17},SCOP={D3:3.6,C4:3.9},PK=0.17;
function calcA(){const fuel=$('a-fuel').value,spend=+$('a-spend').value,m2=+$('a-m2').value,zone=$('a-zone').value,irpfOn=$('a-irpf').checked;
  $('a-spend-v').textContent=eur(spend);$('a-m2-v').textContent=m2+' m²';
  const nc=spend/UTIL[fuel]*PK/SCOP[zone],save=Math.max(0,spend-nc),inv=7500+30*m2,irpf=irpfOn?0.4*Math.min(inv,7500):0,pay=save>0?(inv-irpf)/save:Infinity;
  $('a-save').textContent=eur(save);$('a-n1').textContent=eur(spend);$('a-n2').textContent=eur(nc);$('a-b1').style.width='100%';$('a-b2').style.width=(nc/spend*100).toFixed(1)+'%';
  $('a-inv').textContent=eur(inv*.88)+' – '+eur(inv*1.12);$('a-irpf-v').textContent=irpfOn?eur(irpf):'No aplica';
  $('a-pay').textContent=isFinite(pay)?num(pay)+' años':'—';$('a-15').textContent=eur(save*15-(inv-irpf));
  lastCalc={tipo:'Aerotermia',resumen:'ahorro ≈ '+eur(save)+'/año, inversión '+eur(inv*.88)+'–'+eur(inv*1.12)};}
['a-fuel','a-spend','a-m2','a-zone','a-irpf'].forEach(id=>$(id).addEventListener('input',calcA));

// Solar
function calcS(){const bill=+$('s-bill').value,zone=$('s-zone').value,orient=+$('s-roof').value,bat=$('s-bat').checked,aero=$('s-aero').checked,ev=$('s-ev').checked;
  $('s-bill-v').textContent=eur(bill)+'/mes';
  let cons=bill*12*0.8/PK+(aero?4000:0)+(ev?2500:0);            // kWh/año (80 % de la factura es energía)
  const annual=bill*12+(aero?4000*PK:0)+(ev?2500*PK:0);
  const yieldK=(zone==='C4'?1620:1550)*orient;
  let kwp=Math.round(clamp(cons*0.75/yieldK,2,15)/0.45)*0.45;
  const prod=kwp*yieldK, selfR=bat?0.72:0.42, self=Math.min(prod*selfR,cons*0.85), exc=prod-self;
  const save=self*PK+exc*0.06, after=Math.max(annual-save,annual*0.12);
  const inv=1600+kwp*1150+(bat?6500:0), pay=inv/save;
  $('s-save').textContent=eur(save);$('s-n1').textContent=eur(annual);$('s-n2').textContent=eur(after);
  $('s-b1').style.width='100%';$('s-b2').style.width=(after/annual*100).toFixed(1)+'%';
  $('s-kwp').textContent=num(kwp,2)+' kWp · '+Math.round(kwp/0.45)+' paneles';$('s-prod').textContent=Math.round(prod).toLocaleString('es-ES')+' kWh';
  $('s-self').textContent=Math.round(self/cons*100)+' % de tu consumo';$('s-inv').textContent=eur(inv*.9)+' – '+eur(inv*1.1);$('s-pay').textContent=num(pay)+' años';
  lastCalc={tipo:'Placas solares',resumen:num(kwp,2)+' kWp'+(bat?' + batería':'')+', ahorro ≈ '+eur(save)+'/año'};}
['s-bill','s-zone','s-roof','s-bat','s-aero','s-ev'].forEach(id=>$(id).addEventListener('input',calcS));

// Reforma de lujo
const REF={ // [min,max] por nivel: Premium, Lujo, Alta decoración
  int:{unit:'m2',p:[[1100,1500],[1600,2400],[2500,3600]]},
  kit:{unit:'n',p:[[18000,28000],[30000,55000],[60000,110000]],m2eq:18},
  bath:{unit:'n',p:[[9000,14000],[15000,28000],[30000,55000]],m2eq:8},
  design:{unit:'m2',p:[[180,300],[320,520],[550,900]]}
};
function calcR(){const type=$('r-type').value,cfg=REF[type],q=+document.querySelector('input[name="r-q"]:checked').value;
  const m2=+$('r-m2').value,n=+$('r-n').value;$('r-m2-v').textContent=m2+' m²';$('r-n-v').textContent=n+(n>1?' unidades':' unidad');
  $('r-m2-f').hidden=cfg.unit!=='m2';$('r-n-f').hidden=cfg.unit!=='n';
  const qty=cfg.unit==='m2'?m2:n;let [lo,hi]=cfg.p[q].map(v=>v*qty);
  const floorOn=$('r-floor').checked&&(type==='int'),domOn=$('r-dom').checked,projOn=$('r-proj').checked;
  $('r-floor').disabled=type!=='int';
  const energy=floorOn?(6500+m2*55):0;
  const dom=domOn?(lo+hi)/2*0.06:0, proj=projOn&&type!=='design'?(lo+hi)/2*0.09:0;
  lo+=energy+dom+proj;hi+=energy+dom+proj;const mid=(lo+hi)/2;
  $('r-total').textContent=eurK(lo)+' – '+eurK(hi);
  const area=cfg.unit==='m2'?m2:cfg.m2eq*n;$('r-m2p').textContent=eur(lo/area)+' – '+eur(hi/area);
  let wk;if(type==='int')wk=[Math.round(10+m2/25),Math.round(14+m2/18)];else if(type==='kit')wk=[3+n,5+n*2];else if(type==='bath')wk=[2+n,3+n*2];else wk=[4,8];
  $('r-time').textContent=wk[0]+'–'+wk[1]+' semanas';
  $('r-energy').textContent=floorOn?eur(energy):(type==='int'?'No incluido':'—');
  const base=mid-energy-dom-proj, parts=[base*0.45,base*0.32,base*0.23,energy+dom+proj], tot=parts.reduce((a,b)=>a+b,0);
  ['rs1','rs2','rs3','rs4'].forEach((id,i)=>$(id).style.width=(parts[i]/tot*100)+'%');
  lastCalc={tipo:'Reforma',resumen:$('r-type').selectedOptions[0].text+', '+['premium','lujo','alta decoración'][q]+', '+eurK(lo)+'–'+eurK(hi)};}
['r-type','r-m2','r-n','r-floor','r-dom','r-proj'].forEach(id=>$(id).addEventListener('input',calcR));
document.querySelectorAll('input[name="r-q"]').forEach(r=>r.addEventListener('input',calcR));
calcA();calcS();calcR();calcA();

// Pasar el cálculo al formulario
document.querySelectorAll('[data-from]').forEach(a=>a.addEventListener('click',()=>{
  const k=a.dataset.from;({aero:calcA,solar:calcS,ref:calcR})[k]();
  $('f-calc').textContent='Tu cálculo: '+lastCalc.tipo+' — '+lastCalc.resumen+'. Lo usaremos para preparar tu estudio.';$('f-calc').hidden=false;
  $('i-aero').checked=k==='aero';$('i-pv').checked=k==='solar';$('i-bat').checked=k==='solar'&&$('s-bat').checked;$('i-ref').checked=k==='ref';$('i-int').checked=k==='ref'&&$('r-proj').checked;
}));

// Formulario: en producción, POST a webhook de Make -> CRM
const WEBHOOK_URL=import.meta.env.PUBLIC_LEAD_WEBHOOK_URL||'';
$('leadForm').addEventListener('submit',async e=>{e.preventDefault();
  const err=$('f-err'),ok=$('f-ok');err.hidden=true;ok.hidden=true;
  const name=$('f-name').value.trim(),phone=$('f-phone').value.replace(/\s/g,''),town=$('f-town').value.trim();
  if(!name||!town){err.textContent='Indica tu nombre y municipio.';err.hidden=false;return}
  if(!/^(\+34)?[6789]\d{8}$/.test(phone)){err.textContent='Revisa el teléfono: 9 cifras, empezando por 6, 7, 8 o 9.';err.hidden=false;return}
  if(!$('f-rgpd').checked){err.textContent='Necesitamos tu consentimiento para poder llamarte.';err.hidden=false;return}
  const payload={name,phone,town,interest:['aero','pv','bat','ev','ref','int'].filter(k=>$('i-'+k).checked),calc:lastCalc,ts:new Date().toISOString()};
  if(WEBHOOK_URL){try{await fetch(WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});ok.textContent='Gracias, '+name.split(' ')[0]+'. Te llamamos en menos de 24 h laborables.'}
    catch(_){err.textContent='No se ha podido enviar. Escríbenos por WhatsApp.';err.hidden=false;return}}
  else ok.textContent='Vista previa: el formulario está validado pero aún no conectado. En la web real, esta solicitud entraría en el CRM vía Make con el cálculo adjunto.';
  ok.hidden=false;});
})();
