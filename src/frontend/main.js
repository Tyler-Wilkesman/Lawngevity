document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const subItems = document.querySelectorAll('.nav-item.has-sub');
  const isMobile = () => window.matchMedia('(max-width: 980px)').matches;
  // Also use click-to-toggle (instead of hover) on any touch/coarse-pointer
  // device, even above the mobile breakpoint, so a submenu is never left
  // stuck open with no way to close it (touch has no "hover exit").
  const usesClickMenu = () => isMobile() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function closeAllSubmenus(){
    subItems.forEach(item => item.classList.remove('open'));
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    // Always reset submenus when the mobile nav itself opens/closes,
    // so a dropdown never carries over "stuck open" between visits.
    closeAllSubmenus();
  });

  // Mobile submenu toggles (tap to open/close; only one open at a time)
  subItems.forEach(item => {
    const link = item.querySelector(':scope > a');
    link.addEventListener('click', (e) => {
      if (!usesClickMenu()) return; // desktop mouse uses hover, let the link navigate normally
      e.preventDefault();
      const willOpen = !item.classList.contains('open');
      closeAllSubmenus();
      if (willOpen) item.classList.add('open');
    });
  });

  // Tapping/clicking outside the nav closes any open mobile submenu
  document.addEventListener('click', (e) => {
    if (usesClickMenu() && !primaryNav.contains(e.target) && e.target !== menuToggle) {
      closeAllSubmenus();
    }
  });

  // Keyboard accessibility: open a submenu while focus (via Tab) is on the
  // trigger link or anywhere inside the submenu, and close it as soon as
  // focus moves elsewhere — this replaces relying on CSS :focus-within on
  // the whole nav item, which stayed open permanently after a single click.
  subItems.forEach(item => {
    item.addEventListener('focusin', () => item.classList.add('kb-open'));
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove('kb-open');
      }
    });
  });

  // Belt-and-suspenders: if a desktop click on a trigger link doesn't
  // actually navigate away (e.g. sandboxed preview / no target page yet),
  // blur it after a moment so the submenu doesn't stay open forever.
  subItems.forEach(item => {
    const link = item.querySelector(':scope > a');
    link.addEventListener('click', () => {
      if (!usesClickMenu()) {
        setTimeout(() => {
          if (document.activeElement === link) link.blur();
        }, 150);
      }
    });
  });

  // If the viewport is resized past the mobile breakpoint, clear any
  // mobile-only open state so nothing is left stuck when switching back.
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
      closeAllSubmenus();
    }
  });

  // Contact form placeholder handler (replace with fetch() to your Lambda endpoint)
  // Applies to every form with class "contact-form" across the site.
  document.querySelectorAll('.contact-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      alert('This form is not yet connected to a backend. Wire it up to your API Gateway / Lambda endpoint to send messages.');
    });
  });
