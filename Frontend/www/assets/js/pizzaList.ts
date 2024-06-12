import { loadValueToElementBySelector, cloneTemplateContent } from "./utils";
import { Pizza } from "./pizza";
import { Option } from "./option";
import { BasketMediator } from "./basketMediator";

export class PizzaList {
    private data: Pizza[];
    private basketMediator: BasketMediator;
    private pizzaCards: HTMLElement[];

    constructor(data: Pizza[], basketMediator: BasketMediator) {
        this.data = data;
        this.basketMediator = basketMediator;
        this.pizzaCards = [];
        this.loadData(data);
        this.setupFilters();
    }

    private loadData(data: Pizza[]) {
        const listContainer = document.querySelector("div#pizza_list") as HTMLElement;
        data.forEach(pizza => {
            let pizzaCard = this.buildPizzaElement(pizza);
            listContainer.appendChild(pizzaCard);
            this.pizzaCards.push(pizzaCard);
        });
    }

    private buildPizzaElement(pizza: Pizza): HTMLElement {
        const cardTemplate = document.getElementById("pizza-card-template") as HTMLTemplateElement;;
        let pizzaElement: HTMLElement = cloneTemplateContent(cardTemplate);
        this.loadTag(pizzaElement, pizza);
        this.loadImg(pizzaElement, pizza);
        loadValueToElementBySelector(pizzaElement, ".title", pizza.title);
        loadValueToElementBySelector(pizzaElement, ".subtitle", pizza.subtitle);
        loadValueToElementBySelector(pizzaElement, ".description", pizza.description);
        this.loadOptions(pizzaElement, pizza);
        pizzaElement.setAttribute("data-categories", pizza.categories.join(','));
        return pizzaElement;
    }

    private loadTag(pizzaElement: HTMLElement, pizza: Pizza) {
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

    private loadImg(pizzaElement: HTMLElement, pizza: Pizza) {
        let img = pizzaElement.querySelector("img") as HTMLImageElement;
        img.src = pizza.img;
    }

    private loadOptions(pizzaElement: HTMLElement, pizza: Pizza) {
        let optionsContainer = pizzaElement.querySelector(".options") as HTMLElement;
        let optionElements = optionsContainer.querySelectorAll(".option");
        for (let i = 0; i < optionElements.length; i++) {
            this.loadOption(optionElements[i] as HTMLElement, pizza, pizza.options[i]);
        }
    }

    private loadOption(optionElement: HTMLElement, pizza: Pizza, option: Option) {
        loadValueToElementBySelector(optionElement, ".size", option.size.toString());
        loadValueToElementBySelector(optionElement, ".weight", option.weight.toString());
        loadValueToElementBySelector(optionElement, ".price > .value", option.price.toString());
        let buyBtn = optionElement.querySelector(".buy-btn > button") as HTMLElement;
        buyBtn.addEventListener("click", event => {
            event.preventDefault();
            this.basketMediator.add(pizza, option)
        });
    }

    private setupFilters(): void {
        const productsCount = document.querySelector("#products-count") as HTMLElement;
        const filters = document.querySelectorAll(".category-list > label");
        filters.forEach(filter => filter.addEventListener("click", () => {
            let filteredCardsCount: number = 0;
            this.pizzaCards.forEach(node => {
                let pizzaCard = node as HTMLElement;
                let categories = pizzaCard.getAttribute("data-categories").split(",");
                let display = filter.id == "all" || categories.find(c => c == filter.id) != undefined ? "flex" : "none";
                if(display == "flex") {
                    filteredCardsCount++;
                }
                pizzaCard.style.display = display;
            });
            productsCount.innerText = filteredCardsCount.toString();
        }));
        (filters[0] as HTMLLabelElement).click();
    }

    public get(pizzaId: number, optionId: number): [Pizza, Option] {
        let pizza: Pizza = this.data.find(pizza => pizza.id == pizzaId);
        let option: Option = pizza.options.find(option => option.id == optionId);
        return [pizza, option];
    }
}