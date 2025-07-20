document.addEventListener('DOMContentLoaded', function() {
    // Obtener el carrito de sessionStorage en lugar de localStorage
    const cart = JSON.parse(sessionStorage.getItem('checkoutCart')) || [];
    const orderSummary = document.getElementById('order-summary');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    const confirmBtn = document.getElementById('confirm-payment');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const orderDetails = document.getElementById('order-details');
    
    let subtotal = 0;
    
    // Mostrar/ocultar secciones según el contenido del carrito
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('d-none');
        if (orderDetails) orderDetails.classList.add('d-none');
        if (confirmBtn) confirmBtn.disabled = true;
        return;
    } else {
        if (emptyCartMessage) emptyCartMessage.classList.add('d-none');
        if (orderDetails) orderDetails.classList.remove('d-none');
    }
    
    // Mostrar productos del carrito
    if (orderSummary) {
        orderSummary.innerHTML = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex justify-content-between mb-2';
            itemElement.innerHTML = `
                <span>${item.product} x${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            orderSummary.appendChild(itemElement);
        });
    }
    
    // Calcular y mostrar totales
    const shipping = 2.50;
    const total = subtotal + shipping;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Confirmar pago - SOLO aquí se vacía el carrito
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const form = document.getElementById('payment-form');
            if (form && !form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            
            // Simular procesamiento de pago
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Procesando...';
            
            setTimeout(() => {
                // 1. Vaciar el carrito
                localStorage.removeItem('cart');
                sessionStorage.removeItem('checkoutCart');
                
                // 2. Actualizar contador
                updateCartCount();
                
                // 3. Mostrar confirmación y redirigir
                alert('¡Pago realizado con éxito! Gracias por tu compra.');
                window.location.href = 'index.html';
            }, 2000);
        });
    }
});

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = '0';
        cartCount.style.display = 'none';
    }
}