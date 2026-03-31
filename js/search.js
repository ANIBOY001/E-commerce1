// Search functionality
const search = {
    init() {
        this.initSearchInput();
    },

    initSearchInput() {
        const searchInput = document.getElementById('searchInput');
        const searchDropdown = document.getElementById('searchDropdown');

        if (!searchInput || !searchDropdown) return;

        let debounceTimer;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim()) {
                searchDropdown.classList.add('open');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.remove('open');
            }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchDropdown.classList.remove('open');
                searchInput.blur();
            }
        });
    },

    performSearch(query) {
        const searchDropdown = document.getElementById('searchDropdown');
        const searchResults = document.getElementById('searchResults');

        if (!searchResults) return;

        if (!query.trim()) {
            searchDropdown.classList.remove('open');
            return;
        }

        const normalizedQuery = query.toLowerCase().trim();
        
        // Search in products
        const results = products.data.filter(product => 
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.category.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery)
        ).slice(0, 6);

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="p-6 text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <p>No products found for "${query}"</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(product => {
                const price = product.isSale 
                    ? `<span class="text-accent-neon font-semibold">$${product.salePrice.toFixed(2)}</span> <span class="text-gray-500 line-through text-sm">$${product.price.toFixed(2)}</span>`
                    : `<span class="font-semibold">$${product.price.toFixed(2)}</span>`;

                return `
                    <a href="#shop" onclick="ui.openQuickView(${product.id}); search.closeDropdown();" class="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-lg object-cover">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-medium truncate">${product.name}</h4>
                            <p class="text-sm text-gray-400">${product.category}</p>
                            <div class="text-sm">${price}</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                `;
            }).join('');

            // Add "View all results" link
            searchResults.innerHTML += `
                <a href="#shop" onclick="search.closeDropdown();" class="block p-4 text-center text-accent-purple hover:bg-white/5 transition-colors border-t border-white/10">
                    View all results
                </a>
            `;
        }

        searchDropdown.classList.add('open');
    },

    closeDropdown() {
        const searchDropdown = document.getElementById('searchDropdown');
        const searchInput = document.getElementById('searchInput');
        if (searchDropdown) searchDropdown.classList.remove('open');
        if (searchInput) searchInput.value = '';
    }
};
