// --- 1. MOCK DATABASE ---
const products = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 24.99,
        category: "fiction",
        rating: 4.8,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        desc: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived."
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 16.00,
        category: "non-fiction",
        rating: 5.0,
        reviews: 850,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
        desc: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies that will teach you exactly how to form good habits."
    },
    {
        id: 3,
        title: "Dune",
        author: "Frank Herbert",
        price: 18.50,
        category: "sci-fi",
        rating: 4.9,
        reviews: 430,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
        desc: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange."
    },
    {
        id: 4,
        title: "Sapiens: A Brief History",
        author: "Yuval Noah Harari",
        price: 22.00,
        category: "history",
        rating: 4.7,
        reviews: 320,
        image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=800",
        desc: "From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller."
    },
    {
        id: 5,
        title: "Project Hail Mary",
        author: "Andy Weir",
        price: 26.00,
        category: "sci-fi",
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?auto=format&fit=crop&q=80&w=800",
        desc: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish."
    },
    {
        id: 6,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        price: 19.99,
        category: "non-fiction",
        rating: 4.6,
        reviews: 180,
        image: "https://images.unsplash.com/photo-1555449372-515af90c0f64?auto=format&fit=crop&q=80&w=800",
        desc: "The major New York Times bestseller that explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical."
    },
    {
        id: 7,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 12.50,
        category: "romance",
        rating: 4.8,
        reviews: 500,
        image: "https://images.unsplash.com/photo-1621351183012-e2f99720b133?auto=format&fit=crop&q=80&w=800",
        desc: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language."
    },
    {
        id: 8,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        price: 15.00,
        category: "fiction",
        rating: 4.5,
        reviews: 240,
        image: "https://images.unsplash.com/photo-1589696719601-52219154a43d?auto=format&fit=crop&q=80&w=800",
        desc: "Alicia Berenson’s life is seemingly perfect. Then one evening she shoots her husband five times in the face, and then never speaks another word."
    }
];

// --- 2. STATE MANAGEMENT ---
let state = {
    products: products,
    cart: JSON.parse(localStorage.getItem('lumina-cart')) || [],
    filters: {
        category: 'all',
        price: 100,
        search: ''
    },
    sort: 'popularity'
};

// DOM Elements
const grid = document.getElementById('product-grid');
const countLabel = document.getElementById('result-count');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const priceValue = document.getElementById('price-value');

// --- 3. INITIALIZATION ---
function init() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
}

// --- 4. RENDER ENGINE ---
function renderProducts() {
    grid.innerHTML = '';
    
    // Filter Logic
    let filtered = state.products.filter(p => {
        const matchesCategory = state.filters.category === 'all' || p.category === state.filters.category;
        const matchesPrice = p.price <= state.filters.price;
        const matchesSearch = p.title.toLowerCase().includes(state.filters.search) || 
                              p.author.toLowerCase().includes(state.filters.search);
        return matchesCategory && matchesPrice && matchesSearch;
    });

    // Sort Logic
    if (state.sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (state.sort === 'newest') filtered.sort((a, b) => b.id - a.id);

    // Update Count
    countLabel.innerText = `Showing ${filtered.length} book${filtered.length !== 1 ? 's' : ''}`;

    // Render Logic
    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #777;">
            <i class="ri-search-2-line" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>No books found matching your criteria.</h3>
        </div>`;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-image" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover;">
                <button class="wishlist-icon" onclick="event.stopPropagation(); toggleWishlist(this)"><i class="ri-heart-line"></i></button>
            </div>
            <div class="card-info">
                <div class="card-category">${product.category}</div>
                <h3 class="card-title" onclick="openProductModal(${product.id})" style="cursor:pointer">${product.title}</h3>
                <p class="card-author">${product.author}</p>
                <div class="card-footer">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="addToCart(${product.id})">
                        <i class="ri-add-line"></i> Add
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- 5. CART ENGINE ---
function addToCart(id) {
    const product = state.products.find(p => p.id === id);
    const existingItem = state.cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }

    // Simple animation feedback
    const btn = event.target.closest('.add-cart-btn');
    if(btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="ri-check-line"></i> Added`;
        btn.style.background = '#4A6CF7';
        btn.style.color = 'white';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 1500);
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = state.cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(id);
        else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('lumina-cart', JSON.stringify(state.cart));
}

function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.innerText = totalItems;
    cartSubtotal.innerText = `$${totalPrice.toFixed(2)}`;

    cartItemsContainer.innerHTML = '';
    
    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align:center; color:#999; margin-top: 3rem;">
                <i class="ri-shopping-basket-2-line" style="font-size: 3rem; margin-bottom: 1rem; display:block; opacity: 0.3;"></i>
                <p>Your cart is currently empty.</p>
                <button class="btn-primary" onclick="closeCart()" style="margin-top: 1rem; padding: 0.5rem 1.5rem; font-size: 0.9rem;">Start Shopping</button>
            </div>`;
    } else {
        state.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.style.cssText = "display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center;";
            cartItem.innerHTML = `
                <img src="${item.image}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">${item.title}</h4>
                    <div style="color: var(--gray); font-size: 0.85rem;">$${item.price}</div>
                    <div style="display: flex; align-items: center; gap: 0.8rem; margin-top: 0.5rem;">
                        <button onclick="updateQuantity(${item.id}, -1)" style="border:1px solid #ddd; width:24px; height:24px; border-radius:4px; background:white; cursor:pointer;">-</button>
                        <span style="font-size: 0.9rem; font-weight: 600;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="border:1px solid #ddd; width:24px; height:24px; border-radius:4px; background:white; cursor:pointer;">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ff4757; cursor:pointer;"><i class="ri-delete-bin-line"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
}

// --- 6. UI INTERACTIONS ---
function toggleWishlist(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('ri-heart-line')) {
        icon.classList.replace('ri-heart-line', 'ri-heart-fill');
        icon.style.color = '#ff4757';
    } else {
        icon.classList.replace('ri-heart-fill', 'ri-heart-line');
        icon.style.color = '';
    }
}

// Modals & Sidebars
const overlay = document.getElementById('overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const productModal = document.getElementById('product-modal');

function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function openProductModal(id) {
    const product = state.products.find(p => p.id === id);
    
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-author').innerText = product.author;
    document.getElementById('modal-price').innerText = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-category').innerText = product.category;
    
    // Re-attach add to cart listener for modal button
    const modalBtn = document.querySelector('#product-modal .btn-primary');
    modalBtn.onclick = () => addToCart(product.id);

    // Using dummy image logic for modal (simplified)
    const imgContainer = document.querySelector('.modal-image');
    imgContainer.innerHTML = `<img src="${product.image}" style="max-width:100%; max-height:100%; box-shadow:0 10px 30px rgba(0,0,0,0.15);">`;

    productModal.classList.add('active');
    overlay.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
}

// --- 7. EVENT LISTENERS SETUP ---
function setupEventListeners() {
    // Category Filters
    document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.cat-pill.active').classList.remove('active');
            e.target.classList.add('active');
            state.filters.category = e.target.dataset.category;
            renderProducts();
        });
    });

    // Sidebar Category Filters (Sync with pills)
    document.querySelectorAll('#sidebar-filters li').forEach(li => {
        li.addEventListener('click', (e) => {
            const text = e.target.innerText.split(' ')[0].toLowerCase();
            const map = { 'all': 'all', 'fiction': 'fiction', 'non-fiction': 'non-fiction', 'sci-fi': 'sci-fi', 'history': 'history' };
            state.filters.category = map[text] || 'all';
            renderProducts();
        });
    });

    // Price Slider
    const priceRange = document.getElementById('price-range');
    priceRange.addEventListener('input', (e) => {
        state.filters.price = e.target.value;
        priceValue.innerText = `$${e.target.value}`;
        renderProducts();
    });

    // Search
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        state.filters.search = e.target.value.toLowerCase();
        renderProducts();
    });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        renderProducts();
    });

    // UI Toggles
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('close-modal-btn').addEventListener('click', closeProductModal);
    document.getElementById('overlay').addEventListener('click', () => {
        closeCart();
        closeProductModal();
        document.getElementById('auth-modal').classList.remove('active');
    });
    document.getElementById('user-btn').addEventListener('click', () => {
        document.getElementById('auth-modal').classList.add('active');
        overlay.classList.add('active');
    });
}

// Run Init
init();