import { Pizza } from './pizza';
import { Basket } from "./basket";
import { PizzaList } from './pizzaList';
import { BasketMediator } from './basketMediator';

document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/js/pizza.json")
    .then(response => response.json())
    .then(data => {
        let pizzaRepository = data as Pizza[];
        const basketMediator = new BasketMediator();
        const pizzaList = new PizzaList(pizzaRepository, basketMediator);
        basketMediator.pizzaList = pizzaList;
        const basket = new Basket(document.querySelector(".orders-list") as HTMLElement, basketMediator);
        basketMediator.basket = basket;
    });
});