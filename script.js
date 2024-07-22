let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;
let summaryChart;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function addTransaction() {
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (description && amount) {
        transactions.push({ type, description, amount, category });
        updateSummary();
        showScreen('home-screen');
    } else {
        alert('Please enter a description and amount.');
    }
}

function updateSummary() {
    totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').innerText = totalIncome.toFixed(2);
    document.getElementById('total-expenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('balance').innerText = balance.toFixed(2);

    renderChart();
}

function renderChart() {
    const ctx = document.getElementById('summaryChart').getContext('2d');

    // If a chart instance already exists, destroy it before creating a new one
    if (summaryChart) {
        summaryChart.destroy();
    }

    const incomeData = transactions.filter(t => t.type === 'income').reduce((data, t) => {
        data[t.category] = (data[t.category] || 0) + t.amount;
        return data;
    }, {});
    const expenseData = transactions.filter(t => t.type === 'expense').reduce((data, t) => {
        data[t.category] = (data[t.category] || 0) + t.amount;
        return data;
    }, {});

    const data = {
        labels: [...new Set([...Object.keys(incomeData), ...Object.keys(expenseData)])],
        datasets: [
            {
                label: 'Income',
                data: Object.keys(incomeData).map(key => incomeData[key]),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Expenses',
                data: Object.keys(expenseData).map(key => expenseData[key]),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    summaryChart = new Chart(ctx, config);
}

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', () => {
    renderChart();
});

