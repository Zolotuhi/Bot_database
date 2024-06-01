document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        showAttendanceTracker();
    } else {
        document.getElementById('login-container').style.display = 'block';
    }

    setLanguage(currentLanguage);
});

const translations = {
    en: {
        title: "Attendance Tracker",
        username: "Username",
        password: "Password",
        rememberMe: "Remember me",
        login: "Login",
        editEmployee: "Edit Employee",
        save: "Save",
        present: "Present",
        latitude: "Latitude",
        longitude: "Longitude",
        search: "Search...",
        arrivalTime: "Arrival Time",
        departureTime: "Departure Time",
        edit: "Edit"
    },
    ru: {
        title: "Трекер Посещаемости",
        username: "Имя пользователя",
        password: "Пароль",
        rememberMe: "Запомнить меня",
        login: "Войти",
        editEmployee: "Редактировать сотрудника",
        save: "Сохранить",
        present: "Присутствие",
        latitude: "Широта",
        longitude: "Долгота",
        search: "Поиск...",
        arrivalTime: "Время прибытия",
        departureTime: "Время отбытия",
        edit: "Редактировать"
    }
};

let currentLanguage = 'en';

function setLanguage(language) {
    currentLanguage = language;
    document.querySelector('h1').textContent = translations[language].title;
    document.getElementById('username').placeholder = translations[language].username;
    document.getElementById('password').placeholder = translations[language].password;
    document.querySelector('label[for="username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="password"]').textContent = translations[language].password + ":";
    document.querySelector('label[for="remember-me"]').textContent = translations[language].rememberMe;
    document.querySelector('button[onclick="login()"]').textContent = translations[language].login;
    document.getElementById('search-input').placeholder = translations[language].search;
    document.getElementById('save-button').textContent = translations[language].save;
    document.querySelector('label[for="edit-username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="edit-present"]').textContent = translations[language].present + ":";
    document.querySelector('label[for="edit-location-lat"]').textContent = translations[language].latitude + ":";
    document.querySelector('label[for="edit-location-lon"]').textContent = translations[language].longitude + ":";
    document.querySelector('label[for="edit-arrival-time"]').textContent = translations[language].arrivalTime + ":";
    document.querySelector('label[for="edit-departure-time"]').textContent = translations[language].departureTime + ":";
}

function updateLanguageSlider(isChecked) {
    const language = isChecked ? 'ru' : 'en';
    setLanguage(language);
    document.getElementById('language-slider-label').textContent = language === 'en' ? 'English' : 'Русский';
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var eyeIcon = document.querySelector(".eye-icon i");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Example login validation
    if (username === 'admin' && password === 'password') {
        if (rememberMe) {
            localStorage.setItem('isLoggedIn', 'true');
        }
        showAttendanceTracker();
    } else {
        alert('Invalid username or password');
    }
