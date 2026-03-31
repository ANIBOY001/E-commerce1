// Trending Products Carousel
const carousel = {
    currentIndex: 0,
    autoScrollInterval: null,
    isPaused: false,

    init() {
        this.render();
        this.startAutoScroll();
        this.initDrag();
    },

    render() {
        const track = document.getElementById('trendingTrack');
        if (!track) return;

        // Get trending products (highest rated)
        const trending = [...products.data]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8);

        // Duplicate for infinite scroll effect
        const items = [...trending, ...trending];

        track.innerHTML = items.map(product => `
            <div class="flex-shrink-0 w-72 group cursor-pointer" onclick="ui.openQuickView(${product.id})">
                <div class="relative rounded-2xl overflow-hidden aspect-square mb-4">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    >
                    <div class="absolute top-3 left-3 flex gap-2">
                        <span class="glow-badge px-3 py-1 bg-accent-purple text-xs font-semibold rounded-full">HOT</span>
                        ${product.isSale ? '<span class="px-3 py-1 bg-red-500 text-xs font-semibold rounded-full">SALE</span>' : ''}
                    </div>
                    <div class="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button class="w-12 h-12 rounded-full bg-white text-dark-900 flex items-center justify-center hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>
                <h3 class="font-semibold mb-1 group-hover:text-accent-purple transition-colors">${product.name}</h3>
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold">$${(product.isSale ? product.salePrice : product.price).toFixed(2)}</span>
                    <div class="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span class="text-sm text-gray-400">${product.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    startAutoScroll() {
        const track = document.getElementById('trendingTrack');
        if (!track) return;

        this.autoScrollInterval = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, 3000);
    },

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
    },

    next() {
        const track = document.getElementById('trendingTrack');
        if (!track) return;

        const itemWidth = 288 + 24; // card width + gap
        this.currentIndex = (this.currentIndex + 1) % 4;
        track.style.transform = `translateX(-${this.currentIndex * itemWidth}px)`;
    },

    prev() {
        const track = document.getElementById('trendingTrack');
        if (!track) return;

        const itemWidth = 288 + 24;
        this.currentIndex = this.currentIndex === 0 ? 3 : this.currentIndex - 1;
        track.style.transform = `translateX(-${this.currentIndex * itemWidth}px)`;
    },

    initDrag() {
        const container = document.getElementById('trendingCarousel');
        if (!container) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            this.isPaused = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            this.isPaused = false;
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            setTimeout(() => this.isPaused = false, 1000);
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        container.addEventListener('touchstart', () => {
            this.isPaused = true;
        }, { passive: true });

        container.addEventListener('touchend', () => {
            setTimeout(() => this.isPaused = false, 1000);
        }, { passive: true });
    }
};
