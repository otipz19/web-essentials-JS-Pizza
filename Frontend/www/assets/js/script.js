(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./utils":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var basket_1 = require("./basket");
var cardTemplate = document.getElementById("pizza-card-template");
document.addEventListener("DOMContentLoaded", function () {
    fetch("assets/js/pizza.json")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        loadPizzaList(data);
    });
    var basket = new basket_1.Basket(document.querySelector(".orders-list"));
    function loadPizzaList(data) {
        var listContainer = document.querySelector("div#pizza_list");
        data.forEach(function (pizza) {
            listContainer.appendChild(buildPizzaElement(pizza));
        });
    }
    function buildPizzaElement(pizza) {
        var pizzaElement = (0, utils_1.cloneTemplateContent)(cardTemplate);
        loadTag(pizzaElement, pizza);
        loadImg(pizzaElement, pizza);
        (0, utils_1.loadValueToElementBySelector)(pizzaElement, ".title", pizza.title);
        (0, utils_1.loadValueToElementBySelector)(pizzaElement, ".subtitle", pizza.subtitle);
        (0, utils_1.loadValueToElementBySelector)(pizzaElement, ".description", pizza.description);
        loadOptions(pizzaElement, pizza);
        return pizzaElement;
    }
    function loadTag(pizzaElement, pizza) {
        var tag = pizzaElement.querySelector("div.tag-badge");
        var label = tag.querySelector("label");
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
    function loadImg(pizzaElement, pizza) {
        var img = pizzaElement.querySelector("img");
        img.src = pizza.img;
    }
    function loadOptions(pizzaElement, pizza) {
        var optionsContainer = pizzaElement.querySelector(".options");
        var optionElements = optionsContainer.querySelectorAll(".option");
        for (var i = 0; i < optionElements.length; i++) {
            loadOption(optionElements[i], pizza, pizza.options[i]);
        }
    }
    function loadOption(optionElement, pizza, option) {
        (0, utils_1.loadValueToElementBySelector)(optionElement, ".size", option.size.toString());
        (0, utils_1.loadValueToElementBySelector)(optionElement, ".weight", option.weight.toString());
        (0, utils_1.loadValueToElementBySelector)(optionElement, ".price > .value", option.price.toString());
        var buyBtn = optionElement.querySelector(".buy-btn > button");
        buyBtn.addEventListener("click", function (event) {
            event.preventDefault();
            basket.add(pizza, option);
        });
    }
});

},{"./basket":1,"./utils":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadValueToElementBySelector = exports.cloneTemplateContent = void 0;
function cloneTemplateContent(template) {
    var _a, _b;
    return (_b = (_a = template.content) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
}
exports.cloneTemplateContent = cloneTemplateContent;
function loadValueToElementBySelector(parent, selector, value) {
    var element = parent.querySelector(selector);
    element.innerText = value;
}
exports.loadValueToElementBySelector = loadValueToElementBySelector;

},{}]},{},[2]);
