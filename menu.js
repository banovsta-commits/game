// Handler: playForm submit — navigate to the main index page
document.getElementById('playForm').addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = 'Index.html';
});

// Handler: statForm submit — open the statistics page
document.getElementById('statForm').addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = 'statistics.html';
});

// Handler: exitForm submit — confirm and return to login
document.getElementById('exitForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to exit?')) {
        window.location.href = 'login.html';
    }
});