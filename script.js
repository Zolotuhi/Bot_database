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
        alert('Неверное имя пользователя или пароль');
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
                    <th>${translations[currentLanguage].edit}</th>
                </tr>
            `;

            data.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.username || ''}</td>
                    <td>${employee.arrival_time || ''}</td>
                    <td>${employee.departure_time || ''}</td>
                    <td><button onclick="editEmployee('${employee.id}', '${employee.username}', ${employee.present}, ${employee.location_lat}, ${employee.location_lon}, '${employee.arrival_time}', '${employee.departure_time}')">${translations[currentLanguage].edit}</button></td>
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
    document.getElementById('edit-username').value = username || '';
    document.getElementById('edit-present').checked = present || false;
    document.getElementById('edit-location-lat').value = lat || '';
    document.getElementById('edit-location-lon').value = lon || '';
    document.getElementById('edit-arrival-time').value = arrivalTime || '';
    document.getElementById('edit-departure-time').value = departureTime || '';
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
        alert("Широта и долгота должны быть допустимыми числами.");
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
                throw new Error(`Ошибка сервера: ${err.detail}`);
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('edit-form-container').style.display = 'none';
        fetchAttendanceData();
    })
    .catch(error => {
        console.error('Ошибка при обновлении данных сотрудника:', error);
        alert(`Ошибка при обновлении данных сотрудника: ${error.message}`);
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
