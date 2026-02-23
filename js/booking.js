document.addEventListener('DOMContentLoaded', function () {
    var appointmentManager = new AppointmentManager();

    const urlParams = new URLSearchParams(window.location.search);
    let preSelectedServiceId = urlParams.get('service') || localStorage.getItem('selectedService');
   
       var bookingState = {
        serviceId: preSelectedServiceId || '',
        customerName: '',
        customerPhone: '',
        staffId: '',
        date: '',
        time: ''
    };

    localStorage.removeItem('selectedService');

    // פונקציית ולידציה ידנית (לפי הבקשה שלך - מצגת 8)
    function isPhoneValid(phone) {
        var allowedNumbers = "0123456789";
        if (phone.length !== 10) return false;

        for (var i = 0; i < phone.length; i++) {
            var char = phone[i];
            var isDigit = false;
            for (var j = 0; j < allowedNumbers.length; j++) {
                if (char === allowedNumbers[j]) {
                    isDigit = true;
                    break;
                }
            }
            if (!isDigit) return false;
        }
        return true;
    }

    // אתחול דרופדאון שירותים - Vanilla JS
    var serviceSelect = document.getElementById('serviceSelect');
    if (serviceSelect) {
        for (var i = 0; i < SERVICES.length; i++) {
            var s = SERVICES[i];
            var option = document.createElement('option');
            option.value = s.id;
            option.text = s.name;
            serviceSelect.appendChild(option);
        }
    }

    if (bookingState.serviceId && serviceSelect) {
        serviceSelect.value = bookingState.serviceId;
        updateServiceInfo(bookingState.serviceId);
    }

    // אירוע שינוי שירות
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function () {
            var id = this.value;
            bookingState.serviceId = id;
            updateServiceInfo(id);
        });
    }

    function updateServiceInfo(id) {
        var service = null;
        for (var i = 0; i < SERVICES.length; i++) {
            if (SERVICES[i].id === id) {
                service = SERVICES[i];
                break;
            }
        }

        var infoDiv = document.getElementById('selected-service-info');
        if (service && infoDiv) {
            infoDiv.innerHTML = '<strong>' + service.name + '</strong><br>' +
                service.description + '<br>' +
                'מחיר: ₪' + service.price + ' | משך: ' + service.durationMin + ' דק\'';
            infoDiv.style.display = 'block';
        } else if (infoDiv) {
            infoDiv.style.display = 'none';
        }
    }

    // כפתור הבא - שלב 1
    var btnNext1 = document.getElementById('btn-next-1');
    if (btnNext1) {
        btnNext1.addEventListener('click', function () {
            var name = document.getElementById('customerName').value.trim();
            var phone = document.getElementById('customerPhone').value.trim();
            var serviceId = serviceSelect.value;

            if (name === "" || phone === "" || serviceId === "") {
                alert('אנא מלאי את כל הפרטים');
                return;
            }

            // בדיקת שם ללא מספרים
            for (var j = 0; j < name.length; j++) {
                if (name[j] >= '0' && name[j] <= '9') {
                    alert('השם לא יכול להכיל מספרים');
                    return;
                }
            }

            if (!isPhoneValid(phone)) {
                alert('אנא הזיני מספר טלפון תקין הכולל בדיוק 10 ספרות');
                return;
            }

            bookingState.customerName = name;
            bookingState.customerPhone = phone;
            bookingState.serviceId = serviceId;

            updateStaffOptions();
            showStep(2);
        });
    }

    function updateStaffOptions() {
        var staffSelect = document.getElementById('staffSelect');
        if (!staffSelect) return;

        staffSelect.innerHTML = '<option value="">בחר מטפלת...</option>';

        for (var i = 0; i < STAFF.length; i++) {
            var st = STAFF[i];
            var isSpecialist = false;
            for (var j = 0; j < st.specialties.length; j++) {
                if (st.specialties[j] === bookingState.serviceId) {
                    isSpecialist = true;
                    break;
                }
            }
            if (isSpecialist) {
                var option = document.createElement('option');
                option.value = st.id;
                option.text = st.name;
                staffSelect.appendChild(option);
            }
        }
    }

    // תאריך מינימלי
    var dateInput = document.getElementById('dateSelect');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];

        // אירוע בחירת תאריך או מטפלת
        var staffSelect = document.getElementById('staffSelect');
        var handleChange = function () {
            var selectedDate = new Date(dateInput.value);
            var today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to compare only dates

            if (selectedDate < today) {
                alert('לא ניתן לבחור תאריך עבר');
                dateInput.value = ''; // Clear the invalid date
                bookingState.date = '';
                document.getElementById('time-slots').innerHTML = ''; // Clear time slots
                return;
            }

            bookingState.staffId = staffSelect.value;
            bookingState.date = dateInput.value;
            if (bookingState.staffId && bookingState.date) {
                renderTimeSlots();
            }
        };
        dateInput.addEventListener('change', handleChange);
        staffSelect.addEventListener('change', handleChange);
    }

    function renderTimeSlots() {
        var container = document.getElementById('time-slots');
        if (!container) return;
        container.innerHTML = '';

        var staff = null;
        for (var i = 0; i < STAFF.length; i++) {
            if (STAFF[i].id === bookingState.staffId) {
                staff = STAFF[i];
                break;
            }
        }
        if (!staff) return;

        for (var k = 0; k < staff.availableHours.length; k++) {
            var time = staff.availableHours[k];
            var isAvailable = appointmentManager.isSlotAvailable(staff.id, bookingState.date, time);

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'time-slot';
            btn.textContent = time;

            if (!isAvailable) {
                btn.disabled = true;
            }
            if (bookingState.time === time) {
                btn.classList.add('selected');
            }

            btn.addEventListener('click', function () {
                var slots = document.querySelectorAll('.time-slot');
                for (var s = 0; s < slots.length; s++) slots[s].classList.remove('selected');

                this.classList.add('selected');
                bookingState.time = this.textContent;
                document.getElementById('btn-next-2').disabled = false;
            });
            container.appendChild(btn);
        }
    }

    // פונקציית ניווט בין שלבים
    function showStep(stepNum) {
        var wizardSteps = document.querySelectorAll('.wizard-step');
        for (var i = 0; i < wizardSteps.length; i++) wizardSteps[i].classList.remove('active-step');
        document.getElementById('step-' + stepNum).classList.add('active-step');

        var steps = document.querySelectorAll('.step');
        for (var j = 0; j < steps.length; j++) steps[j].classList.remove('active');
        if (steps[stepNum - 1]) steps[stepNum - 1].classList.add('active');
    }

    // מעבר לשלב סיכום
    document.getElementById('btn-next-2').addEventListener('click', function () {
        var service = null;
        for (var i = 0; i < SERVICES.length; i++) {
            if (SERVICES[i].id === bookingState.serviceId) { service = SERVICES[i]; break; }
        }
        var staff = null;
        for (var j = 0; j < STAFF.length; j++) {
            if (STAFF[j].id === bookingState.staffId) { staff = STAFF[j]; break; }
        }

        document.getElementById('summary-service').textContent = service.name;
        document.getElementById('summary-staff').textContent = staff.name;
        document.getElementById('summary-date').textContent = bookingState.date;
        document.getElementById('summary-time').textContent = bookingState.time;
        document.getElementById('summary-name').textContent = bookingState.customerName;
        document.getElementById('summary-price').textContent = '₪' + service.price;

        showStep(3);
    });

    // כפתורי חזור
    document.getElementById('btn-prev-2').onclick = function () { showStep(1); };
    document.getElementById('btn-prev-3').onclick = function () { showStep(2); };

    // שליחה סופית
    document.getElementById('btn-submit').onclick = function () {
        appointmentManager.addAppointment(bookingState);
        document.getElementById('step-3').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        document.querySelector('.booking-progress').style.display = 'none';
    };
});
