document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = '/admin/login.html';
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login.html';
    });

    const loadStats = async () => {
        try {
            const res = await fetch('/api/events/stats', { headers });
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            
            const statsContainer = document.getElementById('stats-container');
            let html = `
                <div class="stat-card">
                    <h4>Total Registrations</h4>
                    <div class="stat-number">${data.total}</div>
                </div>
            `;
            
            data.events.forEach(e => {
                html += `
                    <div class="stat-card">
                        <h4>${e.event_name}</h4>
                        <div class="stat-number">${e.registrations}</div>
                    </div>
                `;
            });
            
            statsContainer.innerHTML = html;
        } catch (error) {
            console.error(error);
        }
    };

    const loadEvents = async () => {
        try {
            const res = await fetch('/api/events', { headers });
            if (!res.ok) throw new Error('Failed to fetch events');
            const events = await res.json();
            
            const tbody = document.querySelector('#events-table tbody');
            tbody.innerHTML = '';
            
            events.forEach(e => {
                const tr = document.createElement('tr');
                const isStarted = e.status === 'Started';
                
                tr.innerHTML = `
                    <td>${e.name}</td>
                    <td>${e.description}</td>
                    <td><span style="color: ${isStarted ? 'var(--success)' : 'var(--text-muted)'}">${e.status}</span></td>
                    <td>
                        <button class="event-status-btn ${isStarted ? 'status-started' : 'status-not-started'}" data-id="${e.id}" data-current="${e.status}">
                            ${isStarted ? 'Stop Event' : 'Start Event'}
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            
            document.querySelectorAll('.event-status-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const currentStatus = e.target.getAttribute('data-current');
                    const newStatus = currentStatus === 'Started' ? 'Not Started' : 'Started';
                    
                    await fetch(`/api/events/${id}/status`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ status: newStatus })
                    });
                    
                    loadEvents(); // Reload
                });
            });
        } catch (error) {
            console.error(error);
        }
    };

    const loadParticipants = async () => {
        try {
            const res = await fetch('/api/events/participants', { headers });
            if (!res.ok) throw new Error('Failed to fetch participants');
            const participants = await res.json();
            
            const tbody = document.querySelector('#participants-table tbody');
            tbody.innerHTML = '';
            
            participants.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${p.participant_id}</strong></td>
                    <td>${p.name}</td>
                    <td>${p.college}</td>
                    <td>${p.email}</td>
                    <td>${p.event_name}</td>
                    <td>${new Date(p.registered_at).toLocaleString()}</td>
                    <td>
                        <button class="delete-participant-btn" data-id="${p.participant_id}" style="background: var(--error, #ef4444); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-weight: 600;">
                            Remove
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.querySelectorAll('.delete-participant-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const participantId = e.target.getAttribute('data-id');
                    if (confirm(`Are you sure you want to remove participant ${participantId}?`)) {
                        try {
                            const response = await fetch(`/api/events/participants/${participantId}`, {
                                method: 'DELETE',
                                headers
                            });
                            if (response.ok) {
                                loadParticipants();
                                loadStats();
                            } else {
                                alert('Failed to delete participant.');
                            }
                        } catch (err) {
                            console.error(err);
                            alert('Error removing participant.');
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error);
        }
    };

    loadStats();
    loadEvents();
    loadParticipants();
});
