import { PizzaList } from "./pizzaList";
import { Basket } from "./basket";
import { Option } from "./option";
import { Pizza } from "./pizza";

export class BasketMediator {
    pizzaList: PizzaList;
    basket: Basket;

    add(pizza: Pizza, option: Option): void {
        this.basket.add(pizza, option);
    }

    get(pizzaId: number, optionId: number): [Pizza, Option] {
        return this.pizzaList.get(pizzaId, optionId);
    }
}