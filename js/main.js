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

        // Render personalized sections
        products.renderRecentlyViewed();
        this.renderRecommendations();

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
    },

    renderRecommendations() {
        const container = document.getElementById('recommendationsGrid');
        if (!container) return;

        // Get recently viewed products for personalization
        const recentlyViewed = products.getRecentlyViewed();
        
        let recommendations = [];
        
        if (recentlyViewed.length > 0) {
            // Get recommendations based on most recent view
            recommendations = products.getRecommendations(recentlyViewed[0].id);
        }
        
        // Fallback to trending products if no recommendations
        if (recommendations.length === 0) {
            recommendations = products.data
                .filter(p => p.rating >= 4.8)
                .slice(0, 4);
        }

        container.innerHTML = recommendations.map(p => products.createProductCard(p)).join('');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
