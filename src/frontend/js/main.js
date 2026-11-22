/* main.js — site-wide behavior: footer year, mobile menu, dropdowns, contact form placeholder. */
(function(){
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  var menuToggle = document.getElementById('menuToggle');
  var primaryNav = document.getElementById('primaryNav');
  if(!menuToggle || !primaryNav) return;
  var subItems = document.querySelectorAll('.nav-item.has-sub');
  var isMobile = function(){ return window.matchMedia('(max-width: 1020px)').matches; };
  // Touch / coarse-pointer devices use tap-to-toggle instead of hover, even on wide screens.
  var usesClickMenu = function(){ return isMobile() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches; };

  function closeAllSubmenus(){ subItems.forEach(function(i){ i.classList.remove('open'); }); }

  menuToggle.addEventListener('click', function(){
    var open = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    closeAllSubmenus();
  });

  subItems.forEach(function(item){
    var link = item.querySelector(':scope > a');
    link.addEventListener('click', function(e){
      if(!usesClickMenu()) return;            // desktop mouse: hover menu, link navigates normally
      e.preventDefault();
      var willOpen = !item.classList.contains('open');
      closeAllSubmenus();
      if(willOpen) item.classList.add('open');
    });
    // Keyboard: open while focus is inside, close when it leaves.
    item.addEventListener('focusin', function(){ item.classList.add('kb-open'); });
    item.addEventListener('focusout', function(e){ if(!item.contains(e.relatedTarget)) item.classList.remove('kb-open'); });
  });

  document.addEventListener('click', function(e){
    if(usesClickMenu() && !primaryNav.contains(e.target) && !menuToggle.contains(e.target)) closeAllSubmenus();
  });

  window.addEventListener('resize', function(){
    if(!isMobile()){
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
      closeAllSubmenus();
    }
  });

  // Contact form placeholder (replace with fetch() to your API Gateway / Lambda endpoint).
  document.querySelectorAll('.contact-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      alert('This form is not yet connected to a backend. Wire it up to your API Gateway / Lambda endpoint to send messages.');
    });
  });
})();
