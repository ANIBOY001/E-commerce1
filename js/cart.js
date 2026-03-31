// Cart System with Firestore Sync
const cart = {
    items: JSON.parse(localStorage.getItem('luxe_cart') || '[]'),
    autoHideTimer: null,
    autoHideDuration: 10000, // 10 seconds
    isSyncing: false,

    init() {
        this.updateCount();
        this.render();
        this.setupCartInteractions();
    },

    setupCartInteractions() {
        const slideCart = document.getElementById('slideCart');
        if (slideCart) {
            // Reset auto-hide timer on interaction
            slideCart.addEventListener('mouseenter', () => this.cancelAutoHide());
            slideCart.addEventListener('mouseleave', () => this.startAutoHide());
            slideCart.addEventListener('click', () => this.resetAutoHide());
        }
    },

    async addItem(productId, quantity = 1, size = null, color = null) {
        const product = products.getById(productId);
        if (!product) return;

        // Check stock
        if (product.stock !== undefined && product.stock < quantity) {
            ui.showToast(`Only ${product.stock} items left in stock!`);
            return;
        }

        const existingItem = this.items.find(item => 
            item.id === productId && 
            item.size === size && 
            item.color === color
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                quantity: quantity,
                size: size,
                color: color,
                addedAt: Date.now()
            });
        }

        this.save();
        this.updateCount();
        this.render();
        
        // Sync to Firestore if logged in
        await this.syncToFirestore();
        
        ui.showToast(`${product.name} added to cart`);
        
        // Open cart drawer
        this.open();
    },

    async removeItem(index) {
        this.items.splice(index, 1);
        this.save();
        this.updateCount();
        this.render();
        await this.syncToFirestore();
    },

    async updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
            return;
        }

        const item = this.items[index];
        const product = products.getById(item.id);
        
        // Check stock limit
        if (product && product.stock !== undefined && quantity > product.stock) {
            ui.showToast(`Only ${product.stock} items available`);
            return;
        }

        this.items[index].quantity = quantity;
        this.save();
        this.render();
        await this.syncToFirestore();
    },

    async clear() {
        this.items = [];
        this.save();
        this.updateCount();
        this.render();
        await this.syncToFirestore();
    },

    // Sync to Firestore
    async syncToFirestore() {
        const userId = firebaseApp.getCurrentUserId();
        if (!userId || this.isSyncing) return;

        this.isSyncing = true;
        try {
            await dbHelpers.saveCart(userId, this.items);
        } catch (error) {
            console.error('Error syncing cart:', error);
        } finally {
            this.isSyncing = false;
        }
    },

    // Load from Firestore
    async syncFromFirestore() {
        const userId = firebaseApp.getCurrentUserId();
        if (!userId) return;

        try {
            const firestoreCart = await dbHelpers.getCart(userId);
            if (firestoreCart && firestoreCart.length > 0) {
                // Merge with local cart
                this.items = firestoreCart;
                this.save();
                this.updateCount();
                this.render();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    },

    getTotal() {
        return this.items.reduce((total, item) => {
            const product = products.getById(item.id);
            if (!product) return total;
            const price = product.isSale ? product.salePrice : product.price;
            return total + (price * item.quantity);
        }, 0);
    },

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },

    save() {
        localStorage.setItem('luxe_cart', JSON.stringify(this.items));
    },

    updateCount() {
        const count = document.getElementById('cartCount');
        if (count) {
            const itemCount = this.getItemCount();
            count.textContent = itemCount;
            count.classList.toggle('hidden', itemCount === 0);
        }
        this.updateCartPreview();
    },

    updateCartPreview() {
        const previewItems = document.getElementById('cartPreviewItems');
        const previewTotal = document.getElementById('cartPreviewTotal');
        
        if (!previewItems) return;

        if (this.items.length === 0) {
            previewItems.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">Your cart is empty</p>';
        } else {
            const recentItems = this.items.slice(0, 3);
            previewItems.innerHTML = recentItems.map(item => {
                const product = products.getById(item.id);
                if (!product) return '';
                return `
                    <div class="mini-cart-item">
                        <img src="${product.image}" alt="${product.name}" class="w-12 h-12 rounded-lg object-cover">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium truncate">${product.name}</p>
                            <p class="text-xs text-gray-400">Qty: ${item.quantity}</p>
                        </div>
                        <span class="text-sm font-semibold">$${((product.isSale ? product.salePrice : product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            }).join('');
            
            if (this.items.length > 3) {
                previewItems.innerHTML += `<p class="text-xs text-gray-500 text-center mt-3">+${this.items.length - 3} more items</p>`;
            }
        }

        if (previewTotal) {
            previewTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }
    },

    open() {
        const overlay = document.getElementById('cartOverlay');
        const slideCart = document.getElementById('slideCart');
        if (overlay && slideCart) {
            overlay.classList.add('open');
            slideCart.classList.add('open');
            document.body.style.overflow = 'hidden';
            this.render();
            this.startAutoHide();
        }
    },

    close() {
        const overlay = document.getElementById('cartOverlay');
        const slideCart = document.getElementById('slideCart');
        if (overlay && slideCart) {
            overlay.classList.remove('open');
            slideCart.classList.remove('open');
            document.body.style.overflow = '';
            this.cancelAutoHide();
        }
    },

    startAutoHide() {
        this.cancelAutoHide();
        const timerBar = document.getElementById('cartTimerBar');
        if (timerBar) {
            timerBar.style.transition = `width ${this.autoHideDuration}ms linear`;
            timerBar.style.width = '0%';
        }
        
        this.autoHideTimer = setTimeout(() => {
            this.close();
        }, this.autoHideDuration);
    },

    cancelAutoHide() {
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = null;
        }
        const timerBar = document.getElementById('cartTimerBar');
        if (timerBar) {
            timerBar.style.transition = 'none';
            timerBar.style.width = '100%';
        }
    },

    resetAutoHide() {
        const timerBar = document.getElementById('cartTimerBar');
        if (timerBar) {
            timerBar.style.transition = 'none';
            timerBar.style.width = '100%';
        }
        this.startAutoHide();
    },

    render() {
        const container = document.getElementById('cartItems');
        const subtotalEl = document.getElementById('cartSubtotal');
        
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center">
                    <div class="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </div>
                    <p class="text-gray-400 mb-2">Your cart is empty</p>
                    <button onclick="cart.close()" class="text-accent-purple hover:underline text-sm">Continue Shopping</button>
                </div>
            `;
        } else {
            container.innerHTML = this.items.map((item, index) => {
                const product = products.getById(item.id);
                if (!product) return '';
                
                const price = product.isSale ? product.salePrice : product.price;
                const total = price * item.quantity;
                
                return `
                    <div class="flex gap-4 mb-6 pb-6 border-b border-white/10">
                        <img src="${product.image}" alt="${product.name}" class="w-20 h-20 rounded-xl object-cover">
                        <div class="flex-1">
                            <h4 class="font-semibold mb-1">${product.name}</h4>
                            <p class="text-sm text-gray-400 mb-2">$${price.toFixed(2)}</p>
                            ${item.size ? `<p class="text-xs text-gray-500 mb-2">Size: ${item.size}</p>` : ''}
                            ${item.color ? `<p class="text-xs text-gray-500 mb-2">Color: ${item.color}</p>` : ''}
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2 bg-dark-700 rounded-full px-3 py-1">
                                    <button onclick="cart.updateQuantity(${index}, ${item.quantity - 1})" class="text-gray-400 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                                    </button>
                                    <span class="text-sm w-6 text-center">${item.quantity}</span>
                                    <button onclick="cart.updateQuantity(${index}, ${item.quantity + 1})" class="text-gray-400 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                    </button>
                                </div>
                                <span class="font-semibold">$${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button onclick="cart.removeItem(${index})" class="text-gray-400 hover:text-red-400 self-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                `;
            }).join('');
        }

        if (subtotalEl) {
            subtotalEl.textContent = `$${this.getTotal().toFixed(2)}`;
        }
    },

    async checkout() {
        if (this.items.length === 0) {
            ui.showToast('Your cart is empty');
            return;
        }

        // Check if user is logged in
        if (!firebaseApp.isLoggedIn()) {
            ui.showToast('Please sign in to checkout');
            ui.openAuthModal();
            return;
        }

        // Navigate to checkout page
        window.location.href = 'checkout.html';
    }
};
