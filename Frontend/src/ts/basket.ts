import { Option } from './option';
import { Pizza } from './pizza';
import { BasketSerializable, BasketItemSerializable } from './BasketSerializable';
import { BasketMediator } from './basketMediator';
import { BasketItem } from './basketItem';

export class Basket {
    private static LOCAL_STORAGE_KEY: string = "BASKET_KEY";

    items: BasketItem[];

    ordersListElement: HTMLElement;
    ordersAmountElement: HTMLElement;
    totalPriceElement: HTMLElement;

    basketMediator: BasketMediator;

    constructor(element: HTMLElement, basketMediator: BasketMediator) {
        this.basketMediator = basketMediator;
        this.ordersListElement = element;
        this.ordersAmountElement = document.querySelector(".orders-label > span") as HTMLElement;
        this.totalPriceElement = document.querySelector(".total-price") as HTMLElement;
        let clearInputBtn = document.querySelector(".clear-orders") as HTMLElement;
        clearInputBtn.addEventListener("click", event => {
            event.preventDefault();
            this.clear();
        })

        this.loadItemsFromLocalStorage();
        this.onItemsUpdated();
    }

    private loadItemsFromLocalStorage() {
        this.items = [];
        let fromLocalStorage = this.readLocalStorage();
        for (let item of fromLocalStorage.items) {
            let [pizza, option] = this.basketMediator.get(item.pizzaId, item.optionId);
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
}