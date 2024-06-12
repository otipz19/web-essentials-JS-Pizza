import { Basket } from "./basket";
import { ProductStatsItem } from "./productStatsItem";

document.addEventListener("DOMContentLoaded", () => {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(onLoad);

    function onLoad(): void {
        const stats: ProductStatsItem[] = JSON.parse(localStorage.getItem(Basket.STATS_LS_LEY));
        const costChart = new CostChart(stats);
        const amountChart = new AmountChart(stats);

        drawCharts();

        // How to debounce event?
        // let resizeTimer;
        // window.addEventListener("resize", () => {
        //     clearTimeout(resizeTimer);
        //     setTimeout(() => drawCharts, 250);
        // });

        window.onresize = drawCharts;

        setupFilters();

        function drawCharts(): void {
            costChart.draw();
            amountChart.draw();
        }

        function setupFilters() {
            const filters = document.querySelectorAll(".category-list > label");
            filters.forEach(value => value.addEventListener("click", () => {
                const filter = value as HTMLElement;
                if (filter.id == "cost") {
                    costChart.show();
                    amountChart.hide();
                } else if (filter.id == "amount") {
                    amountChart.show();
                    costChart.hide();
                }
                drawCharts();
            }));

            (filters[0] as HTMLElement).click();
        }
    }
});

abstract class Chart {
    private data: google.visualization.DataTable;
    private options: any;
    private chart: google.visualization.BarChart | google.visualization.PieChart;

    protected stats: ProductStatsItem[];
    protected container: HTMLElement;

    constructor(stats: ProductStatsItem[]) {
        this.stats = stats;
        this.container = this.getContainer();
        this.data = this.buildData();
        this.options = this.buildOptions();
        this.chart = this.buildChart();
    }

    public draw(): void {
        this.chart.draw(this.data, this.options);
    }

    public show(): void {
        this.container.style.display = "inherit";
    }

    public hide(): void {
        this.container.style.display = "none";
    }

    protected abstract buildData(): google.visualization.DataTable;
    protected abstract buildOptions(): any;
    protected abstract getContainer(): HTMLElement;
    protected abstract buildChart(): google.visualization.BarChart | google.visualization.PieChart;
}

class CostChart extends Chart {
    constructor(stats: ProductStatsItem[]) {
        super(stats);
    }

    protected buildData(): google.visualization.DataTable {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Назва');
        data.addColumn('number', 'Вартість');
        data.addRows(this.stats.map((value, index, arr) => [value.title, value.cost]));
        return data;
    }

    protected buildOptions() {
        return {
            title: 'Статистика розподілу вартості замовленої піци',
            colors: ["#e6ac4f"],
        };
    }

    protected getContainer(): HTMLElement {
        return document.getElementById('chart-cost-container')
    }

    protected buildChart(): google.visualization.BarChart | google.visualization.PieChart {
        return new google.visualization.BarChart(this.container);
    }
}

class AmountChart extends Chart {
    constructor(stats: ProductStatsItem[]) {
        super(stats);
    }

    protected buildData(): google.visualization.DataTable {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Назва');
        data.addColumn('number', 'Кількість');
        data.addRows(this.stats.map((value, index, arr) => [value.title, value.amount]));
        return data;
    }

    protected buildOptions() {
        return {
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
    }

    protected getContainer(): HTMLElement {
        return document.getElementById('chart-amount-container');
    }

    protected buildChart(): google.visualization.BarChart | google.visualization.PieChart {
        return new google.visualization.PieChart(this.container);
    }
}