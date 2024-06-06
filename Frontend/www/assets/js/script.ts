import { Pizza } from './pizza';
import { Option } from './option';

const cardTemplate: HTMLTemplateElement = document.getElementById("pizza-card-template") as HTMLTemplateElement;

document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/js/pizza.json")
    .then(response => response.json())
    .then(data => {
        loadPizzaList(data as Pizza[]);
    });
});

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
        loadOption(optionElements[i] as HTMLElement, pizza.options[i]);
    }
}

function loadOption(optionElement: HTMLElement, option: Option) {
    loadValueToElementBySelector(optionElement, ".size", option.size.toString());
    loadValueToElementBySelector(optionElement, ".weight", option.weight.toString());
    loadValueToElementBySelector(optionElement, ".price > .value", option.price.toString());
}

function loadValueToElementBySelector(parent: HTMLElement, selector: string, value: string) {
    let element = parent.querySelector(selector) as HTMLElement;
    element.innerText = value;
}

function cloneTemplateContent(template: HTMLTemplateElement): HTMLElement {
    return template.content?.firstElementChild?.cloneNode(true) as HTMLElement;
}