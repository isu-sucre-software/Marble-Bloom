document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    setupEventListeners();
});

function renderCart() {
    const cart = getCart();
    const tbody = document.getElementById('cart-table-body');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    tbody.innerHTML = '';
    
    let subtotal = 0;
    
    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="bi bi-cart-x display-4 text-muted"></i>
                    <p class="mt-3">Tu carrito está vacío</p>
                    <a href="menu.html" class="btn btn-primary mt-2">Ir al Menú</a>
                </td>
            </tr>
        `;
        checkoutBtn.disabled = true;
    } else {
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            row.innerHTML = `
                <td>${item.product}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="input-group" style="max-width: 120px;">
                        <button class="btn btn-outline-secondary btn-decrease" type="button" data-index="${index}">-</button>
                        <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary btn-increase" type="button" data-index="${index}">+</button>
                    </div>
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td class="text-center"><button class="btn btn-danger btn-sm btn-remove" data-index="${index}"><i class="bi bi-trash"></i></button></td>
            `;
            
            tbody.appendChild(row);
        });
        
        checkoutBtn.disabled = false;
    }
    
    const shipping = 2.50;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Actualizar contador en el navbar
    updateCartCount();
}

function setupEventListeners() {
    // Event delegation para los botones del carrito
    document.getElementById('cart-table-body').addEventListener('click', function(e) {
        const target = e.target.closest('.btn-decrease, .btn-increase, .btn-remove');
        
        if (!target) return;
        
        const index = target.getAttribute('data-index');
        
        if (target.classList.contains('btn-remove')) {
            removeFromCart(index);
        } 
        else if (target.classList.contains('btn-increase')) {
            updateQuantity(index, 1);
        } 
        else if (target.classList.contains('btn-decrease')) {
            updateQuantity(index, -1);
        }
        
        renderCart();
    });
    
    // Botón de checkout
    document.getElementById('checkout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        const cart = getCart();
        
        if (cart.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').id;
        
        if (paymentMethod === 'cash') {
            sessionStorage.setItem('deliveryCart', JSON.stringify(cart));
            window.location.href = 'pago-contra-entrega.html';
        } else {
            sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
            window.location.href = 'checkout.html';
        }
    });
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateQuantity(index, change) {
    const cart = getCart();
    cart[index].quantity += change;
    
    // Asegurar que la cantidad no sea menor a 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}