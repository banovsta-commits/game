// Handler: loginForm submit — validate credentials and navigate to menu
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value; 

    const admin = "admin";
    const adminPassword = "admin123";

    if (username === admin && password === adminPassword) {
        window.location.href = 'menu.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
});