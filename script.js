/* --- Preloader --- */
const preloader = document.querySelector('#preloader');
window.addEventListener('load', () => {
    preloader.classList.add('preloader-hidden');
    // Elimina el preloader del DOM después de que termine la animación de desvanecimiento
    preloader.addEventListener('transitionend', () => {
        preloader.remove();
    });
});

const mainHeader = document.querySelector('.main-header');
const navToggle = document.querySelector('.mobile-nav-toggle');

navToggle.addEventListener('click', () => {
    const isVisible = mainHeader.getAttribute('data-nav-visible');

    if (isVisible === "false" || isVisible === null) {
        mainHeader.setAttribute('data-nav-visible', true);
        navToggle.setAttribute('aria-expanded', true);
    } else {
        mainHeader.setAttribute('data-nav-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }
});

/* --- Change Header on Scroll --- */
const scrollToTopBtn = document.querySelector('#scroll-to-top-btn');
const whatsappFab = document.querySelector('#whatsapp-fab');

window.addEventListener('scroll', () => {
    // Lógica para el header
    if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }

    // Lógica para el botón "volver arriba"
    // Muestra el botón después de scrollear el alto de una pantalla
    if (window.scrollY > window.innerHeight) {
        scrollToTopBtn.classList.add('is-visible');
        whatsappFab.classList.add('is-visible');
    } else {
        scrollToTopBtn.classList.remove('is-visible');
        whatsappFab.classList.remove('is-visible');
    }
});

scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* --- Animation on Scroll --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    // Opciones: puedes ajustar el 'threshold' para que la animación se dispare
    // cuando un cierto porcentaje del elemento sea visible.
    // threshold: 0.1 // 10% del elemento visible
});

// Seleccionamos todos los elementos que queremos animar
const elementsToFadeIn = document.querySelectorAll('.fade-in-element');

// Le decimos al observador que vigile cada uno de esos elementos
elementsToFadeIn.forEach((el) => observer.observe(el));

/* --- Cookie Consent --- */
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const declineBtn = document.getElementById('cookie-decline-btn');

    // Si no hay un consentimiento guardado, muestra el banner
    if (!localStorage.getItem('cookie_consent')) {
        cookieBanner.classList.add('is-visible');
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'accepted');
        cookieBanner.classList.remove('is-visible');
        // Aquí es donde inicializarías los scripts de seguimiento, por ejemplo:
        // gtag('consent', 'update', { 'analytics_storage': 'granted' });
        console.log("Cookies aceptadas. Scripts de seguimiento activados.");
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'declined');
        cookieBanner.classList.remove('is-visible');
        // Aquí te asegurarías de que los scripts de seguimiento no se ejecuten
        // gtag('consent', 'update', { 'analytics_storage': 'denied' });
        console.log("Cookies rechazadas. Scripts de seguimiento desactivados.");
    });
});

/* --- Contact Form Validation --- */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return; // No hacer nada si el formulario no está en la página

    const formStatus = document.getElementById('form-status');
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

    const validateField = (input) => {
        const errorElement = input.nextElementSibling;
        let errorMessage = '';

        if (input.required && input.value.trim() === '') {
            errorMessage = 'Este campo es obligatorio.';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            errorMessage = 'Por favor, introduce un correo electrónico válido.';
        } else if (input.minLength > 0 && input.value.length < input.minLength) {
            errorMessage = `Este campo debe tener al menos ${input.minLength} caracteres.`;
        }

        if (errorMessage) {
            input.classList.add('invalid');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            return false;
        } else {
            input.classList.remove('invalid');
            errorElement.style.display = 'none';
            return true;
        }
    };

    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input)); // Validar al salir del campo
    });

    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            formStatus.textContent = 'Por favor, corrige los errores antes de enviar.';
            formStatus.className = 'error';
            return;
        }

        // Si el formulario es válido, enviar los datos
        const submitButton = document.getElementById('submit-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        formStatus.textContent = '';

        const formData = new FormData(this);
        const response = await fetch(this.action, {
            method: this.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';

        formStatus.className = response.ok ? 'success' : 'error';
        formStatus.textContent = response.ok ? '¡Gracias por tu mensaje! Te contactaremos pronto.' : 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
        if (response.ok) this.reset();
    });
});

/* --- Lightbox for Gallery --- */
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const lightboxCounter = document.querySelector('.lightbox-counter');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
        if (galleryItems.length === 0) return;
        currentIndex = index;
        lightboxImg.src = galleryItems[currentIndex].href;
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            lightbox.style.display = 'block';
            showImage(index);
            document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        lightboxImg.src = ''; // Limpia el src para detener la carga si está en proceso
        document.body.style.overflow = 'auto';
    };

    const showNextImage = () => {
        const nextIndex = (currentIndex + 1) % galleryItems.length;
        showImage(nextIndex);
    };

    const showPrevImage = () => {
        const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(prevIndex);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); }); // Cierra al hacer clic fuera de la imagen
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });
});

/* --- FAQ Accordion (Single Open) --- */
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(itemToOpen => {
        itemToOpen.addEventListener('toggle', () => {
            // Si el item actual se está abriendo
            if (itemToOpen.open) {
                // Cierra todos los demás items
                faqItems.forEach(itemToClose => {
                    if (itemToClose !== itemToOpen) {
                        itemToClose.open = false;
                    }
                });
            }
        });
    });
});

/* --- Video Modal --- */
document.addEventListener('DOMContentLoaded', () => {
    const videoTrigger = document.getElementById('video-trigger');
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('youtube-video');
    const closeModalBtn = document.querySelector('.video-modal-close');

    if (!videoTrigger) return;

    const openModal = () => {
        const videoId = videoTrigger.dataset.videoId;
        // Usamos la URL de embed con autoplay para que inicie al abrir
        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoModal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        // Detenemos el video al cerrar para que no siga sonando
        videoFrame.src = '';
        videoModal.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
    };

    videoTrigger.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Cierra el modal si se hace clic en el fondo oscuro
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeModal();
        }
    });
});