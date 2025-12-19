// galeria.js — controla desplazamiento automático de las pistas al pasar el ratón
document.addEventListener('DOMContentLoaded', () => {
  const tracks = document.querySelectorAll('.scroll-track');

  // Hacer todas las pistas desplazables horizontalmente; el usuario controlará el scroll
  tracks.forEach(track => {
    track.style.overflowX = 'auto';
    track.style.WebkitOverflowScrolling = 'touch';
    track.style.scrollBehavior = 'smooth';
  });

  // Añadir botones 'Me gusta' y envoltorio para cada imagen
  document.querySelectorAll('.scroll-track').forEach(track => {
    track.style.position = track.style.position || 'relative';
    const imgs = Array.from(track.querySelectorAll('img'));
    imgs.forEach(img => {
      if (img.closest('.gallery-thumb')) return;
      const wrap = document.createElement('div');
      wrap.className = 'gallery-thumb';
      wrap.style.display = 'inline-block';
      wrap.style.position = 'relative';
      wrap.style.marginRight = '0.75rem';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);

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

      const key = 'likes:' + img.getAttribute('src');
      const saved = parseInt(localStorage.getItem(key) || '0', 10);
      btn.querySelector('.count').textContent = saved;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        let current = parseInt(localStorage.getItem(key) || '0', 10);
        current = current + 1;
        localStorage.setItem(key, String(current));
        btn.querySelector('.count').textContent = current;
        btn.animate([{ transform: 'scale(1.0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1.0)' }], { duration: 200 });
      });
    });
  });
});
