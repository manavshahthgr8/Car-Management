// app.js

const apiUrl = 'http://localhost:5000/api'; // Change this to your backend API URL
let token = localStorage.getItem('token'); // Retrieve the JWT token from local storage


const body = document.body;
const loginBox = document.querySelector(".login-box");
const signupsection = document.querySelector(".signup-section");
const p = document.getElementsByTagName("p")[0];
const h1 = document.getElementsByTagName("h1")[0];
const inputs = document.querySelectorAll("input");
const loginButton = document.getElementById("login-button");
const loginButtonSignup = document.getElementById("login-button-signup");
const signupButton = document.getElementById("signup-button"); // Get the "Sign Up" button
const h2 = document.getElementsByTagName("h2")[0];

// Switch between light and dark mode
function switchTheme() {
  loginBox.classList.toggle("dark-mode");
  signupsection.classList.toggle("dark-mode");
  body.classList.toggle("dark-mode");
  h1.classList.toggle("dark-mode");
  p.classList.toggle("dark-mode");
  inputs.forEach(input => {
    input.classList.toggle("dark-mode");
  });
  loginButton.classList.toggle("dark-mode");
  h2.classList.toggle("dark-mode");
}

// Handle the login form submission
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent the default form submission

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Make API request to login
  const response = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token); // Store JWT in localStorage
    window.location.href = 'product-list.html'; // Redirect to the product list page
  } else {
    alert(data.error || 'Login failed');
  }
});

// Add event listener to "Sign Up" button
signupButton.addEventListener('click', function() {
  window.location.href = 'signup.html'; // Redirect to the signup page
});

if (loginButtonSignup) {
    loginButtonSignup.addEventListener('click', function() {
      window.location.href = 'index.html'; // Redirect to the login page
    });
  } else {
    console.error("Login button not found.");
  }

// Handle the signup form submission
document.getElementById('signup-form')?.addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent the default form submission

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  // Make API request to create a new user
  const response = await fetch('http://localhost:5000/api/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token); // Store JWT in localStorage
    window.location.href = 'product-list.html'; // Redirect to the product list page
  } else {
    alert(data.error || 'Signup failed');
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