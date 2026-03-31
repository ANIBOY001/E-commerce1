// Main Application Initialization
const app = {
    init() {
        // Load dark mode preference
        const savedDarkMode = localStorage.getItem('luxe_darkmode');
        if (savedDarkMode !== null) {
            ui.isDarkMode = savedDarkMode === 'true';
            document.documentElement.classList.toggle('dark', ui.isDarkMode);
        }

        // Initialize all modules
        products.init();
        cart.init();
        wishlist.init();
        filters.init();
        carousel.init();
        ui.init();
        search.init();

        // Initialize tilt effects on category cards
        document.querySelectorAll('.tilt-card').forEach(card => {
            ui.initTiltEffect(card);
        });

        // Initialize lazy loading for images
        this.initLazyLoading();

        console.log('LUXE E-commerce with advanced UI initialized successfully');
    },

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
