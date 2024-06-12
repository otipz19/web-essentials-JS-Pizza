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
//# sourceMappingURL=pizzaList.js.map