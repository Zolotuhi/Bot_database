document.addEventListener("DOMContentLoaded", function() {
    setLanguage(currentLanguage);
    if (!localStorage.getItem('rememberMe')) {
        showLoginForm();
    }
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Проверка авторизации (замените на свою логику)
    if (username === 'admin' && password === 'admin') {
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        hideLoginForm();
    } else {
        alert('Неверные данные для входа');
    }
}

function showLoginForm() {
    document.getElementById('login-container').style.display = 'block';
}

function hideLoginForm() {
    document.getElementById('login-container').style.display = 'none';
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon img');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.src = 'eye-slash-icon.png'; // замените на значок с закрытым глазом
    } else {
        passwordInput.type = 'password';
        eyeIcon.src = 'eye-icon.png'; // замените на значок с открытым глазом
    }
}

function setLanguage(language) {
    currentLanguage = language;
    document.querySelector('h1').textContent = translations[language].title;
    document.querySelector('label[for="username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="password"]').textContent = translations[language].password + ":";
    document.querySelector('.remember-me-label').textContent = translations[language].rememberMe;
    document.querySelector('button[onclick="login()"]').textContent = translations[language].login;
    fetchAttendanceData();
}
