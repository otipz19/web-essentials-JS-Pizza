"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basket_1 = require("./basket");
document.addEventListener("DOMContentLoaded", () => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawCharts);
    const stats = JSON.parse(localStorage.getItem(basket_1.Basket.STATS_LS_LEY));
    function drawCharts() {
        drawCostChart();
        drawAmountChart();
        const chartCost = document.getElementById("chart-cost-container");
        const chartAmount = document.getElementById("chart-amount-container");
        chartCost.style.display = "none";
        chartAmount.style.display = "none";
        const filters = document.querySelectorAll(".category-list > label");
        filters.forEach(value => value.addEventListener("click", () => {
            const filter = value;
            if (filter.id == "cost") {
                chartCost.style.display = "inherit";
                chartAmount.style.display = "none";
            }
            else if (filter.id == "amount") {
                chartAmount.style.display = "inherit";
                chartCost.style.display = "none";
            }
        }));
        filters[0].click();
    }
    function drawCostChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Назва');
        data.addColumn('number', 'Вартість');
        data.addRows(stats.map((value, index, arr) => [value.title, value.cost]));
        var options = {
            title: 'Статистика розподілу вартості замовленої піци',
            colors: ["#e6ac4f"],
        };
        var chart = new google.visualization.BarChart(document.getElementById('chart-cost-container'));
        chart.draw(data, options);
    }
    function drawAmountChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Назва');
        data.addColumn('number', 'Кількість');
        data.addRows(stats.map((value, index, arr) => [value.title, value.amount]));
        var options = {
            title: 'Статистика розподілу кількості замовленої піци',
            is3D: true,
            colors: [
                "#e6ac4f",
                "#de722a",
                "#f5b26b",
                "#f48c42",
                "#ec8b2f",
                "#d97a21",
                "#c86d1c",
                "#b56316",
                "#f7bf83",
                "#ff9c4a",
                "#f4973d",
                "#e88b33",
                "#d67c29",
                "#c3711f",
                "#ab5e14"
            ],
        };
        var chart = new google.visualization.PieChart(document.getElementById('chart-amount-container'));
        chart.draw(data, options);
    }
});
//# sourceMappingURL=stats.js.map