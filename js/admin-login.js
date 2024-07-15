document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');

  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('http://localhost:3000/admin');
          const adminData = await response.json();

          if (username === adminData.username && password === adminData.password) {
              localStorage.setItem('adminLoggedIn', 'true');
              window.location.href = 'admin-dashboard.html';
          } else {
              alert('Invalid username or password');
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('An error occurred during login. Please try again.');
      }
  });
});
