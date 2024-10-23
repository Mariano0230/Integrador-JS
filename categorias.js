// Añadir un producto a la pantalla y a la lista de productos
function addProductToScreen(container, name, price, image, category) {
    // Verificar si el producto ya existe en el contenedor
    const existingProduct = container.querySelector(`[data-name="${name}"]`);
    if (existingProduct) {
        alert('El producto ya existe.');
        return;
    }

    const productDiv = document.createElement('div');
    productDiv.classList.add('indiv');
    productDiv.dataset.id = generateUniqueId();
    productDiv.dataset.price = parseFloat(price); // Asumiendo que price es el precio
    productDiv.dataset.category = category;
    productDiv.dataset.name = name; // Añadir el nombre del producto como atributo de datos

    productDiv.innerHTML = `
        <h3>${name}</h3>
        <img width="250px" height="250px" src="${image}" alt="${name}">
        <p>
            ${name}<br />
            $${price}<br />
            Categoría: ${category}<br />
        </p>
    `;

    container.appendChild(productDiv);

    // Guardar el producto en el localStorage
    saveAddedProductToLocalStorage(productDiv);

    // Añadir el producto a la sidebar de categorías
    addProductToCategorySidebar(name, category);
}

// Eliminar un producto de la pantalla
function removeProductFromScreen(container, name, category) {
    const products = container.querySelectorAll('.indiv');
    products.forEach(product => {
        if (product.querySelector('h3').textContent === name && product.dataset.category === category) {
            product.remove();
        }
    });

    // Guardar el estado actualizado en el localStorage
    saveAddedProductsToLocalStorage(container);

    // Eliminar el producto de la sidebar de categorías
    removeProductFromCategorySidebar(name, category);
}

// Generar un ID único
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Guardar productos añadidos en localStorage
function saveAddedProductToLocalStorage(productDiv) {
    const addedProducts = loadAddedProductsFromLocalStorage();
    addedProducts.push({
        id: productDiv.dataset.id,
        name: productDiv.querySelector('h3').textContent,
        price: productDiv.dataset.price,
        image: productDiv.querySelector('img').src,
        category: productDiv.dataset.category
    });
    localStorage.setItem('addedProducts', JSON.stringify(addedProducts));
}

// Guardar todos los productos en el localStorage
function saveAddedProductsToLocalStorage(container) {
    const addedProducts = [];
    const products = container.querySelectorAll('.indiv');
    products.forEach(product => {
        addedProducts.push({
            id: product.dataset.id,
            name: product.querySelector('h3').textContent,
            price: product.dataset.price,
            image: product.querySelector('img').src,
            category: product.dataset.category
        });
    });
    localStorage.setItem('addedProducts', JSON.stringify(addedProducts));
}

// Cargar productos añadidos desde localStorage
function loadAddedProductsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('addedProducts')) || [];
}

// Añadir producto a la sidebar de categorías
function addProductToCategorySidebar(name, category) {
    const categorySidebar = document.querySelector('.category-sidebar');
    const categoryList = categorySidebar.querySelector(`#category-items`);

    // Normalizar la categoría a minúsculas
    const normalizedCategory = category.toLowerCase();

    // Buscar si ya existe la categoría
    let categoryElement = categoryList.querySelector(`li[data-category="${normalizedCategory}"]`);

    // Si la categoría no existe, crearla
    if (!categoryElement) {
        categoryElement = document.createElement('li');
        categoryElement.dataset.category = normalizedCategory;
        categoryElement.innerHTML = `<strong>${category}</strong>`;
        categoryList.appendChild(categoryElement);
    }

    // Verificar si el producto ya existe en la categoría
    const existingProductItem = categoryElement.querySelector(`a[data-category="${normalizedCategory}"][data-name="${name}"]`);
    if (existingProductItem) {
        return;
    }

    // Crear y añadir el producto debajo de la categoría existente
    const productItem = document.createElement('li');
    productItem.innerHTML = `<a href="#" data-category="${normalizedCategory}" data-name="${name}">${name}</a>`;
    productItem.style.paddingLeft = '20px'; // Agregar indentación
    categoryElement.appendChild(productItem);
}

// Eliminar un producto de la sidebar de categorías
function removeProductFromCategorySidebar(name, category) {
    const categorySidebar = document.querySelector('.category-sidebar');
    const categoryList = categorySidebar.querySelector(`#category-items`);
    const categoryItems = categoryList.querySelectorAll(`a[data-category="${category.toLowerCase()}"]`);
    categoryItems.forEach(item => {
        if (item.textContent === name) {
            item.parentElement.remove();
        }
    });
}

export { addProductToScreen, removeProductFromScreen, generateUniqueId, loadAddedProductsFromLocalStorage, addProductToCategorySidebar, removeProductFromCategorySidebar };
