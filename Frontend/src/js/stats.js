"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basket_1 = require("./basket");
document.addEventListener("DOMContentLoaded", () => {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        const stats = JSON.parse(localStorage.getItem(basket_1.Basket.STATS_LS_LEY));
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Title');
        data.addColumn('number', 'Cost');
        data.addRows(stats.map((value, index, arr) => [value.title, value.cost]));
        var options = { 'title': 'Pizza cost statistics',
            'width': 400,
            'height': 300 };
        var chart = new google.visualization.PieChart(document.getElementById('chart-container'));
        chart.draw(data, options);
    }
});
//# sourceMappingURL=stats.js.map