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
        sendLocation: "Send Location",
        changeLanguage: "Change Language",
        reportEmergency: "Report Emergency",
        helpCommand: "Help",
        viewDatabase: "View Database",
        notAuthorized: "You are not authorized to view the database.",
        presenceMessage: "Employee @{username} (ID: {user_id}) is at the workplace.",
        absenceMessage: "Employee @{username} (ID: {user_id}) has left the workplace.",
        chooseLanguage: "Please choose your language:",
        languageSet: "Language has been set to English.",
        languageNotSupported: "Language not supported. Please choose en, ru, or kz.",
        provideLanguageCode: "Please provide a language code (en, ru, kz).",
        helpMessage: `
            /start - Start interacting with the bot
            /help - Show this help message
            /language - Choose language
            /create_event - Create a new event in the calendar
            /attendance_report - Send attendance report
            /add_absence - Add an absence
        `
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
        sendLocation: "Отправить местоположение",
        changeLanguage: "Изменить язык",
        reportEmergency: "Сообщить о ЧС",
        helpCommand: "Помощь",
        viewDatabase: "Просмотр базы данных",
        notAuthorized: "Вы не авторизованы для просмотра базы данных.",
        presenceMessage: "Сотрудник @{username} (ID: {user_id}) на рабочем месте.",
        absenceMessage: "Сотрудник @{username} (ID: {user_id}) покинул рабочее место.",
        chooseLanguage: "Пожалуйста, выберите язык:",
        languageSet: "Язык был установлен на русский.",
        languageNotSupported: "Язык не поддерживается. Пожалуйста, выберите en, ru или kz.",
        provideLanguageCode: "Пожалуйста, укажите код языка (en, ru, kz).",
        helpMessage: `
            /start - Начать взаимодействие с ботом
            /help - Показать это сообщение помощи
            /language - Выбрать язык
            /create_event - Создать новое событие в календаре
            /attendance_report - Отправить отчет о посещаемости
            /add_absence - Добавить отсутствие
        `
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
}

function showAttendanceTracker() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('attendance-container').style.display = 'block';
    setLanguage(currentLanguage); // Ensure the correct language is set after showing the container
    fetchAttendanceData();
}

function fetchAttendanceData() {
    fetch('https://5b6389b0-984f-4896-abbd-bae6987a3853-00-nta4awm7pbls.sisko.replit.dev:8080/api/employees')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('attendance-table-container');
            container.innerHTML = '';

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            thead.innerHTML = `
                <tr>
                    <th>${translations[currentLanguage].username}</th>
                    <th>${translations[currentLanguage].arrivalTime}</th>
                    <th>${translations[currentLanguage].departureTime}</th>
                    <th>Edit</th>
                </tr>
            `;

            data.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee[1]}</td>
                    <td>${employee[5]}</td>
                    <td>${employee[6]}</td>
                    <td><button onclick="editEmployee('${employee[0]}', '${employee[1]}', ${employee[2]}, ${employee[3]}, ${employee[4]}, '${employee[5]}', '${employee[6]}')">Edit</button></td>
                `;
                tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            container.appendChild(table);
        })
        .catch(error => console.error('Error fetching attendance data:', error));
}

function editEmployee(userId, username, present, lat, lon, arrivalTime, departureTime) {
    document.getElementById('edit-user-id').value = userId;
    document.getElementById('edit-username').value = username;
    document.getElementById('edit-present').checked = present;
    document.getElementById('edit-location-lat').value = lat;
    document.getElementById('edit-location-lon').value = lon;
    document.getElementById('edit-arrival-time').value = arrivalTime;
    document.getElementById('edit-departure-time').value = departureTime;
    document.getElementById('edit-form-container').style.display = 'block';
}

function saveEdit() {
    const userId = document.getElementById('edit-user-id').value;
    const username = document.getElementById('edit-username').value;
    const present = document.getElementById('edit-present').checked;
    const lat = parseFloat(document.getElementById('edit-location-lat').value);
    const lon = parseFloat(document.getElementById('edit-location-lon').value);
    const arrivalTime = document.getElementById('edit-arrival-time').value;
    const departureTime = document.getElementById('edit-departure-time').value;

    if (isNaN(lat) || isNaN(lon)) {
        alert("Latitude and Longitude must be valid numbers.");
        return;
    }

    const data = {
        username: username,
        present: present,
        location_lat: lat,
        location_lon: lon,
        arrival_time: arrivalTime,
        departure_time: departureTime
    };

    fetch(`https://5b6389b0-984f-4896-abbd-bae6987a3853-00-nta4awm7pbls.sisko.replit.dev:8080/api/employees/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`Server error: ${err.detail}`);
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('edit-form-container').style.display = 'none';
        fetchAttendanceData();
    })
    .catch(error => {
        console.error('Error updating employee data:', error);
        alert(`Error updating employee data: ${error.message}`);
    });
}

function search() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const username = cells[0].textContent.toLowerCase();
        if (username.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
