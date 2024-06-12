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
        (0, utils_1.loadValueToElementBySelector)(this.card, ".pizza-title", this.pizza.title.toString());
        (0, utils_1.loadValueToElementBySelector)(this.card, ".option-subtitle", `(${this.option.title})`);
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
//# sourceMappingURL=basketItem.js.map