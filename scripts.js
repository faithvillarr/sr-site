
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('top-nav');
    const endCard = document.querySelector('.end-card');
    
    function checkNavVisibility() {
        if (endCard) {
            const rect = endCard.getBoundingClientRect();
            const isEndCardVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
            
            if (isEndCardVisible) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
        }
    }

    window.addEventListener('scroll', checkNavVisibility);
    // Check initial visibility
    checkNavVisibility();
});