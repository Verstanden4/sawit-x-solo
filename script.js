/* ====================================================
 * RAJA SAWIT vs RAJA SOLO — Interactions
 * Hasil refactor: dipisah dari SawitXSolo.html (sebelumnya inline <script>).
 * Isi JS 100% sama, tidak ada perubahan logika.
 * Urutan: cursor -> navbar -> particles -> vs-lightning ->
 *   reveal-on-scroll -> counters -> leaderboard tabs.
 * ==================================================== */

// Cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX=0,mouseY=0,ringX=0,ringY=0;
document.addEventListener('mousemove',e=>{
  mouseX=e.clientX; mouseY=e.clientY;
  cursor.style.left=mouseX+'px';cursor.style.top=mouseY+'px';
});
function animRing(){
  ringX+=(mouseX-ringX)*.15;
  ringY+=(mouseY-ringY)*.15;
  cursorRing.style.left=ringX+'px';cursorRing.style.top=ringY+'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.char-card,.lb-row').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.classList.add('hover');cursorRing.classList.add('hover')});
  el.addEventListener('mouseleave',()=>{cursor.classList.remove('hover');cursorRing.classList.remove('hover')});
});

// Navbar scroll
const nav=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
});

// Particles
const canvas=document.getElementById('particles-canvas');
const ctx=canvas.getContext('2d');
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);
const particles=[];
for(let i=0;i<80;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*1.5+.3,
    vx:(Math.random()-.5)*.3,
    vy:-Math.random()*.5-.1,
    alpha:Math.random()*.4+.1,
    color:Math.random()>.5?'201,168,76':'93,204,48'
  });
}
function animParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.y<-10)p.y=canvas.height+10;
    if(p.x<-10)p.x=canvas.width+10;
    if(p.x>canvas.width+10)p.x=-10;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${p.color},${p.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(animParticles);
}
animParticles();

// VS Lightning Canvas
const vsCanvas=document.getElementById('vs-lightning');
if(vsCanvas){
  const vsCtx=vsCanvas.getContext('2d');
  function resizeVsCanvas(){vsCanvas.width=vsCanvas.offsetWidth;vsCanvas.height=vsCanvas.offsetHeight}
  resizeVsCanvas();
  window.addEventListener('resize',resizeVsCanvas);
  function drawLightning(ctx,x1,y1,x2,y2,roughness,maxOffset){
    const dx=x2-x1,dy=y2-y1;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<5){
      ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);return;
    }
    const mx=(x1+x2)/2,my=(y1+y2)/2;
    const off=(Math.random()-.5)*roughness;
    const nx=-dy/dist,ny=dx/dist;
    drawLightning(ctx,x1,y1,mx+nx*off,my+ny*off,roughness*.6,maxOffset);
    drawLightning(ctx,mx+nx*off,my+ny*off,x2,y2,roughness*.6,maxOffset);
  }
  function renderLightning(){
    vsCtx.clearRect(0,0,vsCanvas.width,vsCanvas.height);
    if(Math.random()<.3){
      const cx=vsCanvas.width/2,cy=vsCanvas.height/2;
      vsCtx.beginPath();
      vsCtx.strokeStyle='rgba(192,57,43,0.4)';
      vsCtx.lineWidth=1.5;
      drawLightning(vsCtx,cx-60,cy,cx+60,cy,40,30);
      vsCtx.stroke();
      vsCtx.beginPath();
      vsCtx.strokeStyle='rgba(201,168,76,0.3)';
      vsCtx.lineWidth=1;
      drawLightning(vsCtx,cx,cy-50,cx,cy+50,30,20);
      vsCtx.stroke();
    }
    requestAnimationFrame(renderLightning);
  }
  renderLightning();
}

// Scroll reveal
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'),i*80);
    }
  });
},{threshold:.12});
reveals.forEach(r=>observer.observe(r));

// Card tilt effect
document.querySelectorAll('.char-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const rect=card.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-.5;
    const y=(e.clientY-rect.top)/rect.height-.5;
    card.style.transform=`translateY(-8px) scale(1.02) rotateY(${x*8}deg) rotateX(${-y*6}deg)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
    card.style.transition='transform .4s cubic-bezier(.25,.46,.45,.94)';
  });
});

// Mouse follow glow on hero
const hero=document.getElementById('hero');
if(hero){
  hero.addEventListener('mousemove',e=>{
    const rect=hero.getBoundingClientRect();
    const x=e.clientX-rect.left,y=e.clientY-rect.top;
    hero.style.setProperty('--mx',x+'px');
    hero.style.setProperty('--my',y+'px');
  });
}

// Parallax on scroll
window.addEventListener('scroll',()=>{
  const sy=window.scrollY;
  const heroContent=document.querySelector('.hero-content');
  const chars=document.querySelector('.characters-container');
  if(heroContent)heroContent.style.transform=`translateY(${sy*.3}px)`;
  if(chars)chars.style.transform=`translateY(${sy*.15}px)`;
});

// Smooth stat bar animation
const statObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.stat-fill').forEach(fill=>{
        const w=fill.style.width;
        fill.style.width='0';
        setTimeout(()=>{fill.style.width=w;},100);
      });
      statObs.unobserve(e.target);
    }
  });
},{threshold:.3});
document.querySelectorAll('.char-card').forEach(c=>statObs.observe(c));
