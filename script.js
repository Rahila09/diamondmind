
/* ═══════════════════════════════════════════════════════
   DIAMOND MIND GIRLS FOUNDATION — All JavaScript
═══════════════════════════════════════════════════════ */
'use strict';

function debounce(fn,delay){let t;return function(...a){clearTimeout(t);t=setTimeout(()=>fn.apply(this,a),delay)}}

/* ── Sticky Navbar ── */
(function(){
  const navbar=document.getElementById('navbar');
  function update(){navbar.classList.toggle('scrolled',window.scrollY>60)}
  window.addEventListener('scroll',update,{passive:true});
  update();
})();

/* ── Mobile Menu ── */
(function(){
  const btn=document.getElementById('hamburger');
  const nav=document.getElementById('navLinks');
  if(!btn||!nav)return;
  const overlay=document.createElement('div');
  overlay.className='nav-overlay';
  document.body.appendChild(overlay);
  function open(){btn.classList.add('active');nav.classList.add('open');overlay.classList.add('active');document.body.style.overflow='hidden';btn.setAttribute('aria-expanded','true')}
  function close(){btn.classList.remove('active');nav.classList.remove('open');overlay.classList.remove('active');document.body.style.overflow='';btn.setAttribute('aria-expanded','false')}
  btn.addEventListener('click',()=>btn.classList.contains('active')?close():open());
  overlay.addEventListener('click',close);
  nav.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();

/* ── Scroll Reveal ── */
(function(){
  const els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})
  },{rootMargin:'0px 0px -60px 0px',threshold:0.12});
  els.forEach(el=>obs.observe(el));
})();

/* ── Impact Counters ── */
(function(){
  const counters=document.querySelectorAll('.impact-number[data-target]');
  if(!counters.length)return;
  let done=false;
  function ease(t){return 1-Math.pow(1-t,3)}
  function run(el){
    const target=parseInt(el.getAttribute('data-target'),10);
    const start=performance.now();
    const dur=2000;
    function tick(now){
      const p=Math.min((now-start)/dur,1);
      el.textContent=Math.round(ease(p)*target).toLocaleString();
      if(p<1)requestAnimationFrame(tick);
      else el.textContent=target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }
  const sec=document.getElementById('impact');
  if(!sec)return;
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting&&!done){done=true;counters.forEach(run)}})
  },{threshold:0.4}).observe(sec);
})();

/* ── Scroll Spy ── */
(function(){
  const sections=document.querySelectorAll('section[id]');
  const links=document.querySelectorAll('.nav-link');
  function update(){
    let current='';
    sections.forEach(s=>{if(window.scrollY+120>=s.offsetTop)current=s.id});
    links.forEach(l=>{l.classList.toggle('active',l.getAttribute('href')==='#'+current)});
  }
  window.addEventListener('scroll',debounce(update,50),{passive:true});
})();

/* ── Smooth Scroll with Navbar Offset ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const id=this.getAttribute('href');
    if(!id||id==='#')return;
    const el=document.querySelector(id);
    if(!el)return;
    e.preventDefault();
    const offset=(document.getElementById('navbar')?.offsetHeight||72);
    window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-offset,behavior:'smooth'});
  });
});

/* ── Contact Form ── */
(function(){
  const form=document.getElementById('contactForm');
  const note=document.getElementById('formNote');
  if(!form)return;
  function showNote(msg,type){note.textContent=msg;note.className='form-note '+type}
  function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const name=form.querySelector('#name').value.trim();
    const email=form.querySelector('#email').value.trim();
    if(!name||!email){showNote('Please fill in your name and email.','error');return}
    if(!validEmail(email)){showNote('Please enter a valid email address.','error');return}
    const btn=form.querySelector('button[type="submit"]');
    const orig=btn.textContent;
    btn.textContent='Sending…';btn.disabled=true;
    /* REPLACE setTimeout below with your actual fetch() call to Formspree or your backend */
    setTimeout(()=>{
      showNote('✓ Thank you! We\'ll be in touch with you shortly.','success');
      form.reset();btn.textContent=orig;btn.disabled=false;
    },1500);
  });
})();

/* ── Hero Parallax (desktop only) ── */
(function(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches||window.innerWidth<768)return;
  const imgs=document.querySelectorAll('.hero-img');
  window.addEventListener('scroll',()=>{
    imgs.forEach((img,i)=>{img.style.transform=`translateY(${(i%2===0?1:-1)*window.scrollY*0.06}px) scale(1.03)`});
  },{passive:true});
})();
