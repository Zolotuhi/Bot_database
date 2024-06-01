const translations = {
    en: {
        title: "Attendance Tracker",
        username: "Username",
        password: "Password",
        rememberMe: "Remember me",
        login: "Login",
        english: "English",
        russian: "Русский"
    },
    ru: {
        title: "Трекер Посещаемости",
        username: "Имя пользователя",
        password: "Пароль",
        rememberMe: "Запомнить меня",
        login: "Войти",
        english: "Английский",
        russian: "Русский"
    }
};

let currentLanguage = 'en';

document.addEventListener("DOMContentLoaded", function() {
    setLanguage(currentLanguage);
});

function setLanguage(language) {
    currentLanguage = language;
    document.querySelector('h1').textContent = translations[language].title;
    document.querySelector('label[for="username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="password"]').textContent = translations[language].password + ":";
    document.querySelector('label[for="remember-me"]').textContent = translations[language].rememberMe;
    document.querySelector('button[onclick="login()"]').textContent = translations[language].login;
    document.querySelector('button[onclick="setLanguage(\'en\')"]').textContent = translations[language].english;
    document.querySelector('button[onclick="setLanguage(\'ru\')"]').textContent = translations[language].russian;
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (username === 'admin' && password === 'password') {
        if (rememberMe) {
            localStorage.setItem('loggedIn', 'true');
        }
        window.location.href = 'attendance.html'; // Redirect to the main page
    } else {
        alert('Invalid login credentials');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem('loggedIn') === 'true') {
        window.location.href = 'attendance.html'; // Redirect if already logged in
    }
});
