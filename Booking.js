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