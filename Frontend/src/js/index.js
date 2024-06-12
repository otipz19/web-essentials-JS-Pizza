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
//# sourceMappingURL=index.js.map