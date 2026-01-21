$(document).ready(function () {
    const container = $('#services-grid');

    function renderServices(category) {
        container.empty();
        const filtered = category === 'all' ? SERVICES : SERVICES.filter(s => s.category === category);

        filtered.forEach(service => {
            const card = `
                <article class="service-card">
                    <div class="service-image" style="background-image: url('${service.image}')"></div>
                    <div class="service-content">
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                        <div class="service-meta">
                            <span class="price">₪${service.price}</span>
                            <span class="duration">${service.durationMin} דק'</span>
                        </div>
                        <a href="booking.html?service=${service.id}" class="btn-outline">הזמיני תור</a>
                    </div>
                </article>
            `;
            container.append(card);
        });
    }

    // Initial render
    renderServices('all');

    // Filter logic
    $('.filter-btn').on('click', function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        renderServices($(this).data('filter'));
    });
});
