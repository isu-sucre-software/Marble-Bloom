document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Actualizar contador del carrito
    updateCartCount();
    
    // Manejar botones "Agregar al carrito"
    document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const button = e.target;
        const product = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));
        
        // Obtener la cantidad del input más cercano
        const quantityInput = button.closest('.modal-content') 
            ? button.closest('.modal-content').querySelector('.quantity-input')
            : button.closest('.card-body').querySelector('.quantity-input');
        
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        addToCart(product, price, quantity);
        updateCartCount();
        showToast('Producto agregado al carrito');
    }
});
    
    // Manejar formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Mensaje enviado con éxito');
            this.reset();
        });
    }
});


// Función para agregar al carrito
function addToCart(product, price, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            product: product,
            price: parseFloat(price),
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Producto agregado al carrito');
}

// Actualizar contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}


function showToast(message) {
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-success';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(toastEl);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    // Remove after hidden
    toastEl.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toastEl);
    });
}

// Manejar botones de incremento/decremento en toda la página
document.addEventListener('click', function(e) {
    // Para botones en modales/productos
    if (e.target.classList.contains('btn-increase') || 
        e.target.classList.contains('btn-decrease') ||
        e.target.closest('.btn-increase') || 
        e.target.closest('.btn-decrease')) {
        
        const button = e.target.classList.contains('btn-increase') || e.target.classList.contains('btn-decrease') 
            ? e.target 
            : e.target.closest('.btn-increase') || e.target.closest('.btn-decrease');
        
        const input = button.closest('.input-group').querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (button.classList.contains('btn-increase')) {
            value++;
        } else {
            value = Math.max(1, value - 1); // No permitir valores menores a 1
        }
        
        input.value = value;
        
        // Si está en el carrito, actualizar el carrito
        if (button.closest('#cart-table-body')) {
            const index = button.getAttribute('data-index');
            updateQuantity(index, button.classList.contains('btn-increase') ? 1 : -1);
        }
    }
});