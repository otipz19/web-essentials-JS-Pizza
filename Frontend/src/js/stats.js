"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basket_1 = require("./basket");
document.addEventListener("DOMContentLoaded", () => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(onLoad);
    function onLoad() {
        const stats = JSON.parse(localStorage.getItem(basket_1.Basket.STATS_LS_LEY));
        const costChart = new CostChart(stats);
        const amountChart = new AmountChart(stats);
        drawCharts();
        window.onresize = drawCharts;
        setupFilters();
        function drawCharts() {
            costChart.draw();
            amountChart.draw();
        }
        function setupFilters() {
            const filters = document.querySelectorAll(".category-list > label");
            filters.forEach(value => value.addEventListener("click", () => {
                const filter = value;
                if (filter.id == "cost") {
                    costChart.show();
                    amountChart.hide();
                }
                else if (filter.id == "amount") {
                    amountChart.show();
                    costChart.hide();
                }
                drawCharts();
            }));
            filters[0].click();
        }
    }
});
class Chart {
    constructor(stats) {
        this.stats = stats;
        this.container = this.getContainer();
        this.data = this.buildData();
        this.options = this.buildOptions();
        this.chart = this.buildChart();
    }
    draw() {
        this.chart.draw(this.data, this.options);
    }
    show() {
        this.container.style.display = "inherit";
    }
    hide() {
        this.container.style.display = "none";
    }
}
class CostChart extends Chart {
    constructor(stats) {
        super(stats);
    }
    buildData() {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Назва');
        data.addColumn('number', 'Вартість');
        data.addRows(this.stats.map((value, index, arr) => [value.title, value.cost]));
        return data;
    }
    buildOptions() {
        return {
            title: 'Статистика розподілу вартості замовленої піци',
            colors: ["#e6ac4f"],
        };
    }
    getContainer() {
        return document.getElementById('chart-cost-container');
    }
    buildChart() {
        return new google.visualization.BarChart(this.container);
    }
}
class AmountChart extends Chart {
    constructor(stats) {
        super(stats);
    }
    buildData() {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Назва');
        data.addColumn('number', 'Кількість');
        data.addRows(this.stats.map((value, index, arr) => [value.title, value.amount]));
        return data;
    }
    buildOptions() {
        return {
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
    }
    getContainer() {
        return document.getElementById('chart-amount-container');
    }
    buildChart() {
        return new google.visualization.PieChart(this.container);
    }
}
//# sourceMappingURL=stats.js.map