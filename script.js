const translations = {
    en: {
        title: "Attendance Tracker",
        username: "Username",
        password: "Password",
        rememberMe: "Remember me",
        login: "Login",
        search: "Search",
        editEmployee: "Edit Employee",
        save: "Save",
        present: "Present",
        latitude: "Latitude",
        longitude: "Longitude",
    },
    ru: {
        title: "Трекер Посещаемости",
        username: "Имя пользователя",
        password: "Пароль",
        rememberMe: "Запомнить меня",
        login: "Войти",
        search: "Поиск",
        editEmployee: "Редактировать сотрудника",
        save: "Сохранить",
        present: "Присутствие",
        latitude: "Широта",
        longitude: "Долгота",
    }
};

let currentLanguage = 'en';

document.addEventListener("DOMContentLoaded", function() {
    checkLoginStatus();
    setLanguage(currentLanguage);
    fetchAttendanceData();
});

function setLanguage(language) {
    currentLanguage = language;
    document.querySelector('h1').textContent = translations[language].title;
    document.querySelector('label[for="username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="password"]').textContent = translations[language].password + ":";
    document.querySelector('label[for="remember-me"]').textContent = translations[language].rememberMe;
    document.querySelector('button[onclick="login()"]').textContent = translations[language].login;
    document.getElementById('edit-title').textContent = translations[language].editEmployee;
    document.getElementById('save-button').textContent = translations[language].save;
    document.querySelector('label[for="edit-username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="edit-present"]').textContent = translations[language].present + ":";
    document.querySelector('label[for="edit-location-lat"]').textContent = translations[language].latitude + ":";
    document.querySelector('label[for="edit-location-lon"]').textContent = translations[language].longitude + ":";
    document.querySelector('label[for="search-input"]').textContent = translations[language].search + ":";
    fetchAttendanceData();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (username === "admin" && password === "password") {
        if (rememberMe) {
            localStorage.setItem('isLoggedIn', 'true');
        }
        sessionStorage.setItem('isLoggedIn', 'true');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    } else {
        alert("Invalid username or password.");
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isLoggedIn');
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('main-container').style.display = 'none';
    }
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

function fetchAttendanceData() {
    fetch('https://5b6389b0-984f-4896-abbd-bae6987a3853-00-nta4awm7pbls.sisko.replit.dev:8080/api/employees')
        .then(response => response.json())
        .then(data => {
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
                    <th>${translations[currentLanguage].edit}</th>
                </tr>
            `;

            data.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee[1]}</td>
                    <td>${employee[5]}</td>
                    <td>${employee[6]}</td>
                    <td><button onclick="editEmployee('${employee[0]}', '${employee[1]}', ${employee[2]}, ${employee[3]}, ${employee[4]}, '${employee[5]}', '${employee[6]}')">${translations[currentLanguage].edit}</button></td>
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
