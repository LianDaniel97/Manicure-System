class AppointmentManager {
    constructor() {
        this.storageKey = 'manicure_appointments';
        this.appointments = this.loadAppointments();
    }

    // Load appointments from LocalStorage
    loadAppointments() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save appointments to LocalStorage
    saveAppointments() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.appointments));
    }

    // Get all appointments
    getAppointments() {
        return this.appointments;
    }
    // Get appointments for a specific user (by phone for simplicity, though real auth is better)
    // For this project, we might just show all stored locally or filter if we implemented a "login"
    // Since there's no login, we'll assume the user sees all appointments stored in *their* browser.
    getUserAppointments() {
        return this.appointments.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
    }

    // Add a new appointment
    addAppointment(appointmentData) {
        const newAppointment = {
            id: Date.now().toString(), // Simple ID generation
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            ...appointmentData
        };

        this.appointments.push(newAppointment);
        this.saveAppointments();
        return newAppointment;
    }

    // Cancel an appointment
    cancelAppointment(appointmentId) {
        const index = this.appointments.findIndex(app => app.id === appointmentId);
        if (index !== -1) {
            this.appointments[index].status = 'cancelled';
            this.saveAppointments();
            return true;
        }
        return false;
    }

    // Check availability (Mock logic: check if slot is already taken for specific staff)
    isSlotAvailable(staffId, date, time) {
        return !this.appointments.some(app =>
            app.staffId === staffId &&
            app.date === date &&
            app.time === time &&
            app.status !== 'cancelled'
        );
    }
}