import { Basket } from "./basket";
import { ProductStatsItem } from "./productStatsItem";

document.addEventListener("DOMContentLoaded", () => {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawCharts);

    const stats: ProductStatsItem[] = JSON.parse(localStorage.getItem(Basket.STATS_LS_LEY));

    function drawCharts(): void {
        drawCostChart();
        drawAmountChart();

        const chartCost = document.getElementById("chart-cost-container");
        const chartAmount = document.getElementById("chart-amount-container");
        chartCost.style.display = "none";
        chartAmount.style.display = "none";

        const filters = document.querySelectorAll(".category-list > label");
        filters.forEach(value => value.addEventListener("click", () => {
            const filter = value as HTMLElement;
            if (filter.id == "cost") {
                chartCost.style.display = "inherit";
                chartAmount.style.display = "none";
            } else if (filter.id == "amount") {
                chartAmount.style.display = "inherit";
                chartCost.style.display = "none";
            }
        }));

        (filters[0] as HTMLElement).click();
    }

    function drawCostChart(): void {
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

    function drawAmountChart(): void {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Назва');
        data.addColumn('number', 'Кількість');
        data.addRows(stats.map((value, index, arr) => [value.title, value.amount]));

        var options = {
            title: 'Статистика розподілу кількості замовленої піци',
            is3D: true,
            colors: [
                "#e6ac4f", // Original
                "#de722a", // Original
                "#f5b26b", // Lighter yellow-orange
                "#f48c42", // Lighter orange
                "#ec8b2f", // Vibrant orange
                "#d97a21", // Deep orange
                "#c86d1c", // Darker orange
                "#b56316", // Dark burnt orange
                "#f7bf83", // Soft apricot
                "#ff9c4a", // Bright tangerine
                "#f4973d", // Warm pumpkin
                "#e88b33", // Autumn orange
                "#d67c29", // Rusty orange
                "#c3711f", // Rich ochre
                "#ab5e14"  // Deep sienna
              ],
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart-amount-container'));
        chart.draw(data, options);
    }
});