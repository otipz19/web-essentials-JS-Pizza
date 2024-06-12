(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basket = void 0;
const basketItem_1 = require("./basketItem");
class Basket {
    constructor(element, basketMediator) {
        this.basketMediator = basketMediator;
        this.ordersListElement = element;
        this.ordersAmountElement = document.querySelector(".orders-label > span");
        this.totalPriceElement = document.querySelector(".total-price");
        this.setupClearBtn();
        this.setupOrderBtn();
        this.loadItemsFromLocalStorage();
        this.onItemsUpdated();
    }
    setupClearBtn() {
        const clearInputBtn = document.querySelector(".clear-orders");
        clearInputBtn.addEventListener("click", event => {
            event.preventDefault();
            this.clear();
        });
    }
    setupOrderBtn() {
        const orderBtn = document.querySelector(".order-btn");
        orderBtn.addEventListener("click", event => {
            let statsItems = this.items.map((value, index, arr) => {
                return {
                    title: `${value.pizza.title} (${value.option.title})`,
                    amount: value.amount,
                    cost: value.totalPrice(),
                };
            });
            localStorage.setItem(Basket.STATS_LS_LEY, JSON.stringify(statsItems));
        });
    }
    loadItemsFromLocalStorage() {
        this.items = [];
        let fromLocalStorage = this.readLocalStorage();
        for (let item of fromLocalStorage.items) {
            let [pizza, option] = this.basketMediator.get(item.pizzaId, item.optionId);
            let basketItem = new basketItem_1.BasketItem(this, pizza, option);
            this.items.push(basketItem);
            this.ordersListElement.appendChild(basketItem.card);
            basketItem.amount = item.amount;
            basketItem.updateAmount();
        }
    }
    add(pizza, option) {
        let item = this.getItem(pizza, option);
        if (item === null) {
            item = new basketItem_1.BasketItem(this, pizza, option);
            this.items.push(item);
            this.ordersListElement.appendChild(item.card);
        }
        else {
            item.increment();
        }
        this.onItemsUpdated();
        return item;
    }
    getItem(pizza, option) {
        let filtered = this.items.filter(item => item.pizza === pizza && item.option === option);
        return filtered.length == 1 ? filtered[0] : null;
    }
    remove(toRemove) {
        let index = this.items.indexOf(toRemove);
        this.items.splice(index, 1);
        this.onItemsUpdated();
    }
    clear() {
        let toDelete = [...this.items];
        toDelete.forEach(item => item.remove());
        this.onItemsUpdated();
    }
    onItemsUpdated() {
        this.ordersAmountElement.innerText = this.items.length.toString();
        let totalPrice = this.items.reduce((res, el) => res + el.totalPrice(), 0);
        this.totalPriceElement.innerText = `${totalPrice}  грн.`;
        this.serialize();
    }
    serialize() {
        let itemsSerializable = this.items.map(item => {
            return {
                pizzaId: item.pizza.id,
                optionId: item.option.id,
                amount: item.amount,
            };
        });
        let basketSerializable = {
            items: itemsSerializable,
        };
        this.writeLocalStorage(basketSerializable);
    }
    writeLocalStorage(basket) {
        localStorage.setItem(Basket.BASKET_LS_KEY, JSON.stringify(basket));
    }
    readLocalStorage() {
        if (localStorage.getItem(Basket.BASKET_LS_KEY) === null) {
            localStorage.setItem(Basket.BASKET_LS_KEY, '{"items": []}');
        }
        return JSON.parse(localStorage.getItem(Basket.BASKET_LS_KEY));
    }
}
exports.Basket = Basket;
Basket.BASKET_LS_KEY = "BASKET_KEY";
Basket.STATS_LS_LEY = "STATS_KEY";

},{"./basketItem":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketItem = void 0;
const utils_1 = require("./utils");
class BasketItem {
    constructor(basket, pizza, option) {
        this.basket = basket;
        this.pizza = pizza;
        this.option = option;
        this.amount = 1;
        this.buildElement();
    }
    buildElement() {
        const template = document.getElementById("order-card-template");
        this.card = (0, utils_1.cloneTemplateContent)(template);
        (0, utils_1.loadValueToElementBySelector)(this.card, ".title", `${this.pizza.title} (${this.option.title})`);
        (0, utils_1.loadValueToElementBySelector)(this.card, ".size", this.option.size.toString());
        (0, utils_1.loadValueToElementBySelector)(this.card, ".weight", this.option.weight.toString());
        this.onAmountUpdated();
        this.addClickHandlerToBtn(".sub", () => this.decrement());
        this.addClickHandlerToBtn(".add", () => this.increment());
        this.addClickHandlerToBtn(".cancel", () => this.remove());
    }
    addClickHandlerToBtn(selector, handler) {
        this.getBtn(selector).addEventListener("click", event => {
            event.preventDefault();
            handler();
        });
    }
    getBtn(selector) {
        return this.card.querySelector(selector);
    }
    onAmountUpdated() {
        this.updateAmount();
        this.basket.onItemsUpdated();
    }
    updateAmount() {
        (0, utils_1.loadValueToElementBySelector)(this.card, ".cost", this.totalPrice().toString());
        (0, utils_1.loadValueToElementBySelector)(this.card, ".amount .value", this.amount.toString());
    }
    totalPrice() {
        return this.amount * this.option.price;
    }
    increment() {
        this.changeAmount(this.amount + 1);
    }
    decrement() {
        this.changeAmount(this.amount - 1);
    }
    changeAmount(value) {
        this.amount = value;
        if (this.amount < 1) {
            this.remove();
        }
        else {
            this.onAmountUpdated();
        }
    }
    remove() {
        this.card.remove();
        this.basket.remove(this);
    }
}
exports.BasketItem = BasketItem;

},{"./utils":4}],3:[function(require,module,exports){
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

},{"./basket":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadValueToElementBySelector = exports.cloneTemplateContent = void 0;
function cloneTemplateContent(template) {
    var _a, _b;
    return (_b = (_a = template.content) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
}
exports.cloneTemplateContent = cloneTemplateContent;
function loadValueToElementBySelector(parent, selector, value) {
    let element = parent.querySelector(selector);
    element.innerText = value;
}
exports.loadValueToElementBySelector = loadValueToElementBySelector;

},{}]},{},[3]);
