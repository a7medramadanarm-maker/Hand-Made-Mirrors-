Enterlet cart = [];

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('hidden');
}

async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const grid = document.getElementById('product-grid');
        grid.innerHTML = products.map(p => `
            <div class="card">
                <img src="${p.image_url}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p class="price">${p.price} ج.م</p>
                <button class="btn-add" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">إضافة للسلة والتفصيل</button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

function addToCart(id, name, price) {
    cart.push({ id, name, price, quantity: 1 });
    updateCartUI();
    toggleCart();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    let total = 0;
    itemsContainer.innerHTML = cart.map(item => {
        total += item.price;
        return `<div class="cart-item"><p>${item.name} - ${item.price} ج.م</p></div>`;
    }).join('');
    document.getElementById('cart-total').innerText = total;
}

async function handleCheckout(e) {
    e.preventDefault();
    const orderData = {
        customer_name: document.getElementById('cust-name').value,
        customer_phone: document.getElementById('cust-phone').value,
        address: document.getElementById('cust-address').value,
        custom_details: document.getElementById('cust-details').value,
        items: cart,
        total_amount: cart.reduce((sum, item) => sum + item.price, 0)
    };

    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });

    if (res.ok) {
        alert('تم إرسال طلبك بنجاح! سيتم التواصل معكم لتأكيد تفاصيل الاسم والديزاين.');
        cart = [];
        updateCartUI();
        toggleCart();
    }
}

window.onload = fetchProducts;
