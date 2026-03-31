// Cart System
const cart = {
    items: JSON.parse(localStorage.getItem('luxe_cart') || '[]'),

    init() {
        this.updateCount();
        this.render();
    },

    addItem(productId, quantity = 1, size = null, color = null) {
        const product = products.getById(productId);
        if (!product) return;

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
        ui.showToast(`${product.name} added to cart`);
    },

    removeItem(index) {
        this.items.splice(index, 1);
        this.save();
        this.updateCount();
        this.render();
    },

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
            return;
        }
        this.items[index].quantity = quantity;
        this.save();
        this.render();
    },

    clear() {
        this.items = [];
        this.save();
        this.updateCount();
        this.render();
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
    },

    open() {
        const overlay = document.getElementById('cartOverlay');
        const slideCart = document.getElementById('slideCart');
        if (overlay && slideCart) {
            overlay.classList.add('open');
            slideCart.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    },

    close() {
        const overlay = document.getElementById('cartOverlay');
        const slideCart = document.getElementById('slideCart');
        if (overlay && slideCart) {
            overlay.classList.remove('open');
            slideCart.classList.remove('open');
            document.body.style.overflow = '';
        }
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

    checkout() {
        if (this.items.length === 0) {
            ui.showToast('Your cart is empty');
            return;
        }
        
        // Simulate checkout
        ui.showToast('Proceeding to checkout...');
        setTimeout(() => {
            this.clear();
            this.close();
            alert('Thank you for your order! This is a demo checkout.');
        }, 1000);
    }
};
