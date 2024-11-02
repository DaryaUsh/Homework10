const API_URL = "https://fakestoreapi.com";



async function getProducts() {
    try {
        const response = await fetch(`${API_URL}/products`)
        if (!response.ok) throw new Error ("Network response was not ok");

        const products = await response.json();
        displayProducts(products);
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
        productElement.innerHTML = `
            <img src ="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.price}</p>
            <button onclick = "deleteProduct(${product.id})">Delete</button>
        `;
    productList.appendChild(productElement);

    })
    const buttons = document.querySelectorAll('.button')

    function filter (productCategory) {
        productCategory.forEach((productCategory) => {
            const isItemFiltered = 'productCategory'
            const isShowAll = productCategory.toLowerCase() === 'all'
            if (isItemFiltered && !isShowAll) {
                productCategory.classList.add('anime')
            } else {
                productCategory.classList.remove('hide')
                productCategory.classList.remove('anime')
            }
        })
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const currentCategory = button.dataset.filter
            filter(currentCategory, productList)
        })
    })

    productList.forEach((card) => {
        productList.ontransitionend = function () {
            if (productList.classList.contains('anime')) {
                productList.classList.add('hide')
            }
        }
    })
}

async function addProduct(event) {
    event.preventDefault();
    const newProduct = {
        title: document.getElementById('productTitle').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        image:document.getElementById('productImage').value,
        category:document.getElementById('productCategory').value
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(newProduct)

        });
        if (!response.ok) throw new Error('Network response was not ok');
        const addedProduct = await response.json();
        showMessage('Product added successfully');
        getProducts();
    } catch (error) {
        showMessage('Error adding product: '+error.massage, 'error');
    }

}


async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'});
        if (!response.ok) throw new Error('Network response was not ok');
        const addedProduct = await response.json();
        showMessage('Product deleted successfully');
        getProducts();
    } catch (error) {
        showMessage('Error deleting product: '+error.massage, 'error');
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