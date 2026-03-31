// Firebase Configuration and Initialization
const firebaseConfig = {
    apiKey: "AIzaSyCrY9kwRv3wVyA1qnPBU5HEAwjqQKqLPOw",
    authDomain: "luxe-92795.firebaseapp.com",
    projectId: "luxe-92795",
    storageBucket: "luxe-92795.firebasestorage.app",
    messagingSenderId: "986726380864",
    appId: "1:986726380864:web:a25c519b05b3cf23b636a5",
    measurementId: "G-9F8DNLY55V"
};

// Initialize Firebase
let app, auth, db, analytics;

const firebaseApp = {
    isInitialized: false,
    currentUser: null,

    init() {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded. Loading from CDN...');
            this.loadFirebaseSDK().then(() => this.initialize());
        } else {
            this.initialize();
        }
    },

    loadFirebaseSDK() {
        return new Promise((resolve) => {
            const scripts = [
                'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
                'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
                'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js',
                'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js'
            ];

            let loaded = 0;
            scripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    loaded++;
                    if (loaded === scripts.length) resolve();
                };
                document.head.appendChild(script);
            });
        });
    },

    initialize() {
        try {
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            analytics = firebase.analytics();

            this.isInitialized = true;
            console.log('Firebase initialized successfully');

            // Auth state listener
            auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.updateUI(user);
                if (user) {
                    console.log('User logged in:', user.email);
                    cart.syncFromFirestore();
                    wishlist.syncFromFirestore();
                } else {
                    console.log('User logged out');
                }
            });

        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    },

    updateUI(user) {
        const authBtn = document.getElementById('authBtn');
        const userMenu = document.getElementById('userMenu');
        
        if (authBtn) {
            if (user) {
                authBtn.innerHTML = `
                    <img src="${user.photoURL || 'https://via.placeholder.com/32'}" 
                         class="w-8 h-8 rounded-full border-2 border-accent-purple"
                         alt="${user.displayName || 'User'}">
                `;
                authBtn.onclick = () => this.toggleUserMenu();
            } else {
                authBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                `;
                authBtn.onclick = () => ui.openAuthModal();
            }
        }
    },

    toggleUserMenu() {
        const menu = document.getElementById('userMenu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    },

    // Google Sign In
    async signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            ui.showToast(`Welcome, ${result.user.displayName}!`);
            ui.closeAuthModal();
            return result.user;
        } catch (error) {
            console.error('Google sign-in error:', error);
            ui.showToast('Sign-in failed: ' + error.message);
            throw error;
        }
    },

    // Email/Password Sign Up
    async signUpWithEmail(email, password, name) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await result.user.updateProfile({ displayName: name });
            
            // Create user document in Firestore
            await db.collection('users').doc(result.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                cart: [],
                wishlist: [],
                orders: []
            });

            ui.showToast('Account created successfully!');
            ui.closeAuthModal();
            return result.user;
        } catch (error) {
            console.error('Sign-up error:', error);
            ui.showToast('Sign-up failed: ' + error.message);
            throw error;
        }
    },

    // Email/Password Sign In
    async signInWithEmail(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            ui.showToast(`Welcome back, ${result.user.displayName || result.user.email}!`);
            ui.closeAuthModal();
            return result.user;
        } catch (error) {
            console.error('Sign-in error:', error);
            ui.showToast('Sign-in failed: ' + error.message);
            throw error;
        }
    },

    // Sign Out
    async signOut() {
        try {
            await auth.signOut();
            ui.showToast('Signed out successfully');
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    },

    // Get current user ID
    getCurrentUserId() {
        return this.currentUser ? this.currentUser.uid : null;
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.currentUser;
    }
};

// Firestore database helpers
const dbHelpers = {
    // Get all products
    async getProducts() {
        try {
            const snapshot = await db.collection('products').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    // Get product by ID
    async getProduct(id) {
        try {
            const doc = await db.collection('products').doc(id).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    },

    // Update product stock
    async updateStock(productId, quantity) {
        try {
            const productRef = db.collection('products').doc(productId);
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(productRef);
                if (!doc.exists) {
                    throw new Error('Product not found');
                }
                const newStock = doc.data().stock - quantity;
                if (newStock < 0) {
                    throw new Error('Insufficient stock');
                }
                transaction.update(productRef, { stock: newStock });
            });
            return true;
        } catch (error) {
            console.error('Error updating stock:', error);
            return false;
        }
    },

    // Save user cart
    async saveCart(userId, cartItems) {
        try {
            await db.collection('users').doc(userId).update({
                cart: cartItems,
                cartUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error saving cart:', error);
            return false;
        }
    },

    // Get user cart
    async getCart(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return doc.data().cart || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching cart:', error);
            return [];
        }
    },

    // Save user wishlist
    async saveWishlist(userId, wishlistItems) {
        try {
            await db.collection('users').doc(userId).update({
                wishlist: wishlistItems,
                wishlistUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error saving wishlist:', error);
            return false;
        }
    },

    // Get user wishlist
    async getWishlist(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return doc.data().wishlist || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            return [];
        }
    },

    // Create order
    async createOrder(userId, orderData) {
        try {
            const orderRef = await db.collection('orders').add({
                userId: userId,
                ...orderData,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Add order to user's order history
            await db.collection('users').doc(userId).update({
                orders: firebase.firestore.FieldValue.arrayUnion(orderRef.id)
            });
            
            return orderRef.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Get user orders
    async getUserOrders(userId) {
        try {
            const snapshot = await db.collection('orders')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }
};

// Real-time listeners
const realtimeListeners = {
    productListeners: {},

    // Listen to product stock changes
    listenToProductStock(productId, callback) {
        if (this.productListeners[productId]) {
            this.productListeners[productId]();
        }

        const unsubscribe = db.collection('products').doc(productId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    callback(doc.data().stock);
                }
            }, (error) => {
                console.error('Stock listener error:', error);
            });

        this.productListeners[productId] = unsubscribe;
        return unsubscribe;
    },

    // Stop listening to product
    stopListening(productId) {
        if (this.productListeners[productId]) {
            this.productListeners[productId]();
            delete this.productListeners[productId];
        }
    },

    // Listen to all products (for admin)
    listenToAllProducts(callback) {
        return db.collection('products')
            .onSnapshot((snapshot) => {
                const products = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(products);
            });
    }
};
