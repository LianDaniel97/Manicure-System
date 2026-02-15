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
}