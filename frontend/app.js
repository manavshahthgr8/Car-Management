// app.js

const apiUrl = 'http://localhost:5000/api'; // Change this to your backend API URL
let token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

// 1. Login functionality
document.getElementById('login-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem('token', data.token); // Store JWT in local storage
        window.location.href = 'product-list.html'; // Redirect to product list page
    } else {
        alert('Login failed');
    }
});

// 2. Signup functionality
document.getElementById('signup-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch(`${apiUrl}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (data.message) {
        alert('Sign Up Successful');
        window.location.href = 'index.html'; // Redirect to login page
    } else {
        alert('Sign Up failed');
    }
});

// 3. Fetch products for product list
async function fetchProducts() {
    const response = await fetch(`${apiUrl}/products`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const products = await response.json();
    const productListContainer = document.getElementById('product-list');

    if (products.length === 0) {
        productListContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <button onclick="viewProduct(${product.id})">View Details</button>
        `;
        productListContainer.appendChild(productElement);
    });
}

// 4. View product details
async function viewProduct(productId) {
    const response = await fetch(`${apiUrl}/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const product = await response.json();
    const productDetailsContainer = document.getElementById('product-details');
    productDetailsContainer.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p><strong>Tags:</strong> ${product.tags}</p>
        <div class="images">
            ${product.images.map(img => `<img src="${img}" alt="Product Image">`).join('')}
        </div>
    `;
}

// 5. Search products (onkeyup)
function searchProducts() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const productItems = document.querySelectorAll('.product');
    productItems.forEach(item => {
        const title = item.querySelector('h3').innerText.toLowerCase();
        if (title.includes(searchQuery)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add other necessary functions (for creating, editing, and deleting products)...
