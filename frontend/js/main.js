'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    const tbody = document.querySelector("tbody");
    const descItem = document.querySelector("#desc");
    const amount = document.querySelector("#amount");
    const type = document.querySelector("#type");
    const btnNew = document.querySelector("#btnNew");
    const monthSelect = document.querySelector("#monthSelect");

    const incomes = document.querySelector(".incomes");
    const expenses = document.querySelector(".expenses");
    const total = document.querySelector(".total");

    const dataKey = `finance_data_${loggedInUser}`;

    const getFinanceData = () => JSON.parse(localStorage.getItem(dataKey)) || {};
    const setFinanceData = (data) => localStorage.setItem(dataKey, JSON.stringify(data));

    let data = getFinanceData();
    let evolutionChart = null; // Variável para a instância do gráfico

    function getCurrentMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }

    // Função para renderizar o gráfico de evolução
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

    function populateMonthSelect() {
        const months = Object.keys(data).sort().reverse();
        monthSelect.innerHTML = "";
        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
    }

    btnNew.onclick = () => {
        if (descItem.value.trim() === "" || amount.value.trim() === "" || type.value === "") {
            return alert("Preencha todos os campos!");
        }

        const amountValue = parseFloat(amount.value);
        if (isNaN(amountValue) || amountValue <= 0) {
            return alert("O valor deve ser um número positivo.");
        }

        const currentMonth = getCurrentMonth();
        if (!data[currentMonth]) {
            data[currentMonth] = [];
        }

        data[currentMonth].push({
            desc: descItem.value,
            amount: amountValue.toFixed(2),
            type: type.value,
            paid: false,
        });

        setFinanceData(data);
        populateMonthSelect();
        monthSelect.value = currentMonth;
        loadItens(currentMonth);
        renderEvolutionChart(); // Atualiza o gráfico

        descItem.value = "";
        amount.value = "";
    };

    function deleteItem(month, index) {
        data[month].splice(index, 1);
        setFinanceData(data);
        loadItens(month);
        renderEvolutionChart(); // Atualiza o gráfico
    }

    function updateItemStatus(month, index, isPaid) {
        data[month][index].paid = isPaid;
        setFinanceData(data);
    }

    function insertItem(item, month, index) {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td data-label="Descrição">${item.desc}</td>
            <td data-label="Valor">R$ ${item.amount}</td>
            <td data-label="Tipo" class="columnType">
                ${item.type === "Entrada"
                    ? '<i class="bx bxs-chevron-up-circle"></i>'
                    : '<i class="bx bxs-chevron-down-circle"></i>'}
            </td>
            <td data-label="Status"><input type="checkbox" class="paid-checkbox" data-month="${month}" data-index="${index}" ${item.paid ? 'checked' : ''}></td>
            <td data-label="Ação" class="columnAction">
                <button class="deleteBtn" data-month="${month}" data-index="${index}">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);

        tr.querySelector(".deleteBtn").addEventListener("click", function () {
            const month = this.getAttribute("data-month");
            const index = parseInt(this.getAttribute("data-index"));
            deleteItem(month, index);
        });

        tr.querySelector(".paid-checkbox").addEventListener("change", function () {
            const month = this.getAttribute("data-month");
            const index = parseInt(this.getAttribute("data-index"));
            updateItemStatus(month, index, this.checked);
        });
    }

    function loadItens(month) {
        const items = data[month] || [];
        tbody.innerHTML = "";
        items.forEach((item, index) => {
            insertItem(item, month, index);
        });

        getTotals(month);
    }

    function getTotals(month) {
        const items = data[month] || [];
        const amountIncomes = items.filter(item => item.type === "Entrada").map(item => parseFloat(item.amount));
        const amountExpenses = items.filter(item => item.type === "Saída").map(item => parseFloat(item.amount));

        const totalIncomes = amountIncomes.reduce((acc, cur) => acc + cur, 0).toFixed(2);
        const totalExpenses = amountExpenses.reduce((acc, cur) => acc + cur, 0).toFixed(2);
        const totalBalance = (parseFloat(totalIncomes) - parseFloat(totalExpenses)).toFixed(2);

        incomes.textContent = totalIncomes;
        expenses.textContent = totalExpenses;
        total.textContent = totalBalance;
    }

    monthSelect.onchange = () => {
        loadItens(monthSelect.value);
    };

    // Initial Load
    populateMonthSelect();
    const initialMonth = monthSelect.value || getCurrentMonth();
    if (initialMonth) {
        monthSelect.value = initialMonth;
        loadItens(initialMonth);
    }
    renderEvolutionChart(); // Renderiza o gráfico na carga inicial
});
