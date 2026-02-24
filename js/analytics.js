let userDutyChart = null;

function renderUserDutyChart() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const duties = JSON.parse(localStorage.getItem("duties")) || [];

    const participants = users.filter(u => u.role === "user");

    const labels = participants.map(u => u.name);
    const completedData = participants.map(u =>
        duties.filter(d => d.assignedTo === u.email && d.status === "completed").length
    );
    const pendingData = participants.map(u =>
        duties.filter(d => d.assignedTo === u.email && d.status === "pending").length
    );

    const ctx = document.getElementById("userDutyChart").getContext("2d");

    if (userDutyChart) {
        userDutyChart.destroy();
    }

    userDutyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Completed Duties',
                    data: completedData,
                    backgroundColor: '#10b981',
                },
                {
                    label: 'Pending Duties',
                    data: pendingData,
                    backgroundColor: '#f59e0b',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Duty Completion Status per User' }
            },
            scales: {
                y: { beginAtZero: true, stepSize: 1, title: { display: true, text: 'Number of Duties' } },
                x: { title: { display: true, text: 'Users' } }
            }
        }
    });
}

renderUserDutyChart();