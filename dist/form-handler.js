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

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                if (response.ok) {
                    contactForm.reset();
                    formStatus.textContent = '¡Gracias por tu mensaje! Ha sido enviado correctamente.';
                    formStatus.className = 'success';
                } else {
                    throw new Error('Hubo un problema con el envío del formulario.');
                }
            })
            .catch(error => {
                formStatus.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
                formStatus.className = 'error';
                console.error('Error:', error);
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