"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketMediator = void 0;
class BasketMediator {
    add(pizza, option) {
        this.basket.add(pizza, option);
    }
    get(pizzaId, optionId) {
        return this.pizzaList.get(pizzaId, optionId);
    }
}
exports.BasketMediator = BasketMediator;
//# sourceMappingURL=basketMediator.js.map