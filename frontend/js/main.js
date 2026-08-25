document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.querySelector('.close-btn');
    const registerBtns = document.querySelectorAll('.register-btn');
    const eventInput = document.getElementById('event-input');
    const selectedEventName = document.getElementById('selected-event-name');
    const form = document.getElementById('registration-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-reg-btn');

    // Open Modal
    registerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventName = btn.getAttribute('data-event');
            eventInput.value = eventName;
            selectedEventName.textContent = eventName;
            modal.classList.remove('hidden');
            formMessage.classList.add('hidden');
            form.reset();
        });
    });

    // Close Modal
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic frontend validation is handled by HTML5 attributes (required, pattern)
        
        // Disable submit button to prevent double submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        formMessage.classList.add('hidden');

        const formData = {
            fullName: document.getElementById('fullName').value,
            college: document.getElementById('college').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            dob: document.getElementById('dob').value,
            event: document.getElementById('event-input').value
        };

        try {
            // Note: Since backend isn't fully ready, we mock the request or point it to future endpoint
            const response = await fetch('/api/events/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                formMessage.innerHTML = `
                    <div style="text-align: left; background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                        <h4 style="color: #22c55e; margin: 0 0 0.5rem 0;">🎉 Registration Successful!</h4>
                        <p style="margin: 0.3rem 0;"><strong>Participant ID:</strong> ${result.participantId}</p>
                        <p style="margin: 0.3rem 0;"><strong>Password:</strong> ${result.tempPassword}</p>
                        <p style="font-size: 0.85rem; opacity: 0.8; margin-top: 0.5rem;">Credentials have also been sent to your email.</p>
                    </div>
                `;
                formMessage.className = 'success';
                formMessage.classList.remove('hidden');
                form.reset();
            } else {
                formMessage.textContent = result.message || 'Registration failed. Please try again.';
                formMessage.className = 'error';
                formMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Connection error. Please try again or check your internet connection.';
            formMessage.className = 'error';
            formMessage.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Registration';
        }
    });
});
