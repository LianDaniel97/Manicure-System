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
