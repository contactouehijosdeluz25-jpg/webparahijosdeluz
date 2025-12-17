// script.js - funcionalidades básicas para la página:
// - preloader hide
// - mobile nav toggle
// - video modal open/close (inserta embed de YouTube)
// - cookie consent (localStorage)
// - scroll-to-top (smooth) y mostrar/ocultar botón

document.addEventListener('DOMContentLoaded', function () {

    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            navToggle.setAttribute('aria-expanded', !isVisible);
            primaryNav.setAttribute('data-visible', !isVisible);
        });
    }

  // VIDEO MODAL
    function setupPipPlayer() {
        const videoTriggers = document.querySelectorAll('.js-video-trigger');
        let pipPlayer = null;

        const createPlayer = () => {
            if (document.getElementById('pip-player')) return;

            const playerDiv = document.createElement('div');
            playerDiv.id = 'pip-player';
            playerDiv.className = 'pip-player';
            playerDiv.innerHTML = `
                <div class="pip-player-header">
                    <button class="pip-player-close" aria-label="Cerrar video">&times;</button>
                </div>
                <div class="video-container">
                    <iframe id="pip-youtube-video" width="560" height="315" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            `;
            document.body.appendChild(playerDiv);

            pipPlayer = playerDiv;
            pipPlayer.querySelector('.pip-player-close').addEventListener('click', closePlayer);
        };

        const openPlayer = (videoId) => {
            if (!pipPlayer) createPlayer();
            const iframe = pipPlayer.querySelector('#pip-youtube-video');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&origin=${window.location.origin}`;
            pipPlayer.classList.add('show');
        };

        const closePlayer = () => {
            if (!pipPlayer) return;
            const iframe = pipPlayer.querySelector('#pip-youtube-video');
            iframe.src = '';
            pipPlayer.classList.remove('show');
        };

        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = trigger.dataset.videoId;
                if (videoId) openPlayer(videoId);
            });
        });
    }
    setupPipPlayer();

  // COOKIE CONSENT
  const cookieBanner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const declineBtn = document.getElementById('cookie-decline-btn');

  const COOKIE_KEY = 'hijosdeluz_cookie_consent';
  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.style.display = 'none';
  }
  const saved = localStorage.getItem(COOKIE_KEY);
  if (saved === 'accepted' || saved === 'declined') hideCookieBanner();

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      hideCookieBanner();
      // Aquí podrías inicializar analytics si aplica
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'declined');
      hideCookieBanner();
    });
  }

  // SCROLL TO TOP
  const scrollBtn = document.getElementById('scroll-to-top-btn');
  if (scrollBtn) {
    scrollBtn.style.display = 'none';
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollBtn.style.display = 'block';
      else scrollBtn.style.display = 'none';
    });
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Accessibility: close modal with ESC
  document.addEventListener('keydown', (e) => {
    // La lógica del modal de video se ha eliminado
  });

  // Optional: smooth scroll for internal anchors (if hay enlaces a #id)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // FADE-IN ANIMATIONS ON SCROLL
  const fadeInElements = document.querySelectorAll('.fade-in-element, .gallery-item');

  if (fadeInElements.length > 0) {
    const observerOptions = {
      root: null, // Observa la intersección con el viewport
      rootMargin: '0px',
      threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Si el elemento está intersectando (visible)
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Dejar de observar el elemento una vez que es visible para no repetir la animación
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observar cada uno de los elementos
    fadeInElements.forEach(el => observer.observe(el));

    // Aplicar retraso escalonado a los elementos agrupados
    const animatedGroups = document.querySelectorAll('.features-grid, .testimonials-slider, .process-steps, .team-grid, .gallery-grid, .academic-grid, .model-grid');
    animatedGroups.forEach(group => {
      const elements = group.querySelectorAll('.fade-in-element');
      elements.forEach((el, index) => {
        // Aplicar un retraso de 150ms por cada elemento
        el.style.transitionDelay = `${index * 150}ms`;
      });
    });
  }

  // GALLERY FILTER
  const filterContainer = document.querySelector('.gallery-filters');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterContainer && galleryItems.length > 0) {
    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        // Manejar el botón activo
        filterContainer.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');

        const filterValue = e.target.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (item.dataset.category === filterValue || filterValue === 'all') {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
      }
    });
  }
});
