"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketItem = exports.Basket = void 0;
var utils_1 = require("./utils");
var Basket = (function () {
    function Basket(element) {
        var _this = this;
        this.items = [];
        this.ordersListElement = element;
        this.ordersAmountElement = document.querySelector(".orders-label > span");
        this.totalPriceElement = document.querySelector(".total-price");
        this.onItemsUpdated();
        var clearInputBtn = document.querySelector(".clear-orders");
        clearInputBtn.addEventListener("click", function (event) {
            event.preventDefault();
            _this.clear();
        });
    }
    Basket.prototype.add = function (pizza, option) {
        var item = this.getItem(pizza, option);
        if (item === null) {
            var item_1 = new BasketItem(this, pizza, option);
            this.items.push(item_1);
            this.ordersListElement.appendChild(item_1.card);
        }
        else {
            item.increment();
        }
        this.onItemsUpdated();
    };
    Basket.prototype.getItem = function (pizza, option) {
        var filtered = this.items.filter(function (item) { return item.pizza === pizza && item.option === option; });
        return filtered.length == 1 ? filtered[0] : null;
    };
    Basket.prototype.remove = function (toRemove) {
        var index = this.items.indexOf(toRemove);
        this.items.splice(index, 1);
        this.onItemsUpdated();
    };
    Basket.prototype.clear = function () {
        var toDelete = __spreadArray([], this.items, true);
        toDelete.forEach(function (item) { return item.remove(); });
        this.onItemsUpdated();
    };
    Basket.prototype.onItemsUpdated = function () {
        this.ordersAmountElement.innerText = this.items.length.toString();
        var totalPrice = this.items.reduce(function (res, el) { return res + el.totalPrice(); }, 0);
        this.totalPriceElement.innerText = "".concat(totalPrice, "  \u0433\u0440\u043D.");
    };
    return Basket;
}());
exports.Basket = Basket;
;
var BasketItem = (function () {
    function BasketItem(basket, pizza, option) {
        this.basket = basket;
        this.pizza = pizza;
        this.option = option;
        this.amount = 1;
        this.buildElement();
    }
    BasketItem.prototype.buildElement = function () {
        var _this = this;
        var template = document.getElementById("order-card-template");
        this.card = (0, utils_1.cloneTemplateContent)(template);
        (0, utils_1.loadValueToElementBySelector)(this.card, ".title", "".concat(this.pizza.title, " (").concat(this.option.title, ")"));
        (0, utils_1.loadValueToElementBySelector)(this.card, ".size", this.option.size.toString());
        (0, utils_1.loadValueToElementBySelector)(this.card, ".weight", this.option.weight.toString());
        this.onAmountUpdated();
        this.addClickHandlerToBtn(".sub", function () { return _this.decrement(); });
        this.addClickHandlerToBtn(".add", function () { return _this.increment(); });
        this.addClickHandlerToBtn(".cancel", function () { return _this.remove(); });
    };
    BasketItem.prototype.addClickHandlerToBtn = function (selector, handler) {
        this.getBtn(selector).addEventListener("click", function (event) {
            event.preventDefault();
            handler();
        });
    };
    BasketItem.prototype.getBtn = function (selector) {
        return this.card.querySelector(selector);
    };
    BasketItem.prototype.onAmountUpdated = function () {
        (0, utils_1.loadValueToElementBySelector)(this.card, ".cost", this.totalPrice().toString());
        (0, utils_1.loadValueToElementBySelector)(this.card, ".amount .value", this.amount.toString());
        this.basket.onItemsUpdated();
    };
    BasketItem.prototype.totalPrice = function () {
        return this.amount * this.option.price;
    };
    BasketItem.prototype.increment = function () {
        this.amount++;
        this.onAmountUpdated();
    };
    BasketItem.prototype.decrement = function () {
        if (this.amount === 1) {
            this.remove();
        }
        else {
            this.amount--;
            this.onAmountUpdated();
        }
    };
    BasketItem.prototype.remove = function () {
        this.card.remove();
        this.basket.remove(this);
    };
    return BasketItem;
}());
exports.BasketItem = BasketItem;
;
//# sourceMappingURL=basket.js.map