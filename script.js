import { addProductToScreen, removeProductFromScreen, generateUniqueId, loadAddedProductsFromLocalStorage, addProductToCategorySidebar, removeProductFromCategorySidebar } from './categorias.js';

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const addedProductsContainer = document.getElementById('added-products-container');
    const scrollSpeed = 5; // Ajusta la velocidad de desplazamiento aquí
    let isScrolling = false;
    let scrollDirection = 0; // 1 para derecha, -1 para izquierda

    function handleMouseMove(e, container) {
        const rect = container.getBoundingClientRect();
        const isNearLeftEdge = e.clientX - rect.left < 50;
        const isNearRightEdge = rect.right - e.clientX < 50;

        if (isNearLeftEdge) {
            scrollDirection = -1;
            isScrolling = true;
        } else if (isNearRightEdge) {
            scrollDirection = 1;
            isScrolling = true;
        } else {
            isScrolling = false;
        }
    }

    function handleMouseLeave() {
        isScrolling = false;
    }

    function scrollContainer() {
        if (isScrolling) {
            menu.scrollLeft += scrollDirection * scrollSpeed;
            addedProductsContainer.scrollLeft += scrollDirection * scrollSpeed;
            requestAnimationFrame(scrollContainer);
        }
    }

    menu.addEventListener('mousemove', (e) => handleMouseMove(e, menu));
    menu.addEventListener('mouseleave', handleMouseLeave);
    menu.addEventListener('mousemove', scrollContainer);

    addedProductsContainer.addEventListener('mousemove', (e) => handleMouseMove(e, addedProductsContainer));
    addedProductsContainer.addEventListener('mouseleave', handleMouseLeave);
    addedProductsContainer.addEventListener('mousemove', scrollContainer);

    // Añadir animación de agrandamiento a los productos
    const indivProducts = document.querySelectorAll('.indiv');
    const animadoProducts = document.querySelectorAll('.animado');

    indivProducts.forEach(product => {
        product.addEventListener('mouseenter', () => {
            product.style.backgroundColor = '#a84c8d';
        });

        product.addEventListener('mouseleave', () => {
            product.style.backgroundColor = '#ac60a3ce';
        });
    });

    animadoProducts.forEach(product => {
        product.addEventListener('mouseenter', () => {
            product.style.transform = 'scale(0.9)';
        });

        product.addEventListener('mouseleave', () => {
            product.style.transform = 'scale(1)';
        });
    });

    const popupOverlay = document.getElementById('popup-overlay');
    const popupContainer = document.getElementById('popup-container');
    const btnOpenPopup = document.querySelector('.btn');
    const btnAccept = document.getElementById('btn-accept');
    const btnCancel = document.getElementById('btn-cancel');
    const btnDelete = document.getElementById('btn-delete');

    btnOpenPopup.addEventListener('click', function() {
        popupOverlay.style.display = 'block';
        popupContainer.style.display = 'block';
    });

    btnCancel.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
        popupContainer.style.display = 'none';
    });

    btnAccept.addEventListener('click', function() {
        const productName = document.getElementById('product-name').value;
        const productPrice = document.getElementById('product-quantity').value;
        const productImage = document.getElementById('imagen').value;
        const productCategory = document.getElementById('product-category').value;

        if (productName && productPrice && productImage && productCategory) {
            addProductToScreen(addedProductsContainer, productName, productPrice, productImage, productCategory);
            addProductToCategorySidebar(productName, productCategory);
            popupOverlay.style.display = 'none';
            popupContainer.style.display = 'none';
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });

    btnDelete.addEventListener('click', function() {
        const productName = document.getElementById('product-name').value;
        const productCategory = document.getElementById('product-category').value;

        if (productName && productCategory) {
            removeProductFromScreen(addedProductsContainer, productName, productCategory);
            removeProductFromCategorySidebar(productName, productCategory);
            popupOverlay.style.display = 'none';
            popupContainer.style.display = 'none';
        } else {
            alert('Por favor, complete los campos de nombre y categoría.');
        }
    });

    popupOverlay.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
        popupContainer.style.display = 'none';
    });

    // Cargar los productos añadidos desde el localStorage al recargar la página
    const addedProducts = loadAddedProductsFromLocalStorage();
    addedProducts.forEach(product => {
        addProductToScreen(addedProductsContainer, product.name, product.price, product.image, product.category);
        addProductToCategorySidebar(product.name, product.category);
    });

    // Controlar la visibilidad de la sidebar de categorías
    const categorySidebar = document.querySelector('.category-sidebar');

    categorySidebar.addEventListener('mouseleave', () => {
        categorySidebar.classList.remove('show');
    });

    categorySidebar.addEventListener('mouseenter', () => {
        categorySidebar.classList.add('show');
    });

    // Filtrar productos por categoría
    const categoryItems = document.querySelectorAll('#category-items a');
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.dataset.category;
            filterProductsByCategory(category);
        });
    });

    function filterProductsByCategory(category) {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            if (section.id === 'Destacados' || section.id === 'Promociones' || section.id === 'added-products') {
                section.style.display = 'none';
            }
        });

        const products = document.querySelectorAll('.indiv, .animado');
        products.forEach(product => {
            const productCategory = product.dataset.category;
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
                product.closest('section').style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });

        if (category === 'all') {
            sections.forEach(section => {
                section.style.display = 'block';
            });
        }
    }

    // Añadir pizzas existentes a la sidebar de categorías
    const existingPizzas = [
        { name: 'Pizza Gorgonzola', category: 'pizza' },
        { name: 'Pizza Hawaiana', category: 'pizza' },
        { name: 'Pizza Muzzarella', category: 'pizza' },
        { name: 'Pizza Margherita', category: 'pizza' }
    ];

    existingPizzas.forEach(pizza => {
        addProductToCategorySidebar(pizza.name, pizza.category);
    });
});
