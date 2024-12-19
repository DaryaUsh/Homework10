const API_URL = "https://fakestoreapi.com";

let allProducts = []; // Сохраняем все продукты для фильтрации

let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 6;

loadMoreBtn.onclick = () => {
    let products = [...document.querySelectorAll('.product')];
    for (var i = currentItem; i < currentItem + 6; i++){
        products[i].style.display = 'inline-block';
    }
    currentItem += 6;

    if(currentItem >= products.length){
        loadMoreBtn.style.display = 'none';
    }
}

async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Network response was not ok");

        allProducts = await response.json(); // Сохраняем все продукты
        displayProducts(allProducts); // Показываем все продукты изначально
        setupFilterButtons(); // Устанавливаем обработчики для кнопок фильтрации
    } catch (error) {
        console.log(error.message);
    }
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.dataset.category = product.category; // Добавляем категорию как data-атрибут
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="justify">
                <h3 class="h3">${product.title}</h3>
                <p>$${product.price}</p>
                <p>Category: ${product.category}</p>
                <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        `;
        productList.appendChild(productElement);
    });
}

function setupFilterButtons() {
    const filterContainer = document.querySelector('.filter');
    
    // Получаем уникальные категории из продуктов
    const categories = ['All', ...new Set(allProducts.map(product => product.category))];
    
    // Создаем кнопки фильтров
    const buttonsHTML = categories.map(category => `
        <button class="filter-button" data-filter="${category.toLowerCase()}">
            ${category}
        </button>
    `).join('');
    
    // Добавляем кнопки на страницу
    filterContainer.innerHTML = `
        <h2>Filters</h2>
        <div class="filter-buttons">
            ${buttonsHTML}
        </div>
    `;
    
    // Добавляем обработчики событий для кнопок
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.filter;
            filterProducts(category);
            
            // Обновляем активную кнопку
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function filterProducts(category) {
    let filteredProducts;
    
    if (category === 'all') {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => 
            product.category.toLowerCase() === category
        );
    }
    
    displayProducts(filteredProducts);
}

async function addProduct(event) {
    event.preventDefault();
    const newProduct = {
        title: document.getElementById('productTitle').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        category: document.getElementById('productCategory').value
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const addedProduct = await response.json();
        showMessage('Product added successfully');
        getProducts();
    } catch (error) {
        showMessage('Error adding product: ' + error.message, 'error');
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Network response was not ok');
        await response.json();
        showMessage('Product deleted successfully');
        getProducts();
    } catch (error) {
        showMessage('Error deleting product: ' + error.message, 'error');
    }
}

function showMessage(message, type = 'success') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
    setTimeout(() => messageElement.style.display = 'none', 3000);
}

document.getElementById('addProductForm').addEventListener('submit', addProduct);

getProducts();