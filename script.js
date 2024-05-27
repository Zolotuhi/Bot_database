const translations = {
    en: {
        title: "Attendance Tracker",
        username: "Username",
        arrivalTime: "Arrival Time",
        departureTime: "Departure Time",
        edit: "Edit",
        editEmployee: "Edit Employee",
        save: "Save",
        sendLocation: "Send Location",
        changeLanguage: "Change Language",
        reportEmergency: "Report Emergency",
        helpCommand: "Help",
        viewDatabase: "View Database",
        notAuthorized: "You are not authorized to view the database."
    },
    ru: {
        title: "Трекер Посещаемости",
        username: "Имя пользователя",
        arrivalTime: "Время прибытия",
        departureTime: "Время ухода",
        edit: "Редактировать",
        editEmployee: "Редактировать сотрудника",
        save: "Сохранить",
        sendLocation: "Отправить местоположение",
        changeLanguage: "Изменить язык",
        reportEmergency: "Сообщить о ЧС",
        helpCommand: "Помощь",
        viewDatabase: "Просмотр базы данных",
        notAuthorized: "Вы не авторизованы для просмотра базы данных."
    }
};

let currentLanguage = 'en';

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
    document.querySelector('label[for="edit-present"]').textContent = translations[language].sendLocation + ":";
    document.querySelector('label[for="edit-location-lat"]').textContent = "Latitude" + ":";
    document.querySelector('label[for="edit-location-lon"]').textContent = "Longitude" + ":";
    document.querySelector('label[for="edit-arrival-time"]').textContent = translations[language].arrivalTime + ":";
    document.querySelector('label[for="edit-departure-time"]').textContent = translations[language].departureTime + ":";
    fetchAttendanceData();
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
    const lat = document.getElementById('edit-location-lat').value;
    const lon = document.getElementById('edit-location-lon').value;
    const arrivalTime = document.getElementById('edit-arrival-time').value;
    const departureTime = document.getElementById('edit-departure-time').value;

    fetch(`https://5b6389b0-984f-4896-abbd-bae6987a3853-00-nta4awm7pbls.sisko.replit.dev:8080/api/employees/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            present: present,
            location_lat: parseFloat(lat),
            location_lon: parseFloat(lon),
            arrival_time: arrivalTime,
            departure_time: departureTime
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('edit-form-container').style.display = 'none';
        fetchAttendanceData();
    })
    .catch(error => console.error('Error updating employee data:', error));
}
