$(document).ready(function () {
    const appointmentManager = new AppointmentManager();
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedServiceId = urlParams.get('service');

    let bookingState = {
        serviceId: preSelectedServiceId || '',
        customerName: '',
        customerPhone: '',
        staffId: '',
        date: '',
        time: ''
    };

    // Initialize Service Dropdown
    const serviceSelect = $('#serviceSelect');
    SERVICES.forEach(s => {
        serviceSelect.append(new Option(s.name, s.id));
    });

    // Handle pre-selection
    if (bookingState.serviceId) {
        serviceSelect.val(bookingState.serviceId);
        updateServiceInfo(bookingState.serviceId);
    }

    // Event: Service Change
    serviceSelect.on('change', function () {
        const id = $(this).val();
        bookingState.serviceId = id;
        updateServiceInfo(id);
    });

    function updateServiceInfo(id) {
        const service = SERVICES.find(s => s.id === id);
        if (service) {
            $('#selected-service-info').html(`
                <strong>${service.name}</strong><br>
                ${service.description}<br>
                מחיר: ₪${service.price} | משך: ${service.durationMin} דק'
            `).show();
        } else {
            $('#selected-service-info').hide();
        }
    }

    // Step 1 -> 2
    $('#btn-next-1').on('click', function () {
        if (!validStep1()) {
            alert('אנא מלאי את כל הפרטים');
            return;
        }

        bookingState.customerName = $('#customerName').val();
        bookingState.customerPhone = $('#customerPhone').val();
        bookingState.serviceId = $('#serviceSelect').val();

        updateStaffOptions();

        // Show Step 2
        showStep(2);
    });

    function validStep1() {
        return $('#customerName').val() && $('#customerPhone').val() && $('#serviceSelect').val();
    }

    // Staff Logic
    function updateStaffOptions() {
        const staffSelect = $('#staffSelect');
        staffSelect.empty().append(new Option('בחר מטפלת...', ''));

        const relevantStaff = STAFF.filter(st => st.specialties.includes(bookingState.serviceId));

        relevantStaff.forEach(st => {
            staffSelect.append(new Option(st.name, st.id));
        });
    }

    // Date Logic
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    $('#dateSelect').attr('min', today);

    $('#staffSelect, #dateSelect').on('change', function () {
        bookingState.staffId = $('#staffSelect').val();
        bookingState.date = $('#dateSelect').val();

        if (bookingState.staffId && bookingState.date) {
            renderTimeSlots();
        }
    });

    function renderTimeSlots() {
        const container = $('#time-slots');
        container.empty();

        const staff = STAFF.find(s => s.id === bookingState.staffId);
        if (!staff) return;

        staff.availableHours.forEach(time => {
            const isAvailable = appointmentManager.isSlotAvailable(staff.id, bookingState.date, time);
            const btn = $(`<button type="button" class="time-slot" ${!isAvailable ? 'disabled' : ''}>${time}</button>`);

            if (bookingState.time === time) btn.addClass('selected');

            btn.click(function () {
                $('.time-slot').removeClass('selected');
                $(this).addClass('selected');
                bookingState.time = time;
                $('#selectedTime').val(time);
                $('#btn-next-2').removeAttr('disabled');
            });

            container.append(btn);
        });
    }

    // Step 2 -> 3
    $('#btn-next-2').on('click', function () {
        // Prepare Summary
        const service = SERVICES.find(s => s.id === bookingState.serviceId);
        const staff = STAFF.find(s => s.id === bookingState.staffId);

        $('#summary-service').text(service.name);
        $('#summary-staff').text(staff.name);
        $('#summary-date').text(bookingState.date);
        $('#summary-time').text(bookingState.time);
        $('#summary-name').text(bookingState.customerName);
        $('#summary-price').text('₪' + service.price);

        showStep(3);
    });

    // Navigation
    $('#btn-prev-2').click(() => showStep(1));
    $('#btn-prev-3').click(() => showStep(2));

    function showStep(stepNum) {
        $('.wizard-step').removeClass('active-step');
        $(`#step-${stepNum}`).addClass('active-step');

        $('.step').removeClass('active');
        $(`.step:nth-child(${stepNum})`).addClass('active');
    }

    // Final Submission
    $('#btn-submit').on('click', function () {
        const appointmentData = {
            serviceId: bookingState.serviceId,
            staffId: bookingState.staffId,
            date: bookingState.date,
            time: bookingState.time,
            customerName: bookingState.customerName,
            customerPhone: bookingState.customerPhone
        };

        appointmentManager.addAppointment(appointmentData);

        $('#step-3').hide();
        $('#success-message').show();
        $('.booking-progress').hide();
    });
});
