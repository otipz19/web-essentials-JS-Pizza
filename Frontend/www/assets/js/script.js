"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cardTemplate = document.getElementById("pizza-card-template");
document.addEventListener("DOMContentLoaded", function () {
    fetch("assets/js/pizza.json")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        loadPizzaList(data);
    });
});
function loadPizzaList(data) {
    var listContainer = document.querySelector("div#pizza_list");
    data.forEach(function (pizza) {
        listContainer.appendChild(buildPizzaElement(pizza));
    });
}
function buildPizzaElement(pizza) {
    var pizzaElement = cloneTemplateContent(cardTemplate);
    loadTag(pizzaElement, pizza);
    loadImg(pizzaElement, pizza);
    loadValueToElementBySelector(pizzaElement, ".title", pizza.title);
    loadValueToElementBySelector(pizzaElement, ".subtitle", pizza.subtitle);
    loadValueToElementBySelector(pizzaElement, ".description", pizza.description);
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
        loadOption(optionElements[i], pizza.options[i]);
    }
}
function loadOption(optionElement, option) {
    loadValueToElementBySelector(optionElement, ".size", option.size.toString());
    loadValueToElementBySelector(optionElement, ".weight", option.weight.toString());
    loadValueToElementBySelector(optionElement, ".price > .value", option.price.toString());
}
function loadValueToElementBySelector(parent, selector, value) {
    var element = parent.querySelector(selector);
    element.innerText = value;
}
function cloneTemplateContent(template) {
    var _a, _b;
    return (_b = (_a = template.content) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
}
