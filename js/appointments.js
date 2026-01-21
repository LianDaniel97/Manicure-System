$(document).ready(function () {
    const manager = new AppointmentManager();
    const appointments = manager.getUserAppointments();

    const container = $('#appointments-list');
    const noData = $('#no-appointments');

    if (appointments.length === 0) {
        noData.show();
        return;
    }

    appointments.forEach(app => {
        const service = SERVICES.find(s => s.id === app.serviceId);
        const staff = STAFF.find(st => st.id === app.staffId);

        const card = $(`
            <div class="appointment-card ${app.status}">
                <div class="app-header">
                    <h3>${service ? service.name : 'שירות לא ידוע'}</h3>
                    <span class="status-badge ${app.status}">
                        ${app.status === 'confirmed' ? 'מאושר' : 'מבוטל'}
                    </span>
                </div>
                <div class="app-details">
                    <p><strong>מטפלת:</strong> ${staff ? staff.name : '???'}</p>
                    <p><strong>תאריך:</strong> ${app.date}</p>
                    <p><strong>שעה:</strong> ${app.time}</p>
                </div>
                ${app.status === 'confirmed' ?
                `<button class="btn-cancel" data-id="${app.id}">ביטול תור</button>`
                : ''}
            </div>
        `);

        container.append(card);
    });

    // Cancel Logic
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
