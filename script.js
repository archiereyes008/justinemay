document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.classList.toggle('active', isOpen);
    });
  }

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (event) => {
      if (window.innerWidth > 768) return;

      event.preventDefault();
      const isOpen = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      menu.style.display = isOpen ? 'block' : 'none';
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideNav = nav && nav.contains(event.target);
    const clickedToggle = toggle && toggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.classList.remove('active');
      dropdownItems.forEach((item) => {
        item.classList.remove('open');
        const menu = item.querySelector('.dropdown-menu');
        if (menu && window.innerWidth <= 768) {
          menu.style.display = 'none';
        }
      });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.classList.remove('active');

      dropdownItems.forEach((item) => {
        item.classList.remove('open');
        const menu = item.querySelector('.dropdown-menu');
        if (menu) {
          menu.style.display = '';
        }
      });
    } else {
      dropdownItems.forEach((item) => {
        const menu = item.querySelector('.dropdown-menu');
        if (menu && !item.classList.contains('open')) {
          menu.style.display = 'none';
        }
      });
    }
  });
});
