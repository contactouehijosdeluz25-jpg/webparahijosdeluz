document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('preloader-hidden');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            });
        });
    }

    // --- Mobile Navigation ---
    const mainHeader = document.querySelector('.main-header');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    if (mainHeader && navToggle) {
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
    }

    // --- Scroll Effects (Header, FABs) ---
    const scrollToTopBtn = document.querySelector('#scroll-to-top-btn');
    const whatsappFab = document.querySelector('#whatsapp-fab');
    if (mainHeader && scrollToTopBtn && whatsappFab) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            const fabVisible = window.scrollY > window.innerHeight;

            mainHeader.classList.toggle('scrolled', scrolled);
            scrollToTopBtn.classList.toggle('is-visible', fabVisible);
            whatsappFab.classList.toggle('is-visible', fabVisible);
        });
    }

    // --- Scroll to Top Button Click ---
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Animation on Scroll (Intersection Observer) ---
    const elementsToFadeIn = document.querySelectorAll('.fade-in-element');
    if (elementsToFadeIn.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        });
        elementsToFadeIn.forEach((el) => observer.observe(el));
    }

    // --- Cookie Consent ---
    const cookieBanner = document.getElementById('cookie-consent-banner');
    if (cookieBanner) {
        const acceptBtn = document.getElementById('cookie-accept-btn');
        const declineBtn = document.getElementById('cookie-decline-btn');

        if (!localStorage.getItem('cookie_consent')) {
            cookieBanner.classList.add('is-visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('is-visible');
            console.log("Cookies aceptadas. Scripts de seguimiento activados.");
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('is-visible');
            console.log("Cookies rechazadas. Scripts de seguimiento desactivados.");
        });
    }

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
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
            input.addEventListener('blur', () => validateField(input));
        });

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) isFormValid = false;
            });

            if (!isFormValid) {
                formStatus.textContent = 'Por favor, corrige los errores antes de enviar.';
                formStatus.className = 'error';
                return;
            }

            const submitButton = document.getElementById('submit-btn');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            formStatus.textContent = '';

            const formData = new FormData(this);
            try {
                const response = await fetch(this.action, {
                    method: this.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.className = 'success';
                    formStatus.textContent = '¡Gracias por tu mensaje! Te contactaremos pronto.';
                    this.reset();
                } else {
                    formStatus.className = 'error';
                    formStatus.textContent = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
                }
            } catch (error) {
                formStatus.className = 'error';
                formStatus.textContent = 'Hubo un error de red. Inténtalo de nuevo.';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensaje';
            }
        });
    }

    // --- Lightbox for Gallery ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
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
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
            document.body.style.overflow = 'auto';
        };

        const showNextImage = () => showImage((currentIndex + 1) % galleryItems.length);
        const showPrevImage = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'Escape') closeLightbox();
            }
        });
    }

    // --- FAQ Accordion (Single Open) ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(itemToOpen => {
            itemToOpen.addEventListener('toggle', () => {
                if (itemToOpen.open) {
                    faqItems.forEach(itemToClose => {
                        if (itemToClose !== itemToOpen) {
                            itemToClose.open = false;
                        }
                    });
                }
            });
        });
    }

    // --- Video Modal ---
    const videoTrigger = document.getElementById('video-trigger');
    if (videoTrigger) {
        const videoModal = document.getElementById('video-modal');
        const videoFrame = document.getElementById('youtube-video');
        const closeModalBtn = document.querySelector('.video-modal-close');

        const openModal = () => {
            const videoId = videoTrigger.dataset.videoId;
            videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            videoModal.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            videoFrame.src = '';
            videoModal.classList.remove('is-visible');
            document.body.style.overflow = 'auto';
        };

        videoTrigger.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
    }
});