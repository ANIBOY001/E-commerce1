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
        ui.init();
        search.init();

        console.log('LUXE E-commerce initialized successfully');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
