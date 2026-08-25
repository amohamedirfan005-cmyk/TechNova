document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
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
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                window.location.href = '/admin/dashboard.html';
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
            btn.textContent = 'Login';
        }
    });
});
