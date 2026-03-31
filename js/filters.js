// Advanced Filter System
const filters = {
    categories: [],
    colors: [],
    sizes: [],
    maxPrice: 200,
    isOpen: false,

    init() {
        this.loadFromStorage();
    },

    open() {
        const sidebar = document.getElementById('filterSidebar');
        const overlay = document.getElementById('filterOverlay');
        if (sidebar && overlay) {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }
    },

    close() {
        const sidebar = document.getElementById('filterSidebar');
        const overlay = document.getElementById('filterOverlay');
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    },

    toggleCategory(category) {
        const index = this.categories.indexOf(category);
        if (index > -1) {
            this.categories.splice(index, 1);
        } else {
            this.categories.push(category);
        }
        this.saveToStorage();
        this.apply();
    },

    toggleColor(color) {
        const index = this.colors.indexOf(color);
        const swatch = document.querySelector(`[data-color="${color}"]`);
        
        if (index > -1) {
            this.colors.splice(index, 1);
            swatch?.classList.remove('active');
        } else {
            this.colors.push(color);
            swatch?.classList.add('active');
        }
        this.saveToStorage();
    },

    toggleSize(size) {
        const index = this.sizes.indexOf(size);
        const btn = document.querySelector(`[data-size="${size}"]`);
        
        if (index > -1) {
            this.sizes.splice(index, 1);
            btn?.classList.remove('active');
        } else {
            this.sizes.push(size);
            btn?.classList.add('active');
        }
        this.saveToStorage();
    },

    updatePrice(value) {
        this.maxPrice = parseInt(value);
        const priceDisplay = document.getElementById('priceValue');
        if (priceDisplay) {
            priceDisplay.textContent = `$${value}`;
        }
        this.saveToStorage();
    },

    apply() {
        let filtered = [...products.data];

        // Filter by categories
        if (this.categories.length > 0 && !this.categories.includes('all')) {
            filtered = filtered.filter(p => this.categories.includes(p.category));
        }

        // Filter by price
        filtered = filtered.filter(p => {
            const price = p.isSale ? p.salePrice : p.price;
            return price <= this.maxPrice;
        });

        // Filter by colors
        if (this.colors.length > 0) {
            filtered = filtered.filter(p => 
                p.colors.some(c => this.colors.includes(c))
            );
        }

        // Filter by sizes
        if (this.sizes.length > 0) {
            filtered = filtered.filter(p => 
                p.sizes.some(s => this.sizes.includes(s))
            );
        }

        // Update the grid
        const grid = document.getElementById('productsGrid');
        if (grid) {
            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-500">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">No products found</h3>
                        <p class="text-gray-400 mb-4">Try adjusting your filters</p>
                        <button onclick="filters.reset()" class="btn-gradient px-6 py-3 rounded-full">Reset Filters</button>
                    </div>
                `;
            } else {
                grid.innerHTML = filtered.map(p => products.createProductCard(p)).join('');
            }
        }

        this.close();
        ui.showToast(`${filtered.length} products found`);
    },

    reset() {
        this.categories = [];
        this.colors = [];
        this.sizes = [];
        this.maxPrice = 200;

        // Reset UI
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = 200;
            document.getElementById('priceValue').textContent = '$200';
        }

        this.saveToStorage();
        products.render();
        this.close();
        ui.showToast('Filters reset');
    },

    saveToStorage() {
        localStorage.setItem('luxe_filters', JSON.stringify({
            categories: this.categories,
            colors: this.colors,
            sizes: this.sizes,
            maxPrice: this.maxPrice
        }));
    },

    loadFromStorage() {
        const saved = localStorage.getItem('luxe_filters');
        if (saved) {
            const data = JSON.parse(saved);
            this.categories = data.categories || [];
            this.colors = data.colors || [];
            this.sizes = data.sizes || [];
            this.maxPrice = data.maxPrice || 200;
        }
    }
};
