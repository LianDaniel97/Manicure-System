document.addEventListener('DOMContentLoaded', function () {
    var appointmentManager = new AppointmentManager();
   
    var preSelectedServiceId = localStorage.getItem('selectedService');

    var bookingState = {
        serviceId: preSelectedServiceId || '',
        customerName: '',
        customerPhone: '',
        staffId: '',
        date: '',
        time: ''
    };
    
    localStorage.removeItem('selectedService');

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
    
     var dateInput = document.getElementById('dateSelect');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];

        var staffSelect = document.getElementById('staffSelect');
        var handleChange = function () {
            bookingState.staffId = staffSelect.value;
            bookingState.date = dateInput.value;
            if (bookingState.staffId && bookingState.date) {
                renderTimeSlots();
            }
        };
        dateInput.addEventListener('change', handleChange);
        staffSelect.addEventListener('change', handleChange);
    }