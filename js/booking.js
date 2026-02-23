document.addEventListener('DOMContentLoaded', function () {
    var appointmentManager = new AppointmentManager();
   
    //פקודה שאומרת ל-JS: "לך לכתובת האתר למעלה"
    //ותסתכל רק על מה שכתוב אחרי סימן השאלה
    const urlParams = new URLSearchParams(window.location.search);

    //urlParams.get('service'): "תנסה למצוא בכתובת למעלה משהו שנקרא service
    //אם לא מצאת כלום בכתובת
    //נסה ללכת למחסן של הדפדפן (localStorage) ותבדוק אם שמרנו שם משהו קודם"
    let preSelectedServiceId = urlParams.get('service') || localStorage.getItem('selectedService');
    
    //נשמור פה את הפרטים של הטיפול של הלקוחה
    var bookingState = {
        serviceId: preSelectedServiceId || '',
        customerName: '',
        customerPhone: '',
        staffId: '',
        date: '',
        time: ''
    };
    
    //למחוק מלוקל סטורג את מה שנבחר כדי שלא ישמר לעתיד
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

        //מייצר את רשימת השירותים שהלקוחה רואה
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

        //
    if (bookingState.serviceId && serviceSelect) {
        serviceSelect.value = bookingState.serviceId;
        //מעדכנת את הטקסט על המסך (מחיר, משך זמן וכו').
        updateServiceInfo(bookingState.serviceId);
    }

    if (serviceSelect) {
        serviceSelect.addEventListener('change', function () {
            var id = this.value;
            bookingState.serviceId = id;
            updateServiceInfo(id);
        });
    }

    //אם הלקוחה שינתה טיפול
    function updateServiceInfo(id) {
        var service = null;
        for (var i = 0; i < SERVICES.length; i++) {
            if (SERVICES[i].id === id) {
                service = SERVICES[i];
                break;
            }
        }

        //מציג את הנתונים על הטיפול
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

    //בדיקה שכל הנתונים הוזנו כראוי
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

            //נעדכן ב'כרטיס' של הלקוחה
            bookingState.customerName = name;
            bookingState.customerPhone = phone;
            bookingState.serviceId = serviceId;

            updateStaffOptions();
            showStep(2);
        });
    }
    //בודקת מי מהמטפלות מבצעת טיפול מסוים
        function updateStaffOptions() {
        var staffSelect = document.getElementById('staffSelect'); //מחפש את הדרופ דאון של המטםלת
        if (!staffSelect) return;


        staffSelect.innerHTML = '<option value="">בחר מטפלת...</option>'; //מאפס את הרשימה, מבטיח שאם שינית טיפול, לא יופיעו מטפלות שלא קשורות

        for (var i = 0; i < STAFF.length; i++) { //עוברים על המטפלות
            var st = STAFF[i];
            var isSpecialist = false;
            for (var j = 0; j < st.specialties.length; j++) {
                if (st.specialties[j] === bookingState.serviceId) { //בודק אם ההתמחות של המטפלת הוא מה שהלקוחה בחרה
                    isSpecialist = true;
                    break;
                }
            }
            //אם כן, נוסיף את המטפלת
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
        dateInput.min = new Date().toISOString().split('T')[0]; //תאריך מינימלי היום

        var staffSelect = document.getElementById('staffSelect');//מחפש תיבת בחירת מטפלת
        // מעדכן בזיכרון את ה-ID של המטפלת שנבחרה. והתאריך
        var handleChange = function () {
            bookingState.staffId = staffSelect.value;
            bookingState.date = dateInput.value;
            if (bookingState.staffId && bookingState.date) {  //בודק שהבוקינגסטייט עודכן 
                renderTimeSlots();
            }
        };
        dateInput.addEventListener('change', handleChange); //מוסיף "מאזין" לשדה התאריך. ברגע שהלקוחה בוחרת תאריך, הפונקציה handleChange מופעלת.
        staffSelect.addEventListener('change', handleChange); //מוסיף "מאזין" לשדה המטפלת. ברגע שהלקוחה בוחרת מטפלת, הפונקציה handleChange מופעלת.
    }

    function renderTimeSlots() {    //בודקת מי המטפלת שנבחרה ושולפת עבורה את רשימת השעות
        var container = document.getElementById('time-slots'); //הדיב שיהיו בתוכו הזמנים
        if (!container) return;
        container.innerHTML = '';

        var staff = null; //נשמור בו את המידע  על המטפלת
        for (var i = 0; i < STAFF.length; i++) {
            if (STAFF[i].id === bookingState.staffId) { // "האם ה-ID של המטפלת בלולאה כרגע הוא בדיוק המטפלת שהלקוחה בחרה בטופס?"
                staff = STAFF[i];
                break;
            }
        }
        if (!staff) return;

        for (var k = 0; k < staff.availableHours.length; k++) {
            var time = staff.availableHours[k];
            var isAvailable = appointmentManager.isSlotAvailable(staff.id, bookingState.date, time); //המערכת פונה למנהל התורים ושואלת: "האם המטפלת הזו פנויה בתאריך הזה ובשעה הזו?"

            var btn = document.createElement('button'); //עבור כל שעה, אנחנו מייצרים כפתור חדש ב-HTML.
            btn.type = 'button';
            btn.className = 'time-slot';
            btn.textContent = time; //מציגים על הכפתור את השעה

            if (!isAvailable) {
                btn.disabled = true; //אם השעה תפוסה הכפתור יהיה דיסאייבל
            }
            if (bookingState.time === time) {
                btn.classList.add('selected'); //אם בחרה אותו זה יוצג לה
            }

            btn.addEventListener('click', function () {  //כשנלחצת שעה
                var slots = document.querySelectorAll('.time-slot'); // מציג את הכפתורים בקלאס הזה
                for (var s = 0; s < slots.length; s++) slots[s].classList.remove('selected'); // עוברים על הכפתורים ומבטלים את הסימון  

                this.classList.add('selected'); //נסמן אותו במודגש כי נבחר
                bookingState.time = this.textContent; //נשמור את השעה שעל הכפתור
                document.getElementById('btn-next-2').disabled = false;//לאחר שנבחרה שעה אפשר להתקדם 
            });
            container.appendChild(btn); //מוסיף את הכפתור
        }
    }
    
    function showStep(stepNum) {
        var wizardSteps = document.querySelectorAll('.wizard-step');
        for (var i = 0; i < wizardSteps.length; i++) wizardSteps[i].classList.remove('active-step'); //מוריד את השלב הקודם מהמסך
        document.getElementById('step-' + stepNum).classList.add('active-step'); //ציג את השלב הרלוונטי

        var steps = document.querySelectorAll('.step'); //מעדכן את הפס למעלה 
        for (var j = 0; j < steps.length; j++) steps[j].classList.remove('active'); //הופך ללא פעיל שלבין אחרים
        if (steps[stepNum - 1]) steps[stepNum - 1].classList.add('active'); //הופך לפעיל שלב רלוונטי
    }

    document.getElementById('btn-next-2').addEventListener('click', function () { //מחכה שילחץ נקסט בשלב 2
        var service = null;
        for (var i = 0; i < SERVICES.length; i++) {     //עובר על מערך השירותים
            if (SERVICES[i].id === bookingState.serviceId) { service = SERVICES[i]; break; } //שומר את הטיפול
        }
        var staff = null;
        for (var j = 0; j < STAFF.length; j++) {
            if (STAFF[j].id === bookingState.staffId) { staff = STAFF[j]; break; } //שומר את המטפלת
        }
        //הזרקת הנתונים לסיכום
        document.getElementById('summary-service').textContent = service.name;
        document.getElementById('summary-staff').textContent = staff.name;
        document.getElementById('summary-date').textContent = bookingState.date;
        document.getElementById('summary-time').textContent = bookingState.time;
        document.getElementById('summary-name').textContent = bookingState.customerName;
        document.getElementById('summary-price').textContent = '₪' + service.price;
3
        showStep(3);
    });

    document.getElementById('btn-prev-2').onclick = function () { showStep(1); }; //אם נמצאת בשלב 2 ולוחצת על חזור, מציג את שלב 1
    document.getElementById('btn-prev-3').onclick = function () { showStep(2); };


    document.getElementById('btn-submit').onclick = function () { //כשילחץ הסיום
        appointmentManager.addAppointment(bookingState); //מכניס למחלקה את כל מה ששמרנו
        document.getElementById('step-3').style.display = 'none'; //מסתירים את שלב הסיכום
        document.getElementById('success-message').style.display = 'block'; //מציגים הודעת סיום
        document.querySelector('.booking-progress').style.display = 'none'; //מסתיר את הפס עם המספרים
    };
});
