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
});
