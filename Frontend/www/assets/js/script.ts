import { Pizza } from './pizza';
import { Option } from './option';
import { cloneTemplateContent, loadValueToElementBySelector } from './utils';
import { Basket } from "./basket";

const cardTemplate: HTMLTemplateElement = document.getElementById("pizza-card-template") as HTMLTemplateElement;

document.addEventListener("DOMContentLoaded", async () => {
    await fetch("assets/js/pizza.json")
    .then(response => response.json())
    .then(data => {
        let pizzaRepository = data as Pizza[];
        loadPizzaList(pizzaRepository);
        const basket = new Basket(document.querySelector(".orders-list") as HTMLElement, pizzaRepository);

        function loadPizzaList(data: Pizza[]): void {
            let listContainer = document.querySelector("div#pizza_list") as HTMLElement;
            data.forEach(pizza => {
                listContainer.appendChild(buildPizzaElement(pizza));
            });
        }
        
        function buildPizzaElement(pizza: Pizza): HTMLElement {
            let pizzaElement: HTMLElement = cloneTemplateContent(cardTemplate);
            loadTag(pizzaElement, pizza);
            loadImg(pizzaElement, pizza);
            loadValueToElementBySelector(pizzaElement, ".title", pizza.title);
            loadValueToElementBySelector(pizzaElement, ".subtitle", pizza.subtitle);
            loadValueToElementBySelector(pizzaElement, ".description", pizza.description);
            loadOptions(pizzaElement, pizza);
            pizzaElement.setAttribute("data-categories", pizza.categories.join(','));
            return pizzaElement;
        }
        
        function loadTag(pizzaElement: HTMLElement, pizza: Pizza) {
            let tag = pizzaElement.querySelector("div.tag-badge") as HTMLElement;
            let label = tag.querySelector("label") as HTMLLabelElement;
            if (pizza.tag == "Нова") {
                tag.classList.add("tag-new");
                label.innerText = pizza.tag;
            } else if (pizza.tag == "Популярна") {
                tag.classList.add("tag-popular");
                label.innerText = pizza.tag;
            } else {
                tag.remove();
            }
        }
        
        function loadImg(pizzaElement: HTMLElement, pizza: Pizza) {
            let img = pizzaElement.querySelector("img") as HTMLImageElement;
            img.src = pizza.img;
        }
        
        function loadOptions(pizzaElement: HTMLElement, pizza: Pizza) {
            let optionsContainer = pizzaElement.querySelector(".options") as HTMLElement;
            let optionElements = optionsContainer.querySelectorAll(".option");
            for (let i = 0; i < optionElements.length; i++) {
                loadOption(optionElements[i] as HTMLElement, pizza, pizza.options[i]);
            }
        }
        
        function loadOption(optionElement: HTMLElement, pizza: Pizza, option: Option) {
            loadValueToElementBySelector(optionElement, ".size", option.size.toString());
            loadValueToElementBySelector(optionElement, ".weight", option.weight.toString());
            loadValueToElementBySelector(optionElement, ".price > .value", option.price.toString());
            let buyBtn = optionElement.querySelector(".buy-btn > button") as HTMLElement;
            buyBtn.addEventListener("click", event => {
                event.preventDefault();
                basket.add(pizza, option)
            });
        }
    });

    const pizzaCards = document.querySelectorAll(".pizza-container");

    let filters = document.querySelectorAll(".category-list > label");
    filters.forEach(filter => filter.addEventListener("click", () => {
        pizzaCards.forEach(node => {
            let pizzaCard = node as HTMLElement;
            let categories = pizzaCard.getAttribute("data-categories").split(",");
            let display = filter.id == "all" || categories.find(c => c == filter.id) != undefined ? "flex" : "none";
            pizzaCard.style.display = display;
        });
    }));
});