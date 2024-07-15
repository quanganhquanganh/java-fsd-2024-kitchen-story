const API_URL = 'http://localhost:3000';
const ITEMS_PER_PAGE = 6;

let allProducts = [];
let currentCategory = 'All';
let currentPage = 1;

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/food_items`);
        allProducts = await response.json();
        renderCategories();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('product-list').innerHTML = '<p class="col-12">Error loading products. Please try again.</p>';
    }
}

function renderCategories() {
    const categories = ['All', ...new Set(allProducts.map(product => product.category))];
    const categoryButtons = document.getElementById('category-buttons');
    categoryButtons.innerHTML = categories.map(category => `
        <button class="btn btn-outline-primary me-2 mb-2 category-btn${category === currentCategory ? ' active' : ''}" data-category="${category}">
            ${category}
        </button>
    `).join('');

    categoryButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            renderProducts();
            updateCategoryButtons();
        }
    });
}

function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentCategory);
    });
}

function renderProducts() {
    const filteredProducts = currentCategory === 'All' 
        ? allProducts 
        : allProducts.filter(product => product.category === currentCategory);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    const productList = document.getElementById('product-list');
    productList.innerHTML = productsToShow.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                    <p class="card-text"><small class="text-muted">${product.category}</small></p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    let paginationHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item${currentPage === i ? ' active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    pagination.innerHTML = paginationHTML;

    pagination.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            currentPage = parseInt(e.target.dataset.page);
            renderProducts();
        }
    });
}

let cart = [];

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    saveCartToLocalStorage();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item mb-3">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h5>${item.name}</h5>
                        <p class="mb-0">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
        }
        updateCartCount();
        saveCartToLocalStorage();
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToLocalStorage();
    renderCart();
}

function checkout() {
  if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
  }
  window.location.href = 'pages/order-summary.html';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCartFromLocalStorage();

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `pages/search-results.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });

    const cartIcon = document.getElementById('cart-icon');
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        cartModal.show();
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', checkout);
});
