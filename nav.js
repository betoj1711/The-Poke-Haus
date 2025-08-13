(function(){
  const btn = document.querySelector('.hamburger');
  const bar = document.getElementById('sidebar');
  if(btn && bar){
    btn.addEventListener('click', ()=>{
      const open = bar.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();