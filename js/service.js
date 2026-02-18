$(document).ready(function () {

    var container = $('#services-grid');

});
function renderServices(category) {
    container.empty();
}
for (var i = 0; i < SERVICES.length; i++) {
    var service = SERVICES[i];

    if (category === 'all' || service.category === category) {

    }
}
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

container.append(card);
renderServices('all');
