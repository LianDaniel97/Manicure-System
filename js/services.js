
$(document).ready(function () {
    // בחירת הקונטיינר שבו יופיעו השירותים (מצגת 10)
    var container = $('#services-grid');

    // פונקציית הרינדור - השם נשאר זהה כדי לא לפגוע בדפים אחרים
    function renderServices(category) {
        // ניקוי התוכן הקיים (מצגת 10)
        container.empty();

        // שימוש בלולאת for קלאסית כפי שנלמד במצגת 8 (עמוד 29)
        // אנחנו עוברים על המערך SERVICES שמוגדר בקובץ הדאטה שלך
        for (var i = 0; i < SERVICES.length; i++) {
            var service = SERVICES[i];

            // לוגיקת הסינון (מצגת 8)
            if (category === 'all' || service.category === category) {

                // בניית כרטיס השירות באמצעות שרשור מחרוזות (מצגת 10, עמוד 15)
                // התאמנו את שמות השדות (service.name, service.price וכו') בדיוק לדאטה שלך
                var card = '<article class="service-card">' +
                    '<div class="service-image" style="background-image: url(\'' + service.image + '\')"></div>' +
                    '<div class="service-content">' +
                    '<h3>' + service.name + '</h3>' +
                    '<p>' + service.description + '</p>' +
                    '<div class="service-meta">' +
                    '<span class="price">₪' + service.price + '</span>' +
                    '<span class="duration">' + service.durationMin + ' דק\'</span>' +
                    '</div>' +
                    '<a href="booking.html?service=' + service.id + '" class="btn-outline">הזמיני תור</a>' +
                    '</div>' +
                    '</article>';

                // הזרקת הכרטיס לקונטיינר
                container.append(card);
            }
        }
    }

    // הצגת כל השירותים בטעינה ראשונית
    renderServices('all');

    // ניהול אירועי לחיצה על כפתורי הסינון (מצגת 10)
    $('.filter-btn').on('click', function () {
        // עיצוב כפתור פעיל (מצגת 10 - addClass/removeClass)
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        // שליפת הקטגוריה מה-Attribute של ה-HTML
        var selectedCategory = $(this).attr('data-filter');

        // קריאה לפונקציה עם הקטגוריה שנבחרה
        renderServices(selectedCategory);
    });
});