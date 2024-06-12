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

},{"./utils":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketMediator = void 0;
class BasketMediator {
    add(pizza, option) {
        this.basket.add(pizza, option);
    }
    get(pizzaId, optionId) {
        return this.pizzaList.get(pizzaId, optionId);
    }
}
exports.BasketMediator = BasketMediator;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basket_1 = require("./basket");
const pizzaList_1 = require("./pizzaList");
const basketMediator_1 = require("./basketMediator");
document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/pizza.json")
        .then(response => response.json())
        .then(data => {
        const basketMediator = new basketMediator_1.BasketMediator();
        const pizzaList = new pizzaList_1.PizzaList(data, basketMediator);
        basketMediator.pizzaList = pizzaList;
        const basket = new basket_1.Basket(document.querySelector(".orders-list"), basketMediator);
        basketMediator.basket = basket;
    });
});

},{"./basket":1,"./basketMediator":3,"./pizzaList":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PizzaList = void 0;
const utils_1 = require("./utils");
class PizzaList {
    constructor(data, basketMediator) {
        this.data = data;
        this.basketMediator = basketMediator;
        this.pizzaCards = [];
        this.loadData(data);
        this.setupFilters();
    }
    loadData(data) {
        const listContainer = document.querySelector("div#pizza_list");
        data.forEach(pizza => {
            let pizzaCard = this.buildPizzaElement(pizza);
            listContainer.appendChild(pizzaCard);
            this.pizzaCards.push(pizzaCard);
        });
    }
    buildPizzaElement(pizza) {
        const cardTemplate = document.getElementById("pizza-card-template");
        ;
        let pizzaElement = (0, utils_1.cloneTemplateContent)(cardTemplate);
        this.loadTag(pizzaElement, pizza);
        this.loadImg(pizzaElement, pizza);
        (0, utils_1.loadValueToElementBySelector)(pizzaElement, ".title", pizza.title);
        (0, utils_1.loadValueToElementBySelector)(pizzaElement, ".subtitle", pizza.subtitle);
        (0, utils_1.loadValueToElementBySelector)(pizzaElement, ".description", pizza.description);
        this.loadOptions(pizzaElement, pizza);
        pizzaElement.setAttribute("data-categories", pizza.categories.join(','));
        return pizzaElement;
    }
    loadTag(pizzaElement, pizza) {
        let tag = pizzaElement.querySelector("div.tag-badge");
        let label = tag.querySelector("label");
        if (pizza.tag == "Нова") {
            tag.classList.add("tag-new");
            label.innerText = pizza.tag;
        }
        else if (pizza.tag == "Популярна") {
            tag.classList.add("tag-popular");
            label.innerText = pizza.tag;
        }
        else {
            tag.remove();
        }
    }
    loadImg(pizzaElement, pizza) {
        let img = pizzaElement.querySelector("img");
        img.src = pizza.img;
    }
    loadOptions(pizzaElement, pizza) {
        let optionsContainer = pizzaElement.querySelector(".options");
        let optionElements = optionsContainer.querySelectorAll(".option");
        for (let i = 0; i < optionElements.length; i++) {
            this.loadOption(optionElements[i], pizza, pizza.options[i]);
        }
    }
    loadOption(optionElement, pizza, option) {
        (0, utils_1.loadValueToElementBySelector)(optionElement, ".size", option.size.toString());
        (0, utils_1.loadValueToElementBySelector)(optionElement, ".weight", option.weight.toString());
        (0, utils_1.loadValueToElementBySelector)(optionElement, ".price > .value", option.price.toString());
        let buyBtn = optionElement.querySelector(".buy-btn > button");
        buyBtn.addEventListener("click", event => {
            event.preventDefault();
            this.basketMediator.add(pizza, option);
        });
    }
    setupFilters() {
        const productsCount = document.querySelector("#products-count");
        const filters = document.querySelectorAll(".category-list > label");
        filters.forEach(filter => filter.addEventListener("click", () => {
            let filteredCardsCount = 0;
            this.pizzaCards.forEach(node => {
                let pizzaCard = node;
                let categories = pizzaCard.getAttribute("data-categories").split(",");
                let display = filter.id == "all" || categories.find(c => c == filter.id) != undefined ? "flex" : "none";
                if (display == "flex") {
                    filteredCardsCount++;
                }
                pizzaCard.style.display = display;
            });
            productsCount.innerText = filteredCardsCount.toString();
        }));
        filters[0].click();
    }
    get(pizzaId, optionId) {
        let pizza = this.data.find(pizza => pizza.id == pizzaId);
        let option = pizza.options.find(option => option.id == optionId);
        return [pizza, option];
    }
}
exports.PizzaList = PizzaList;

},{"./utils":6}],6:[function(require,module,exports){
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

},{}]},{},[4]);
