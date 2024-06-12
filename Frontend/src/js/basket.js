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
                    title: value.pizza.title,
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
//# sourceMappingURL=basket.js.map