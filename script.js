document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrito y productos
    updateCart();
    loadProducts();

    // Agregar un evento para filtrar los productos cuando cambie el filtro
    document.getElementById('sport-filter').addEventListener('change', filterProducts);

    // Agregar un evento para manejar el formulario de administración
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
    
    // Agregar un evento para eliminar todos los productos
    document.getElementById('clear-products').addEventListener('click', clearAllProducts);

    // Configurar el evento para el menú de navegación
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('navbar-active');
    });
});

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productContainer = document.getElementById('productos');
    productContainer.innerHTML = ''; // Limpiar productos existentes

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.dataset.category = product.category; // Añadir categoría para el filtrado
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Agregar al Carrito</button>
        `;
        productContainer.appendChild(productDiv);
    });
}

function filterProducts() {
    const filter = document.getElementById('sport-filter').value;
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        if (filter === 'all' || product.dataset.category === filter) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;

    if (name && !isNaN(price) && category) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push({ name, price, category });
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }
}

function clearAllProducts() {
    localStorage.removeItem('products');
    loadProducts();
}

function addToCart(name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    
    cartItemsDiv.innerHTML = ''; // Limpia el contenido actual

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <button onclick="removeFromCart('${item.name}')">Eliminar</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        // Añadir el botón de "Comprar"
        const purchaseButton = document.createElement('button');
        purchaseButton.textContent = 'Comprar';
        purchaseButton.onclick = function() {
            alert('Compra realizada con éxito');
            clearCart();
        };
        cartItemsDiv.appendChild(purchaseButton);
    }

    // Actualiza el conteo del carrito
    const cartCount = cart.length;
    document.querySelector('#cart a').textContent = `Carrito (${cartCount})`;
}

function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCart();
}
