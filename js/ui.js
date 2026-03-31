// UI Utilities and Interactions
const ui = {
    isDarkMode: true,

    init() {
        this.initScrollAnimations();
        this.initStickyHeader();
        this.initSmoothScroll();
        lucide.createIcons();
    },

    // Mobile Menu
    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    },

    // Dark Mode Toggle
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.documentElement.classList.toggle('dark', this.isDarkMode);
        localStorage.setItem('luxe_darkmode', this.isDarkMode);
        lucide.createIcons();
    },

    // Quick View Modal
    openQuickView(productId) {
        const product = products.getById(productId);
        if (!product) return;

        const modal = document.getElementById('quickViewModal');
        const content = document.getElementById('quickViewContent');
        
        if (!modal || !content) return;

        const price = product.isSale 
            ? `<span class="text-3xl font-bold text-accent-neon">$${product.salePrice.toFixed(2)}</span> <span class="text-xl text-gray-500 line-through">$${product.price.toFixed(2)}</span>`
            : `<span class="text-3xl font-bold">$${product.price.toFixed(2)}</span>`;

        const badge = product.isNew 
            ? `<span class="px-3 py-1 bg-accent-purple text-sm font-semibold rounded-full">NEW</span>`
            : product.isSale
            ? `<span class="px-3 py-1 bg-red-500 text-sm font-semibold rounded-full">SALE</span>`
            : '';

        const sizesHtml = product.sizes.map(size => 
            `<button class="size-btn w-12 h-12 rounded-lg border border-white/20 hover:border-accent-purple hover:bg-accent-purple/10 transition-colors text-sm font-medium" data-size="${size}">${size}</button>`
        ).join('');

        const colorsHtml = product.colors.map(color => 
            `<button class="color-btn px-4 py-2 rounded-lg border border-white/20 hover:border-accent-purple hover:bg-accent-purple/10 transition-colors text-sm font-medium" data-color="${color}">${color}</button>`
        ).join('');

        content.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8">
                <div class="zoom-container rounded-2xl overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="zoom-image w-full h-[400px] object-cover">
                </div>
                <div class="space-y-6">
                    <div class="flex items-center gap-3">
                        ${badge}
                        <div class="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span class="text-sm text-gray-400">${product.rating} (${product.reviews} reviews)</span>
                        </div>
                    </div>
                    <h2 class="text-3xl font-display font-bold">${product.name}</h2>
                    <div class="flex items-center gap-4">
                        ${price}
                    </div>
                    <p class="text-gray-400">${product.description}</p>
                    <div>
                        <label class="block text-sm font-medium mb-3">Size</label>
                        <div class="flex flex-wrap gap-2">${sizesHtml}</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-3">Color</label>
                        <div class="flex flex-wrap gap-2">${colorsHtml}</div>
                    </div>
                    <div class="flex items-center space-x-4 pt-4">
                        <div class="flex items-center space-x-2 bg-dark-700 rounded-full px-4 py-2">
                            <button onclick="ui.updateQuickViewQty(-1)" class="text-gray-400 hover:text-white p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                            </button>
                            <span id="quickViewQty" class="text-lg w-8 text-center">1</span>
                            <button onclick="ui.updateQuickViewQty(1)" class="text-gray-400 hover:text-white p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            </button>
                        </div>
                        <button onclick="ui.addToCartFromQuickView(${product.id})" class="btn-gradient flex-1 py-3 rounded-full font-semibold">
                            Add to Cart
                        </button>
                        <button onclick="wishlist.toggle(${product.id})" class="w-12 h-12 rounded-full border border-white/20 hover:border-accent-purple hover:bg-accent-purple/10 flex items-center justify-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        </button>
                    </div>
                    <div class="flex items-center space-x-6 text-sm text-gray-400 pt-4 border-t border-white/10">
                        <span class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            <span>Free shipping over $100</span>
                        </span>
                        <span class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            <span>Delivered in 3-5 days</span>
                        </span>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Initialize size/color selection
        this.initQuickViewSelection();
    },

    closeQuickView() {
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    },

    quickViewQty: 1,

    updateQuickViewQty(delta) {
        this.quickViewQty = Math.max(1, this.quickViewQty + delta);
        const qtyEl = document.getElementById('quickViewQty');
        if (qtyEl) qtyEl.textContent = this.quickViewQty;
    },

    selectedSize: null,
    selectedColor: null,

    initQuickViewSelection() {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.size-btn').forEach(b => {
                    b.classList.remove('bg-accent-purple', 'border-accent-purple');
                    b.classList.add('border-white/20');
                });
                btn.classList.add('bg-accent-purple', 'border-accent-purple');
                btn.classList.remove('border-white/20');
                this.selectedSize = btn.dataset.size;
            });
        });

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => {
                    b.classList.remove('bg-accent-purple', 'border-accent-purple');
                    b.classList.add('border-white/20');
                });
                btn.classList.add('bg-accent-purple', 'border-accent-purple');
                btn.classList.remove('border-white/20');
                this.selectedColor = btn.dataset.color;
            });
        });
    },

    addToCartFromQuickView(productId) {
        cart.addItem(productId, this.quickViewQty, this.selectedSize, this.selectedColor);
        this.quickViewQty = 1;
        this.selectedSize = null;
        this.selectedColor = null;
        this.closeQuickView();
    },

    // Toast Notifications
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast glass px-6 py-4 rounded-xl flex items-center space-x-3 shadow-2xl`;
        toast.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span class="font-medium">${message}</span>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    },

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            observer.observe(section);
        });
    },

    // Sticky Header
    initStickyHeader() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('glass');
            } else {
                navbar.classList.remove('glass');
            }
            
            lastScroll = currentScroll;
        });
    },

    // Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// Initialize Lucide icons on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
