import { Option } from './option';
import { Pizza } from './pizza';
import { cloneTemplateContent, loadValueToElementBySelector } from './utils';
import { BasketSerializable, BasketItemSerializable } from './BasketSerializable';

export class Basket {
    private static LOCAL_STORAGE_KEY: string = "BASKET_KEY";

    items: BasketItem[];

    ordersListElement: HTMLElement;
    ordersAmountElement: HTMLElement;
    totalPriceElement: HTMLElement;

    constructor(element: HTMLElement, pizzaRepository: Pizza[]) {
        this.ordersListElement = element;
        this.ordersAmountElement = document.querySelector(".orders-label > span") as HTMLElement;
        this.totalPriceElement = document.querySelector(".total-price") as HTMLElement;
        let clearInputBtn = document.querySelector(".clear-orders") as HTMLElement;
        clearInputBtn.addEventListener("click", event => {
            event.preventDefault();
            this.clear();
        })

        this.loadItemsFromLocalStorage(pizzaRepository);
        this.onItemsUpdated();
    }

    private loadItemsFromLocalStorage(pizzaRepository: Pizza[]) {
        this.items = [];
        let fromLocalStorage = this.readLocalStorage();
        for (let item of fromLocalStorage.items) {
            let pizza: Pizza = pizzaRepository.find(pizza => pizza.id == item.pizzaId);
            let option: Option = pizza.options.find(option => option.id == item.optionId);
            let basketItem = new BasketItem(this, pizza, option);
            this.items.push(basketItem);
            this.ordersListElement.appendChild(basketItem.card);
            basketItem.amount = item.amount;
            basketItem.updateAmount();
        }
    }

    add(pizza: Pizza, option: Option): BasketItem {
        let item = this.getItem(pizza, option);
        if(item === null){
            item = new BasketItem(this, pizza, option);
            this.items.push(item);
            this.ordersListElement.appendChild(item.card);
        } else {
            item.increment();
        }
        this.onItemsUpdated();
        return item;
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
        this.serialize();
    }

    private serialize(): void {
        let itemsSerializable: BasketItemSerializable[] = this.items.map(item => {
            return {
                pizzaId: item.pizza.id,
                optionId: item.option.id,
                amount: item.amount,
            };   
        }) 
        let basketSerializable: BasketSerializable = {
            items: itemsSerializable,
        };
        this.writeLocalStorage(basketSerializable);
    }

    private writeLocalStorage(basket: BasketSerializable): void {
        localStorage.setItem(Basket.LOCAL_STORAGE_KEY, JSON.stringify(basket));
    }

    private readLocalStorage(): BasketSerializable {
        if(localStorage.getItem(Basket.LOCAL_STORAGE_KEY) === null) {
            localStorage.setItem(Basket.LOCAL_STORAGE_KEY, '{"items": []}');
        }
        return JSON.parse(localStorage.getItem(Basket.LOCAL_STORAGE_KEY)) as BasketSerializable;
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
};