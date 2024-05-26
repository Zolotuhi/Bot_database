const translations = {
    en: {
        title: "Attendance Tracker",
        username: "Username",
        arrivalTime: "Arrival Time",
        departureTime: "Departure Time"
    },
    ru: {
        title: "Трекер Посещаемости",
        username: "Имя пользователя",
        arrivalTime: "Время прибытия",
        departureTime: "Время ухода"
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
    fetchAttendanceData();
}

fetch('https://5b6389b0-984f-4896-abbd-bae6987a3853-00-nta4awm7pbls.sisko.repl.co/api/employees')
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
            </tr>
        `;

        data.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.username}</td>
                <td>${employee.arrival_time}</td>
                <td>${employee.departure_time}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
    })
    .catch(error => console.error('Error fetching attendance data:', error));


