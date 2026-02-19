
$(document).ready(function () {
    const manager = new AppointmentManager();
    let appointments = manager.getUserAppointments();

    // Mock Data for Demonstration if empty
    if (appointments.length === 0) {
        // Add a past appointment
        manager.addAppointment({
            serviceId: 's1',
            staffId: 'st1',
            date: '2023-12-01',
            time: '10:00',
            customerName: 'רוני דוגמה',
            customerPhone: '0500000000'
        });
        // Add a cancelled appointment
        const cancelledApp = manager.addAppointment({
            serviceId: 's2',
            staffId: 'st2',
            date: '2024-02-15',
            time: '14:00',
            customerName: 'רוני דוגמה',
            customerPhone: '0500000000'
        });
        manager.cancelAppointment(cancelledApp.id);

        // Reload to get new data
        appointments = manager.getUserAppointments();
    }

    const container = $('#appointments-list');
    const noData = $('#no-appointments');

    if (appointments.length === 0) {
        noData.show();
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Grouping
    const active = [];
    const past = [];
    const cancelled = [];

    appointments.forEach(app => {
        if (app.status === 'cancelled') {
            cancelled.push(app);
            return;
        }

        const appDate = new Date(app.date + 'T' + app.time);
        if (appDate < now) {
            past.push(app);
        } else {
            active.push(app);
        }
    });

    // Render helper
    function renderCard(app, type) {
        const service = SERVICES.find(s => s.id === app.serviceId);
        const staff = STAFF.find(st => st.id === app.staffId);
        let extraClass = '';
        if (type === 'past') extraClass = 'past-appointment';
        if (type === 'cancelled') extraClass = 'cancelled-appointment';

        return `
            <div class="appointment-card ${app.status} ${extraClass}">
                <div class="app-header">
                    <h3>${service ? service.name : 'שירות לא ידוע'}</h3>
                    <span class="status-badge ${app.status}">
                        ${app.status === 'confirmed' ? (type === 'past' ? 'בוצע' : 'מאושר') : 'מבוטל'}
                    </span>
                </div>
                <div class="app-details">
                    <p><strong>מטפלת:</strong> ${staff ? staff.name : '???'}</p>
                    <p><strong>תאריך:</strong> ${app.date}</p>
                    <p><strong>שעה:</strong> ${app.time}</p>
                </div>
                ${type === 'active' ?
                `<button class="btn-cancel" data-id="${app.id}">ביטול תור</button>`
                : ''}
            </div>
        `;
    }

    // Sort Active by date (asc)
    active.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    // Sort Past by date (desc)
    past.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

    // Render Active
    active.forEach(app => container.append(renderCard(app, 'active')));

    // Render Past
    if (past.length > 0) {
        if (active.length > 0) container.append('<div class="appointments-divider"><h3>היסטוריית טיפולים</h3></div>');
        else if (cancelled.length > 0) container.append('<div class="appointments-divider"><h3>היסטוריית טיפולים</h3></div>');

        past.forEach(app => container.append(renderCard(app, 'past')));
    }

    // Render Cancelled
    if (cancelled.length > 0) {
        container.append('<div class="appointments-divider"><h3>תורים מבוטלים</h3></div>');
        cancelled.forEach(app => container.append(renderCard(app, 'cancelled')));
    }

    // Cancel Logic
    $(document).on('click', '.btn-cancel', function () {
        const id = String($(this).data('id'));
        if (confirm('האם את בטוחה שברצונך לבטל את התור?')) {
            if (manager.cancelAppointment(id)) {
                location.reload();
            } else {
                alert('שגיאה בביטול התור');
            }
        }
    });
});
