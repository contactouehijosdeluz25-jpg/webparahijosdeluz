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

            // Enviar al action del formulario si está definido, si no a '/'
            const target = contactForm.getAttribute('action') || '/';

            fetch(target, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
                credentials: 'same-origin'
            })
            .then(async response => {
                const text = await response.text().catch(() => '');
                console.log('Form submit response status:', response.status);
                console.log('Form submit response body:', text.slice(0, 1000));
                if (response.ok) {
                    // Redirigir a la página de agradecimiento para comportarse como envío normal
                    try { window.location.href = '/gracias'; } catch(e) { /* fallback */ }
                    contactForm.reset();
                    formStatus.textContent = '¡Gracias por tu mensaje! Ha sido enviado correctamente.';
                    formStatus.className = 'success';
                } else {
                    // Mostrar mensaje más informativo y dejar registro en consola
                    formStatus.textContent = 'Error al enviar el formulario (estado ' + response.status + '). Ver consola para más detalles.';
                    formStatus.className = 'error';
                    throw new Error('Form submission failed: ' + response.status);
                }
            })
            .catch(error => {
                formStatus.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
                formStatus.className = 'error';
                console.error('Error sending form:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalButtonText;
                formStatus.style.display = 'block';
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = '';
                }, 6000);
            });
        });
    }
});