// Handle login logic
async function loginUser(event) {
    event.preventDefault();  // Prevent default form submission
  
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    // Reset error message display
    document.getElementById('error-message').style.display = 'none';
  
    try {
      // Send POST request to backend API to login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        // On successful login
        alert('Login successful!');
        
        localStorage.setItem('token', data.token);  // Save JWT token to local storage
        localStorage.setItem('username', data.name);
        localStorage.setItem('uid',data.userId);
        window.location.href = '/product-list.html';  // Redirect to home/dashboard page
      } else {
        // If login fails
        document.getElementById('error-message').innerText = data.error || 'Login failed. Please try again.';
        document.getElementById('error-message').style.display = 'block';
      }
    } catch (error) {
      console.error('Login Error:', error);
      document.getElementById('error-message').innerText = 'Server is offline | Databse not connected. Please download & run on local host';
      document.getElementById('error-message').style.display = 'block';
    }
  }
  
  document.getElementById('signup-button').addEventListener('click', function() {
    window.location.href = 'signup.html';  // Redirect to signup.html
  });
  
  // Submit the signup form
document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent the form from refreshing the page on submit
  
    // Get form data
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
  
    // Log the data to check it's being captured correctly
    console.log('Signup data:', { name, email, password });
  
    // Prepare the data to send to the backend
    const data = { name, email, password };
  
    try {
      // Send a POST request to the signup API
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Handle response
      const result = await response.json(); // Parse the response JSON
      console.log('Signup API Response:', result); // Log the response
  
      if (response.ok) {
        // If signup is successful
        alert('Signup successful!');
        window.location.href = 'index.html';  // Redirect to login page after successful signup
      } else {
        // If there is an error from the backend
        alert('Error: ' + result.error || 'Failed to sign up');  // Show error message
      }
    } catch (error) {
      console.error('Error:', error);  // Log any errors in the console
      alert('Server is offline | Databse not connected. Please download & run on local host');
    }
  });
  
  
  
  
  
  // Switch between light and dark mode
  function switchTheme() {
    document.body.classList.toggle('dark-mode');
    const loginBox = document.querySelector('.login-box');
    const signupsection = document.querySelector('.signup-section');
    const h1 = document.getElementsByTagName('h1')[0];
    const p = document.getElementsByTagName('p')[0];
    const inputs = document.querySelectorAll('input');
    const loginButton = document.getElementById('login-button');
    const h2 = document.getElementsByTagName('h2')[0];
  
    loginBox.classList.toggle('dark-mode');
    signupsection.classList.toggle('dark-mode');
    h1.classList.toggle('dark-mode');
    p.classList.toggle('dark-mode');
    inputs.forEach(input => {
      input.classList.toggle('dark-mode');
    });
    loginButton.classList.toggle('dark-mode');
    h2.classList.toggle('dark-mode');
  }
  