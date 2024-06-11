"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketItem = exports.Basket = void 0;
const utils_1 = require("./utils");
class Basket {
    constructor(element, pizzaRepository) {
        this.ordersListElement = element;
        this.ordersAmountElement = document.querySelector(".orders-label > span");
        this.totalPriceElement = document.querySelector(".total-price");
        let clearInputBtn = document.querySelector(".clear-orders");
        clearInputBtn.addEventListener("click", event => {
            event.preventDefault();
            this.clear();
        });
        this.loadItemsFromLocalStorage(pizzaRepository);
        this.onItemsUpdated();
    }
    loadItemsFromLocalStorage(pizzaRepository) {
        this.items = [];
        let fromLocalStorage = this.readLocalStorage();
        for (let item of fromLocalStorage.items) {
            let pizza = pizzaRepository.find(pizza => pizza.id == item.pizzaId);
            let option = pizza.options.find(option => option.id == item.optionId);
            let basketItem = new BasketItem(this, pizza, option);
            this.items.push(basketItem);
            this.ordersListElement.appendChild(basketItem.card);
            basketItem.amount = item.amount;
            basketItem.updateAmount();
        }
    }
    add(pizza, option) {
        let item = this.getItem(pizza, option);
        if (item === null) {
            item = new BasketItem(this, pizza, option);
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
        localStorage.setItem(Basket.LOCAL_STORAGE_KEY, JSON.stringify(basket));
    }
    readLocalStorage() {
        if (localStorage.getItem(Basket.LOCAL_STORAGE_KEY) === null) {
            localStorage.setItem(Basket.LOCAL_STORAGE_KEY, '{"items": []}');
        }
        return JSON.parse(localStorage.getItem(Basket.LOCAL_STORAGE_KEY));
    }
}
exports.Basket = Basket;
Basket.LOCAL_STORAGE_KEY = "BASKET_KEY";
;
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
;
//# sourceMappingURL=basket.js.map