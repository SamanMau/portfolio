// Tema (ljus/mörk)
(function initTheme(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved === 'light') root.classList.add('light');
  document.getElementById('theme-toggle').addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });
})();

// Animerade räknare
(function animateCounters(){
  const counters = document.querySelectorAll('#quickFacts strong[data-count]');
  const duration = 900;
  counters.forEach(el=>{
    const target = parseInt(el.dataset.count,10) || 0;
    let start = null;
    function step(ts){
      if(!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(p * target);
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
})();

// Visa mer / Visa mindre
document.querySelectorAll('.project').forEach(card=>{
  const btn = card.querySelector('.btn-more');
  const body = card.querySelector('.project-body');
  btn.addEventListener('click', ()=>{
    const expanded = body.classList.toggle('expanded');
    body.classList.toggle('collapsed', !expanded);
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.textContent = expanded ? 'Visa mindre' : 'Visa mer';
  });
});

// Bild-modal
(function imageModal(){
  const modal = document.getElementById('imgModal');
  const modalImg = modal.querySelector('img');
  const caption = modal.querySelector('.modal-caption');
  function open(src, title){
    modalImg.src = src;
    caption.textContent = title || '';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  }
  function close(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    modalImg.src = '';
  }
  document.querySelectorAll('.project img').forEach(img=>{
    img.addEventListener('click', ()=> open(img.src, img.closest('.project').querySelector('h3')?.textContent));
  });
  modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });
  modal.querySelector('.modal-close').addEventListener('click', close);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
})();

// Sök + chip-filter
(function filtering(){
  const search = document.getElementById('search');
  const chips = document.querySelectorAll('.chip');
  const cards = [...document.querySelectorAll('.project')];
  let active = 'alla';

  function apply(){
    const q = (search.value || '').toLowerCase();
    cards.forEach(card=>{
      const hay = (card.innerText + ' ' + (card.dataset.tags||'')).toLowerCase();
      const tagOk = active === 'alla' || (card.dataset.tags||'').split(',').map(s=>s.trim()).includes(active);
      const show = hay.includes(q) && tagOk;
      card.style.display = show ? '' : 'none';
    });
  }

  search.addEventListener('input', apply);
  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      ch.classList.add('active');
      active = ch.dataset.filter;
      apply();
    });
  });

  // genvägar
  document.addEventListener('keydown', (e)=>{
    if(e.key === '/' && document.activeElement !== search){ e.preventDefault(); search.focus(); }
    if(e.key.toLowerCase() === 'g'){ document.getElementById('projects').scrollIntoView({behavior:'smooth'}); }
    if(e.key.toLowerCase() === 't'){ document.getElementById('theme-toggle').click(); }
  });
})();

// Back-to-top
(function backToTop(){
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 600) btn.classList.add('show'); else btn.classList.remove('show');
  });
  btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
})();

// Kopiera e-post
(function copyEmail(){
  const btn = document.getElementById('copyBtn');
  const link = document.getElementById('copyEmail');
  if(!btn || !link) return;
  btn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(link.textContent.trim());
      btn.textContent = 'Kopierad!';
      setTimeout(()=> btn.textContent = 'Kopiera', 1500);
    }catch(e){ btn.textContent = 'Misslyckades'; }
  });
})();
