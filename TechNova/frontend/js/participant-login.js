document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('participant-login-form');
    const msg = document.getElementById('login-message');
    const btn = document.getElementById('login-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btn.disabled = true;
        btn.textContent = 'Logging in...';
        msg.classList.add('hidden');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/api/participant/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('participantToken', data.token);
                localStorage.setItem('participantEventName', data.eventName || '');
                localStorage.setItem('participantEventStatus', data.eventStatus || '');
                window.location.href = '/participant/dashboard.html';
            } else {
                msg.textContent = data.message || 'Login failed';
                msg.className = 'error';
                msg.classList.remove('hidden');
            }
        } catch (error) {
            msg.textContent = 'Network error. Please try again.';
            msg.className = 'error';
            msg.classList.remove('hidden');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Login to Event';
        }
    });
});
