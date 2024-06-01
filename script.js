const translations = {
    en: {
        title: "Attendance Tracker",
        username: "Username",
        arrivalTime: "Arrival Time",
        departureTime: "Departure Time",
        edit: "Edit",
        editEmployee: "Edit Employee",
        save: "Save",
        present: "Present",
        latitude: "Latitude",
        longitude: "Longitude",
        search: "Search"
    },
    ru: {
        title: "Трекер Посещаемости",
        username: "Имя пользователя",
        arrivalTime: "Время прибытия",
        departureTime: "Время ухода",
        edit: "Редактировать",
        editEmployee: "Редактировать сотрудника",
        save: "Сохранить",
        present: "Присутствие",
        latitude: "Широта",
        longitude: "Долгота",
        search: "Поиск"
    }
};

let currentLanguage = 'ru';
let attendanceData = [];

document.addEventListener("DOMContentLoaded", function() {
    setLanguage(currentLanguage);
    fetchAttendanceData();
});

function setLanguage(language) {
    currentLanguage = language;
    document.querySelector('h1').textContent = translations[language].title;
    document.getElementById('edit-title').textContent = translations[language].editEmployee;
    document.getElementById('save-button').textContent = translations[language].save;
    document.querySelector('label[for="edit-username"]').textContent = translations[language].username + ":";
    document.querySelector('label[for="edit-present"]').textContent = translations[language].present + ":";
    document.querySelector('label[for="edit-location-lat"]').textContent = translations[language].latitude + ":";
    document.querySelector('label[for="edit-location-lon"]').textContent = translations[language].longitude + ":";
    document.querySelector('label[for="edit-arrival-time"]').textContent = translations[language].arrivalTime + ":";
    document.querySelector('label[for="edit-departure-time"]').textContent = translations[language].departureTime + ":";
    document.querySelector('label[for="search-input"]').textContent = translations[language].search + ":";
    fetchAttendanceData();
}

function fetchAttendanceData() {
    fetch('https://5b6389b0-984f-4896-abbd-bae6987a3853-00-nta4awm7pbls.sisko.replit.dev:8080/api/employees')
        .then(response => response.json())
        .then(data => {
            attendanceData = data;
            displayAttendanceData(data);
        })
        .catch(error => console.error('Ошибка при получении данных о посещаемости:', error));
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
            <th>${translations[currentLanguage].edit}</th>
        </tr>
    `;

    data.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.username}</td>
            <td>${employee.arrival_time}</td>
            <td>${employee.departure_time}</td>
            <td><button class="edit-btn" onclick="editEmployee('${employee.id}', '${employee.username}', ${employee.present}, ${employee.location_lat}, ${employee.location_lon}, '${employee.arrival_time}', '${employee.departure_time}')">${translations[currentLanguage].edit}</button></td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

function filterAttendanceData() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredData = attendanceData.filter(employee =>
        employee.username.toLowerCase().includes(searchInput)
    );
    displayAttendanceData(filteredData);
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
