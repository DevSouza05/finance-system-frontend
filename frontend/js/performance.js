'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert("⚠️ Você precisa estar logado!");
        window.location.href = 'login.html';
        return;
    }

    const dataKey = `finance_data_${loggedInUser}`;
    const getFinanceData = () => JSON.parse(localStorage.getItem(dataKey)) || {};
    const data = getFinanceData();
    let evolutionChart = null;

    function renderEvolutionChart() {
        const ctx = document.getElementById('evolutionChart').getContext('2d');
        const allMonths = Object.keys(data).sort();

        const monthlyData = allMonths.map(month => {
            const items = data[month] || [];
            const income = items.filter(i => i.type === 'Entrada').reduce((acc, i) => acc + parseFloat(i.amount), 0);
            const expense = items.filter(i => i.type === 'Saída').reduce((acc, i) => acc + parseFloat(i.amount), 0);
            return { month, income, expense };
        });

        if (evolutionChart) {
            evolutionChart.destroy();
        }

        evolutionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.map(d => d.month),
                datasets: [{
                    label: 'Entradas',
                    data: monthlyData.map(d => d.income),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1
                }, {
                    label: 'Saídas',
                    data: monthlyData.map(d => d.expense),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução Financeira Mensal'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Mês'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)'
                        }
                    }
                }
            }
        });
    }

    renderEvolutionChart();
});
