import { Basket } from "./basket";
import { Pizza } from "./pizza";
import { Option } from "./option";
import { cloneTemplateContent, loadValueToElementBySelector } from "./utils";

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
        loadValueToElementBySelector(this.card, ".pizza-title", this.pizza.title.toString());
        loadValueToElementBySelector(this.card, ".option-subtitle", `(${this.option.title})`);
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
        this.updateAmount();
        this.basket.onItemsUpdated();
    }

    updateAmount(): void {
        loadValueToElementBySelector(this.card, ".cost", this.totalPrice().toString());
        loadValueToElementBySelector(this.card, ".amount .value", this.amount.toString());
    }

    totalPrice(): number {
        return this.amount * this.option.price;
    }

    increment(): void {
        this.changeAmount(this.amount + 1);
    }

    decrement(): void {
        this.changeAmount(this.amount - 1);
    }

    changeAmount(value: number): void {
        this.amount = value;
        if(this.amount < 1){
            this.remove();
        } else {
            this.onAmountUpdated();
        }
    }

    remove(): void {
        this.card.remove();
        this.basket.remove(this);
    }
}