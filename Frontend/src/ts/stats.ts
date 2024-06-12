import { Basket } from "./basket";
import { ProductStatsItem } from "./productStatsItem";

document.addEventListener("DOMContentLoaded", () => {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    function drawChart(): void {
        const stats: ProductStatsItem[] = JSON.parse(localStorage.getItem(Basket.STATS_LS_LEY));

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Title');
        data.addColumn('number', 'Cost');
        data.addRows(stats.map((value, index, arr) => [value.title, value.cost]));

        // Set chart options
        var options = {'title':'Pizza cost statistics',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart-container'));
        chart.draw(data, options);
    }
});