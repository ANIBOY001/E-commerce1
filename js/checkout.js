// Checkout System with Stripe Integration
const checkout = {
    stripe: null,
    cardElement: null,
    discount: 0,

    async init() {
        this.renderCartItems();
        this.calculateTotals();
        this.setupStripe();
        this.prefillUserData();
    },

    setupStripe() {
        // Initialize Stripe with your publishable key
        this.stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');
        const elements = this.stripe.elements();
        
        // Create card element
        this.cardElement = elements.create('card', {
            style: {
                base: {
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#666666'
                    }
                },
                invalid: {
                    color: '#ef4444'
                }
            }
        });

        this.cardElement.mount('#stripeCardElement');
        
        this.cardElement.on('change', (event) => {
            if (event.error) {
                ui.showToast(event.error.message);
            }
        });
    },

    prefillUserData() {
        const user = firebaseApp.currentUser;
        if (user) {
            document.getElementById('checkoutEmail').value = user.email || '';
        }
    },

    renderCartItems() {
        const container = document.getElementById('checkoutItems');
        if (!container) return;

        if (cart.items.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-8">Your cart is empty</p>';
            return;
        }

        container.innerHTML = cart.items.map(item => {
            const product = products.getById(item.id);
            if (!product) return '';
            
            const price = product.isSale ? product.salePrice : product.price;
            
            return `
                <div class="flex gap-4">
                    <img src="${product.image}" alt="${product.name}" class="w-20 h-20 rounded-xl object-cover">
                    <div class="flex-1">
                        <h4 class="font-semibold">${product.name}</h4>
                        ${item.size ? `<p class="text-xs text-gray-400">Size: ${item.size}</p>` : ''}
                        ${item.color ? `<p class="text-xs text-gray-400">Color: ${item.color}</p>` : ''}
                        <p class="text-sm text-gray-400">Qty: ${item.quantity}</p>
                    </div>
                    <span class="font-semibold">$${(price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        }).join('');
    },

    calculateTotals() {
        const subtotal = cart.getTotal();
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.08; // 8% tax
        const discountAmount = subtotal * (this.discount / 100);
        const total = subtotal + shipping + tax - discountAmount;

        document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;

        if (discountAmount > 0) {
            document.getElementById('discountRow').classList.remove('hidden');
            document.getElementById('checkoutDiscount').textContent = `-$${discountAmount.toFixed(2)}`;
        }
    },

    applyPromo() {
        const code = document.getElementById('promoCode').value.trim().toUpperCase();
        const validCodes = {
            'WELCOME10': 10,
            'LUXE20': 20,
            'FREESHIP': 0 // Special handling for free shipping
        };

        if (validCodes[code] !== undefined) {
            if (code === 'FREESHIP') {
                document.getElementById('checkoutShipping').textContent = 'Free';
                ui.showToast('Free shipping applied!');
            } else {
                this.discount = validCodes[code];
                ui.showToast(`${this.discount}% discount applied!`);
            }
            this.calculateTotals();
        } else {
            ui.showToast('Invalid promo code');
        }
    },

    async processPayment() {
        // Validate form
        const requiredFields = ['checkoutEmail', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone'];
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                ui.showToast(`Please fill in all required fields`);
                field?.focus();
                return;
            }
        }

        // Check if user is logged in
        if (!firebaseApp.isLoggedIn()) {
            ui.showToast('Please sign in to complete your order');
            ui.openAuthModal();
            return;
        }

        // Show loading
        document.getElementById('checkoutLoading').classList.remove('hidden');

        try {
            // Create payment method
            const {paymentMethod, error} = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement,
                billing_details: {
                    name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                    email: document.getElementById('checkoutEmail').value,
                    phone: document.getElementById('phone').value,
                    address: {
                        line1: document.getElementById('address').value,
                        line2: document.getElementById('apartment').value,
                        city: document.getElementById('city').value,
                        state: document.getElementById('state').value,
                        postal_code: document.getElementById('zip').value,
                        country: document.getElementById('country').value
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            // Calculate totals
            const subtotal = cart.getTotal();
            const shipping = subtotal > 100 ? 0 : 10;
            const tax = subtotal * 0.08;
            const discountAmount = subtotal * (this.discount / 100);
            const total = subtotal + shipping + tax - discountAmount;

            // Create order in Firestore
            const orderData = {
                items: cart.items,
                subtotal: subtotal,
                shipping: shipping,
                tax: tax,
                discount: discountAmount,
                total: total,
                shippingAddress: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    address: document.getElementById('address').value,
                    apartment: document.getElementById('apartment').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value,
                    country: document.getElementById('country').value,
                    phone: document.getElementById('phone').value
                },
                paymentMethodId: paymentMethod.id,
                status: 'pending'
            };

            // Create order
            const orderId = await dbHelpers.createOrder(firebaseApp.getCurrentUserId(), orderData);

            // Update stock for each item
            for (const item of cart.items) {
                await dbHelpers.updateStock(item.id, item.quantity);
            }

            // Clear cart
            await cart.clear();

            // Redirect to success page
            window.location.href = `order-success.html?orderId=${orderId}`;

        } catch (error) {
            console.error('Payment error:', error);
            ui.showToast('Payment failed: ' + error.message);
        } finally {
            document.getElementById('checkoutLoading').classList.add('hidden');
        }
    }
};
