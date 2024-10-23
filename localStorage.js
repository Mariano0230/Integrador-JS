// Guardar el carrito en localStorage
function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

export { saveCartToLocalStorage, loadCartFromLocalStorage };
