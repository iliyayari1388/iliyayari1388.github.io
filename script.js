const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

// Theme
const savedTheme = localStorage.getItem('iy-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  if(next === 'dark') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = next;
  localStorage.setItem('iy-theme', next);
  drawMath(); drawNetwork();
});

// Mobile nav
$('#menuBtn').addEventListener('click', () => $('#site-nav').classList.toggle('open'));
$$('#site-nav a').forEach(a=>a.addEventListener('click',()=>$('#site-nav').classList.remove('open')));

// Reveal animations
const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible'); io.unobserve(e.target)} }), {threshold:.13});
$$('.reveal').forEach(el=>io.observe(el));

// Project filtering + details
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const f=btn.dataset.filter;
  $$('.project').forEach(p=>p.classList.toggle('hidden', f!=='all' && p.dataset.type!==f));
}));
function openProject(card){ $('#modalTitle').textContent=card.dataset.title; $('#modalDetail').textContent=card.dataset.detail; $('#projectModal').classList.add('open'); $('#projectModal').setAttribute('aria-hidden','false'); }
$$('.project').forEach(c=>c.addEventListener('click',()=>openProject(c)));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>{ $('#projectModal').classList.remove('open'); $('#projectModal').setAttribute('aria-hidden','true'); }));

// Domain detail
const domainData={
 math:['Mathematics','A broad mathematical workspace spanning olympiad problem solving, proof design, mathematical writing and advanced problem construction.',['Proofs','Olympiad','Algebra','Geometry']],
 combinatorics:['Combinatorics','Exploring configurations, graph structures, extremal ideas, games and constructive arguments.',['Graphs','Extremal','Games','Constructions']],
 number:['Number Theory','Working with divisibility, digit sums, prime structures and arithmetic-function style ideas.',['Divisibility','Primes','Digit sums','Arithmetic']],
 economics:['Economics','An expanding field of interest focused on economic systems, incentives, resilience and the behavior of complex systems.',['Systems','Incentives','Markets','Resilience']],
 security:['Economic Security','Exploring robustness, dependencies and systemic risk inside economic systems, with an emphasis on understanding how systems remain secure under stress.',['Robustness','Dependencies','Risk','Security']],
 digital:['Digital Projects','Building interactive educational interfaces and technical mathematical assets with web technologies and precise typesetting.',['HTML','CSS','JavaScript','LaTeX','Asymptote']]
};
$$('.domain-card').forEach(c=>c.addEventListener('click',()=>{const d=domainData[c.dataset.domain]; $('#domainTitle').textContent=d[0]; $('#domainDetail').textContent=d[1]; $('#domainTags').innerHTML=d[2].map(x=>`<span>${x}</span>`).join(''); $('#domainModal').classList.add('open'); $('#domainModal').setAttribute('aria-hidden','false');}));
$$('[data-close-domain]').forEach(b=>b.addEventListener('click',()=>{ $('#domainModal').classList.remove('open'); $('#domainModal').setAttribute('aria-hidden','true'); }));

// Command palette
function openCommand(){ $('#commandPalette').classList.add('open'); $('#commandPalette').setAttribute('aria-hidden','false'); $('#commandInput').value=''; setTimeout(()=>$('#commandInput').focus(),20); }
function closeCommand(){ $('#commandPalette').classList.remove('open'); $('#commandPalette').setAttribute('aria-hidden','true'); }
$('#commandBtn').addEventListener('click',openCommand); $$('[data-close-command]').forEach(b=>b.addEventListener('click',closeCommand));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCommand(); $('#projectModal').classList.remove('open'); $('#domainModal').classList.remove('open')} if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}});
$('#commandInput').addEventListener('input',e=>{const q=e.target.value.toLowerCase(); $$('#commandList button').forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?'block':'none')});
$$('#commandList button').forEach(b=>b.addEventListener('click',()=>{closeCommand(); document.querySelector(b.dataset.jump)?.scrollIntoView({behavior:'smooth'});}));

// Copy email
$('#copyEmail').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('iliyayari09@gmail.com');showToast('Email copied');}catch{showToast('iliyayari09@gmail.com')}});
function showToast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),1800)}
$('#year').textContent=new Date().getFullYear();

// Math canvas visual
const mathCanvas=$('#mathCanvas'), mctx=mathCanvas.getContext('2d'); let W=0,H=0,t=0;
function resizeMath(){const r=mathCanvas.getBoundingClientRect();W=Math.max(1,Math.floor(r.width*devicePixelRatio));H=Math.max(1,Math.floor(r.height*devicePixelRatio));mathCanvas.width=W;mathCanvas.height=H;mctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
function drawMath(){const r=mathCanvas.getBoundingClientRect();const w=r.width,h=r.height; mctx.clearRect(0,0,w,h); const dark=document.documentElement.dataset.theme!=='light'; const cx=w*.54,cy=h*.52;
  for(let ring=1;ring<=5;ring++){const rad=55+ring*42+Math.sin(t*.001+ring)*5;mctx.beginPath();mctx.arc(cx,cy,rad,0,Math.PI*2);mctx.strokeStyle=dark?`rgba(150,170,255,${.055+ring*.01})`:`rgba(60,80,160,${.07+ring*.01})`;mctx.lineWidth=1;mctx.stroke()}
  for(let i=0;i<16;i++){const a=i*Math.PI*2/16+t*.00018;const r0=90+12*Math.sin(i+t*.001);const x=cx+Math.cos(a)*r0,y=cy+Math.sin(a)*r0*.78;mctx.beginPath();mctx.arc(x,y,3.2,0,Math.PI*2);mctx.fillStyle=dark?'rgba(166,184,255,.82)':'rgba(80,102,220,.8)';mctx.fill();mctx.beginPath();mctx.moveTo(cx,cy);mctx.lineTo(x,y);mctx.strokeStyle=dark?'rgba(166,184,255,.10)':'rgba(80,102,220,.09)';mctx.stroke()}
  const p=[]; for(let x=-20;x<=20;x++){const xx=x/20;const yy=.42*Math.sin(xx*5.1+t*.0011)+.12*Math.sin(xx*13-t*.0007);p.push([cx+xx*240,cy+yy*125])}mctx.beginPath();p.forEach((q,i)=>i?mctx.lineTo(q[0],q[1]):mctx.moveTo(q[0],q[1]));mctx.strokeStyle=dark?'rgba(138,255,209,.36)':'rgba(30,130,110,.28)';mctx.lineWidth=1.5;mctx.stroke();t+=16;requestAnimationFrame(drawMath)}
resizeMath();window.addEventListener('resize',resizeMath);drawMath();

// Network canvas
const netCanvas=$('#networkCanvas'), nctx=netCanvas.getContext('2d'); let nodes=[], mouse={x:-1e3,y:-1e3};
function seedNodes(){const r=netCanvas.getBoundingClientRect();nodes=Array.from({length:58},()=>({x:Math.random()*r.width,y:Math.random()*r.height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+1.1}));}
function drawNetwork(){const r=netCanvas.getBoundingClientRect();const w=r.width,h=r.height;nctx.clearRect(0,0,w,h);const dark=document.documentElement.dataset.theme!=='light';
  for(const p of nodes){p.x+=p.vx;p.y+=p.vy;if(p.x<-10||p.x>w+10)p.vx*=-1;if(p.y<-10||p.y>h+10)p.vy*=-1;const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.hypot(dx,dy);if(dist<140){p.x+=(dx/dist)*-.22;p.y+=(dy/dist)*-.22}}
  for(let i=0;i<nodes.length;i++){for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){nctx.beginPath();nctx.moveTo(a.x,a.y);nctx.lineTo(b.x,b.y);nctx.strokeStyle=dark?`rgba(142,167,255,${(1-d/120)*.18})`:`rgba(70,90,180,${(1-d/120)*.18})`;nctx.lineWidth=1;nctx.stroke()}}}
  for(const p of nodes){const d=Math.hypot(p.x-mouse.x,p.y-mouse.y);nctx.beginPath();nctx.arc(p.x,p.y,p.r+(d<90?1.5:0),0,Math.PI*2);nctx.fillStyle=dark?'rgba(199,167,255,.85)':'rgba(80,100,210,.75)';nctx.fill()}
  requestAnimationFrame(drawNetwork)}
netCanvas.addEventListener('pointermove',e=>{const r=netCanvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});netCanvas.addEventListener('pointerleave',()=>{mouse.x=-1e3;mouse.y=-1e3});$('#reseedBtn').addEventListener('click',()=>{seedNodes();showToast('System re-seeded')});seedNodes();window.addEventListener('resize',seedNodes);drawNetwork();
