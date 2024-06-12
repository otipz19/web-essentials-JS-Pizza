export type BasketSerializable = {
    items: BasketItemSerializable[],
}

export type BasketItemSerializable = {
    pizzaId: number,
    optionId: number,
    amount: number,
}