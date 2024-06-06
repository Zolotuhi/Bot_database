const translations = {
    en: {
        title: "Attendance Tracker",
        username: "Username",
        arrivalTime: "Arrival Time",
        departureTime: "Departure Time",
        present: "Present",
        absences: "Absences",
        search: "Search",
        login: "Login",
        password: "Password",
        rememberMe: "Remember me",
        logout: "Logout",
        searchPlaceholder: "Search by username...",
        edit: "Edit",
        delete: "Delete"
    },
    ru: {
        title: "Трекер Посещаемости",
        username: "Имя пользователя",
        arrivalTime: "Время прибытия",
        departureTime: "Время ухода",
        present: "Присутствие",
        absences: "Отсутствия",
        search: "Поиск",
        login: "Логин",
        password: "Пароль",
        rememberMe: "Запомнить меня",
        logout: "Выйти",
        searchPlaceholder: "Поиск по имени пользователя...",
        edit: "Редактировать",
        delete: "Удалить"
    },
    kz: {
        title: "Қатысу Трекері",
        username: "Пайдаланушы аты",
        arrivalTime: "Келу уақыты",
        departureTime: "Кету уақыты",
        present: "Қатысу",
        absences: "Қатыспау",
        search: "Іздеу",
        login: "Кіру",
        password: "Құпия сөз",
        rememberMe: "Мені есте сақта",
        logout: "Шығу",
        searchPlaceholder: "Пайдаланушы аты бойынша іздеу...",
        edit: "Өңдеу",
        delete: "Жою"
    }
};

let currentLanguage = 'ru';
let attendanceData = [];

document.addEventListener("DOMContentLoaded", function() {
    setLanguage(currentLanguage);

    document.getElementById('btn-en').addEventListener('click', function() {
        setLanguage('en');
    });
    document.getElementById('btn-ru').addEventListener('click', function() {
        setLanguage('ru');
    });
    document.getElementById('btn-kz').addEventListener('click', function() {
        setLanguage('kz');
    });

    document.getElementById('toggle-password').addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        logout();
    });

    checkLogin();
});

function setLanguage(language) {
    currentLanguage = language;
    document.querySelector('h1').textContent = translations[language].title;
    document.querySelector('label[for="username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="password"]').textContent = translations[language].password + ":";
    document.querySelector('label[for="remember-me"]').textContent = translations[language].rememberMe;
    document.querySelector('button[onclick="login()"]').textContent = translations[language].login;
    document.getElementById('logoutButton').textContent = translations[language].logout;
    document.getElementById('search-label').textContent = translations[language].search + ":";
    document.getElementById('search-input').placeholder = translations[language].searchPlaceholder;
    document.getElementById('main-title').textContent = translations[language].title;
    document.getElementById('edit-title').textContent = translations[language].editEmployee;
    document.getElementById('save-button').textContent = translations[language].save;
}

function checkLogin() {
    if (localStorage.getItem("isAuthenticated") === "true") {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        setLanguage(localStorage.getItem("preferredLanguage") || currentLanguage);
        fetchAttendanceData();
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('main-container').style.display = 'none';
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "admin" && password === "admin123") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("preferredLanguage", currentLanguage);
        checkLogin();
    } else {
        alert("Invalid credentials");
    }
}

function logout() {
    localStorage.removeItem("isAuthenticated");
    checkLogin();
}

function fetchAttendanceData() {
    fetch('https://your-api-url/api/employees')
        .then(response => response.json())
        .then(data => {
            attendanceData = data;
            displayAttendanceData(data);
        })
        .catch(error => console.error('Error fetching attendance data:', error));
}

function displayAttendanceData(data) {
    const container = document.getElementById('attendance-container');
    container.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    thead.innerHTML = `
        <tr>
            <th>${translations[currentLanguage].username}</th>
            <th>${translations[currentLanguage].arrivalTime}</th>
            <th>${translations[currentLanguage].departureTime}</th>
            <th>${translations[currentLanguage].present}</th>
            <th>${translations[currentLanguage].absences}</th>
            <th>${translations[currentLanguage].edit}</th>
            <th>${translations[currentLanguage].delete}</th>
        </tr>
    `;

    data.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.username}</td>
            <td>${employee.arrival_time}</td>
            <td>${employee.departure_time}</td>
            <td>${employee.present ? '✓' : ''}</td>
            <td>${employee.absences}</td>
            <td><button class="edit-btn" onclick="editEmployee('${employee.user_id}', '${employee.username}', ${employee.present}, ${employee.location_lat}, ${employee.location_lon}, '${employee.arrival_time}', '${employee.departure_time}', '${employee.absences}')">${translations[currentLanguage].edit}</button></td>
            <td><button class="delete-btn" onclick="deleteEmployee('${employee.user_id}')">${translations[currentLanguage].delete}</button></td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

function editEmployee(userId, username, present, lat, lon, arrivalTime, departureTime, absences) {
    document.getElementById('edit-user-id').value = userId;
    document.getElementById('edit-username').value = username;
    document.getElementById('edit-present').checked = present;
    document.getElementById('edit-location-lat').value = lat;
    document.getElementById('edit-location-lon').value = lon;
    document.getElementById('edit-arrival-time').value = arrivalTime;
    document.getElementById('edit-departure-time').value = departureTime;
    document.getElementById('edit-absences').value = absences;
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
    const absences = document.getElementById('edit-absences').value;

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
        departure_time: departureTime,
        absences: absences
    };

    fetch(`https://your-api-url/api/employees/${userId}`, {
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

function deleteEmployee(userId) {
    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    fetch(`https://your-api-url/api/employees/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`Server error: ${err.detail}`);
            });
        }
        fetchAttendanceData();
    })
    .catch(error => {
        console.error('Error deleting employee:', error);
        alert(`Error deleting employee: ${error.message}`);
    });
}

function filterAttendanceData() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const filteredData = attendanceData.filter(employee =>
        employee.username.toLowerCase().includes(searchValue)
    );
    displayAttendanceData(filteredData);
}
