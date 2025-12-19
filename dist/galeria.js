// galeria.js — controla desplazamiento automático de las pistas al pasar el ratón
document.addEventListener('DOMContentLoaded', () => {
  const tracks = document.querySelectorAll('.scroll-track');

  tracks.forEach(track => {
    // permitir scroll horizontal por touch/drag en móviles por defecto (overflow: auto)
    track.style.overflowX = 'auto';
    track.style.scrollBehavior = 'smooth';

    let interval = null;
    const speed = parseFloat(track.dataset.speed) || 1;

    const startScroll = () => {
      if (interval) return;
      interval = setInterval(() => {
        // si llega al final, volver al inicio para bucle
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
          track.scrollLeft = 0;
        } else {
          track.scrollLeft += 1 * speed;
        }
      }, 16); // ~60fps
    };

    const stopScroll = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    track.addEventListener('mouseenter', startScroll);
    track.addEventListener('mouseleave', stopScroll);
    track.addEventListener('touchstart', stopScroll, {passive:true});
  });
  
  // Añadir botones 'Me gusta' y envoltorio para cada imagen
  document.querySelectorAll('.scroll-track').forEach(track => {
    track.style.position = track.style.position || 'relative';
    const imgs = Array.from(track.querySelectorAll('img'));
    imgs.forEach(img => {
      // evitar duplicar si ya está envuelto
      if (img.closest('.gallery-thumb')) return;
      const wrap = document.createElement('div');
      wrap.className = 'gallery-thumb';
      wrap.style.display = 'inline-block';
      wrap.style.position = 'relative';
      wrap.style.marginRight = '0.75rem';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);

      // crear botón like
      const btn = document.createElement('button');
      btn.className = 'like-btn';
      btn.setAttribute('aria-label', 'Me gusta');
      btn.innerHTML = '<span class="heart">❤</span> <span class="count">0</span>';
      btn.style.position = 'absolute';
      btn.style.top = '8px';
      btn.style.right = '8px';
      btn.style.background = 'rgba(255,255,255,0.9)';
      btn.style.border = '1px solid rgba(0,0,0,0.06)';
      btn.style.borderRadius = '20px';
      btn.style.padding = '4px 8px';
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '14px';
      btn.style.display = 'flex';
      btn.style.gap = '6px';
      btn.style.alignItems = 'center';
      wrap.appendChild(btn);

      // inicializar contador desde localStorage
      const key = 'likes:' + img.getAttribute('src');
      const saved = parseInt(localStorage.getItem(key) || '0', 10);
      btn.querySelector('.count').textContent = saved;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        let current = parseInt(localStorage.getItem(key) || '0', 10);
        current = current + 1;
        localStorage.setItem(key, String(current));
        btn.querySelector('.count').textContent = current;
        // animación simple
        btn.animate([{ transform: 'scale(1.0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1.0)' }], { duration: 200 });
      });
    });
  });
});
