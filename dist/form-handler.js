document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const originalButtonText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando...';

            const target = contactForm.getAttribute('action');

            fetch(target, {
                method: 'POST',
                body: formData, // Dejamos que el navegador decida el Content-Type automáticamente
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.reset();
                    formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
                    formStatus.className = 'success';
                } else {
                    return response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = "Oops! Hubo un problema al enviar el formulario.";
                        }
                    })
                }
            })
            .catch(error => {
                formStatus.textContent = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.';
                formStatus.className = 'error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalButtonText;
                formStatus.style.display = 'block';
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 6000);
            });
        });
    }
});