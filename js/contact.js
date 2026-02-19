$('#contact-form').on('submit', function (e) {
    e.preventDefault();
    // Mock submission
    $(this).find('button').text('שולח...');
    setTimeout(() => {
        $(this).find('button').text('שלח הודעה');
        $('.success-message').fadeIn();
        this.reset();
    }, 1000);
});
