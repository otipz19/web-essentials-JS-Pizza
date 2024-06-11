import { Option } from './option';
import { Pizza } from './pizza';
import { cloneTemplateContent, loadValueToElementBySelector } from './utils';

export class Basket {
    items: BasketItem[];

    ordersListElement: HTMLElement;
    ordersAmountElement: HTMLElement;
    totalPriceElement: HTMLElement;

    constructor(element: HTMLElement) {
        this.items = [];
        this.ordersListElement = element;
        this.ordersAmountElement = document.querySelector(".orders-label > span") as HTMLElement;
        this.totalPriceElement = document.querySelector(".total-price") as HTMLElement;
        this.onItemsUpdated();
        let clearInputBtn = document.querySelector(".clear-orders") as HTMLElement;
        clearInputBtn.addEventListener("click", event => {
            event.preventDefault();
            this.clear();
        })
    }

    add(pizza: Pizza, option: Option): void {
        let item = this.getItem(pizza, option);
        if(item === null){
            let item = new BasketItem(this, pizza, option);
            this.items.push(item);
            this.ordersListElement.appendChild(item.card);
        } else {
            item.increment();
        }
        this.onItemsUpdated();
    }

    private getItem(pizza: Pizza, option: Option): BasketItem | null {
        let filtered = this.items.filter(item => item.pizza === pizza && item.option === option);
        return filtered.length == 1 ? filtered[0] : null;
    }

    remove(toRemove: BasketItem) : void {
        let index: number = this.items.indexOf(toRemove);
        this.items.splice(index, 1);
        this.onItemsUpdated();
    }

    clear(): void {
        let toDelete = [...this.items];
        toDelete.forEach(item => item.remove());
        this.onItemsUpdated();
    }

    onItemsUpdated(): void {
        this.ordersAmountElement.innerText = this.items.length.toString();
        let totalPrice = this.items.reduce((res, el) => res + el.totalPrice(), 0);
        this.totalPriceElement.innerText = `${totalPrice}  грн.`;
    }
};

export class BasketItem  {
    basket: Basket;

    pizza: Pizza;
    option: Option;
    amount: number;

    card: HTMLElement;

    constructor(basket: Basket, pizza: Pizza, option: Option) {
        this.basket = basket;
        this.pizza = pizza;
        this.option = option;
        this.amount = 1;
        this.buildElement();
    }

    private buildElement(): void {
        const template = document.getElementById("order-card-template") as HTMLTemplateElement;
        this.card = cloneTemplateContent(template);
        loadValueToElementBySelector(this.card, ".title", `${this.pizza.title} (${this.option.title})`);
        loadValueToElementBySelector(this.card, ".size", this.option.size.toString());
        loadValueToElementBySelector(this.card, ".weight", this.option.weight.toString());
        this.onAmountUpdated();
        this.addClickHandlerToBtn(".sub", () => this.decrement());
        this.addClickHandlerToBtn(".add", () => this.increment());
        this.addClickHandlerToBtn(".cancel", () => this.remove());
    }

    private addClickHandlerToBtn(selector: string, handler: () => void) {
        this.getBtn(selector).addEventListener("click", event =>{
            event.preventDefault();
            handler();
        })
    }

    private getBtn(selector: string): HTMLButtonElement {
        return this.card.querySelector(selector) as HTMLButtonElement;
    }

    private onAmountUpdated(): void {
        loadValueToElementBySelector(this.card, ".cost", this.totalPrice().toString());
        loadValueToElementBySelector(this.card, ".amount .value", this.amount.toString());
        this.basket.onItemsUpdated();
    }

    totalPrice(): number {
        return this.amount * this.option.price;
    }

    increment(): void {
        this.amount++;
        this.onAmountUpdated();
    }

    decrement(): void {
        if(this.amount === 1){
            this.remove();
        } else {
            this.amount--;
            this.onAmountUpdated();
        }
    }

    remove(): void {
        this.card.remove();
        this.basket.remove(this);
    }
};