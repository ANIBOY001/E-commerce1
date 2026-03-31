// Product Data and Management
const products = {
    data: [
        {
            id: 1,
            name: "Midnight Oversized Tee",
            price: 49.99,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=80",
            category: "t-shirts",
            rating: 4.9,
            reviews: 128,
            description: "Premium oversized t-shirt with a relaxed fit. Made from 100% organic cotton for ultimate comfort.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "White", "Gray"],
            isNew: false,
            isSale: false
        },
        {
            id: 2,
            name: "Neo Street Hoodie",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80",
            category: "hoodies",
            rating: 4.8,
            reviews: 256,
            description: "Street-ready hoodie with premium fleece lining. Features embroidered logo and kangaroo pocket.",
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Black", "Purple", "Navy"],
            isNew: true,
            isSale: false
        },
        {
            id: 3,
            name: "Velocity Runner Pro",
            price: 159.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            category: "sneakers",
            rating: 4.9,
            reviews: 89,
            description: "High-performance sneakers with responsive cushioning. Perfect for urban exploration.",
            sizes: ["7", "8", "9", "10", "11", "12"],
            colors: ["Red/Black", "White", "Black"],
            isNew: false,
            isSale: true,
            salePrice: 129.99
        },
        {
            id: 4,
            name: "Urban Cargo Pants",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80",
            category: "pants",
            rating: 4.7,
            reviews: 167,
            description: "Tactical cargo pants with multiple pockets and adjustable cuffs. Street utility at its finest.",
            sizes: ["28", "30", "32", "34", "36"],
            colors: ["Black", "Olive", "Tan"],
            isNew: false,
            isSale: false
        },
        {
            id: 5,
            name: "Essential Tank Top",
            price: 34.99,
            image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
            category: "t-shirts",
            rating: 4.6,
            reviews: 94,
            description: "Minimalist tank top with breathable fabric. Perfect for layering or summer wear.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "White", "Gray", "Navy"],
            isNew: true,
            isSale: false
        },
        {
            id: 6,
            name: "Cyber Punk Jacket",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
            category: "jackets",
            rating: 4.8,
            reviews: 73,
            description: "Futuristic bomber jacket with reflective details. Water-resistant and windproof.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Silver"],
            isNew: true,
            isSale: false
        },
        {
            id: 7,
            name: "Air Flex Sneakers",
            price: 139.99,
            image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
            category: "sneakers",
            rating: 4.7,
            reviews: 142,
            description: "Lightweight sneakers with breathable mesh upper. All-day comfort guaranteed.",
            sizes: ["7", "8", "9", "10", "11", "12"],
            colors: ["Black/White", "All Black", "White/Gray"],
            isNew: false,
            isSale: true,
            salePrice: 109.99
        },
        {
            id: 8,
            name: "Graphic Street Tee",
            price: 54.99,
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80",
            category: "t-shirts",
            rating: 4.8,
            reviews: 203,
            description: "Bold graphic tee with original artwork. Premium print quality that lasts.",
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Black", "White"],
            isNew: true,
            isSale: false
        },
        {
            id: 9,
            name: "Tech Fleece Hoodie",
            price: 99.99,
            image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&auto=format&fit=crop&q=80",
            category: "hoodies",
            rating: 4.9,
            reviews: 312,
            description: "Advanced tech fleece with moisture-wicking properties. Athletic fit with premium finish.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Gray", "Navy"],
            isNew: false,
            isSale: false
        },
        {
            id: 10,
            name: "Retro High-Tops",
            price: 119.99,
            image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&auto=format&fit=crop&q=80",
            category: "sneakers",
            rating: 4.6,
            reviews: 87,
            description: "Classic high-top design with modern comfort. Iconic silhouette for any outfit.",
            sizes: ["7", "8", "9", "10", "11", "12"],
            colors: ["Black", "White", "Red"],
            isNew: false,
            isSale: true,
            salePrice: 89.99
        },
        {
            id: 11,
            name: "Cargo Joggers",
            price: 69.99,
            image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&auto=format&fit=crop&q=80",
            category: "pants",
            rating: 4.5,
            reviews: 156,
            description: "Comfortable cargo joggers with tapered fit. Perfect blend of style and utility.",
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Black", "Gray", "Olive"],
            isNew: true,
            isSale: false
        },
        {
            id: 12,
            name: "Statement Bomber",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
            category: "jackets",
            rating: 4.7,
            reviews: 98,
            description: "Classic bomber jacket with satin finish. Timeless style for any season.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Navy", "Green"],
            isNew: false,
            isSale: false
        }
    ],

    currentFilter: 'all',

    init() {
        this.render();
        this.renderNewArrivals();
    },

    getById(id) {
        return this.data.find(p => p.id === id);
    },

    getByCategory(category) {
        if (category === 'all') return this.data;
        return this.data.filter(p => p.category === category);
    },

    getNewArrivals() {
        return this.data.filter(p => p.isNew).slice(0, 4);
    },

    getSaleItems() {
        return this.data.filter(p => p.isSale);
    },

    filter(category) {
        this.currentFilter = category;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.classList.add('bg-accent-purple', 'text-white');
                btn.classList.remove('bg-dark-700');
            } else {
                btn.classList.remove('bg-accent-purple', 'text-white');
                btn.classList.add('bg-dark-700');
            }
        });
        
        this.render();
    },

    createProductCard(product) {
        const price = product.isSale 
            ? `<span class="text-accent-neon font-bold">$${product.salePrice.toFixed(2)}</span> <span class="text-gray-500 line-through text-sm">$${product.price.toFixed(2)}</span>`
            : `<span class="font-bold">$${product.price.toFixed(2)}</span>`;

        const badge = product.isNew 
            ? `<span class="absolute top-3 left-3 px-3 py-1 bg-accent-purple text-xs font-semibold rounded-full glow-badge">NEW</span>`
            : product.isSale
            ? `<span class="absolute top-3 left-3 px-3 py-1 bg-red-500 text-xs font-semibold rounded-full">SALE</span>`
            : '';

        // Generate star rating HTML
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        }
        if (hasHalfStar) {
            starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="url(#half)" stroke="#fbbf24" stroke-width="2"><defs><linearGradient id="half"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
        }

        return `
            <div class="product-card bg-dark-800 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-accent-purple/20 transition-all duration-300" data-product-id="${product.id}" onclick="products.trackView(${product.id}); ui.openQuickView(${product.id})">
                <div class="relative overflow-hidden aspect-square">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}"
                        class="product-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    >
                    ${badge}
                    ${product.stock && product.stock <= 5 ? `<span class="stock-badge">Only ${product.stock} left!</span>` : ''}
                    <div class="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                        <button onclick="event.stopPropagation(); ui.openQuickView(${product.id})" class="w-12 h-12 rounded-full bg-white text-dark-900 flex items-center justify-center hover:scale-110 transition-transform mobile-touch-target" aria-label="Quick view">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button onclick="event.stopPropagation(); wishlist.toggle(${product.id}); this.classList.toggle('text-red-500'); ui.sparkleWishlist(this)" class="w-12 h-12 rounded-full bg-white text-dark-900 flex items-center justify-center hover:scale-110 transition-transform mobile-touch-target ${wishlist.isInWishlist(product.id) ? 'text-red-500' : ''}" aria-label="Add to wishlist">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${wishlist.isInWishlist(product.id) ? '#ef4444' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        </button>
                    </div>
                </div>
                <div class="p-5">
                    <div class="flex items-center space-x-1 mb-2">
                        ${starsHtml}
                        <span class="text-sm text-gray-400 ml-1">${product.rating} (${product.reviews})</span>
                    </div>
                    <h3 class="font-semibold mb-2 group-hover:text-accent-purple transition-colors">${product.name}</h3>
                    <div class="flex items-center justify-between">
                        <div class="text-lg">${price}</div>
                        <button onclick="event.stopPropagation(); cart.addItem(${product.id})" class="w-10 h-10 rounded-full bg-dark-700 hover:bg-accent-purple flex items-center justify-center transition-colors mobile-touch-target" aria-label="Add to cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    render() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        const filtered = this.getByCategory(this.currentFilter);
        grid.innerHTML = filtered.map(p => this.createProductCard(p)).join('');
    },

    renderNewArrivals() {
        const grid = document.getElementById('newArrivalsGrid');
        if (!grid) return;

        const newArrivals = this.getNewArrivals();
        grid.innerHTML = newArrivals.map(p => this.createProductCard(p)).join('');
    },

    showQuickView(id) {
        ui.openQuickView(id);
    },

    // Track product views for recommendations
    trackView(productId) {
        let recentlyViewed = JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]');
        
        // Remove if already exists (to move to front)
        recentlyViewed = recentlyViewed.filter(id => id !== productId);
        
        // Add to front
        recentlyViewed.unshift(productId);
        
        // Keep only last 8
        recentlyViewed = recentlyViewed.slice(0, 8);
        
        localStorage.setItem('luxe_recently_viewed', JSON.stringify(recentlyViewed));
    },

    getRecentlyViewed() {
        const recentlyViewed = JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]');
        return recentlyViewed.map(id => this.getById(id)).filter(p => p);
    },

    getRecommendations(currentProductId) {
        const currentProduct = this.getById(currentProductId);
        if (!currentProduct) return [];
        
        // Get products from same category excluding current
        return this.data
            .filter(p => p.category === currentProduct.category && p.id !== currentProductId)
            .slice(0, 4);
    },

    renderRecentlyViewed() {
        const container = document.getElementById('recentlyViewedGrid');
        if (!container) return;
        
        const recent = this.getRecentlyViewed();
        
        if (recent.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        // Show section if hidden
        const section = document.getElementById('recentlyViewedSection');
        if (section) section.classList.remove('hidden');
        
        container.innerHTML = recent.map(p => this.createProductCard(p)).join('');
    }
};

// Wishlist functionality
const wishlist = {
    items: JSON.parse(localStorage.getItem('luxe_wishlist') || '[]'),

    toggle(id) {
        const index = this.items.indexOf(id);
        if (index > -1) {
            this.items.splice(index, 1);
            ui.showToast('Removed from wishlist');
        } else {
            this.items.push(id);
            ui.showToast('Added to wishlist');
        }
        this.save();
        this.updateCount();
    },

    isInWishlist(id) {
        return this.items.includes(id);
    },

    save() {
        localStorage.setItem('luxe_wishlist', JSON.stringify(this.items));
    },

    updateCount() {
        const count = document.getElementById('wishlistCount');
        if (count) {
            count.textContent = this.items.length;
            count.classList.toggle('hidden', this.items.length === 0);
        }
    },

    init() {
        this.updateCount();
    }
};
