export interface ICartSelectors {
    cartCounter: string;
    cartButton: string;
}

export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface ICartState {
    items: ICartItem[];
    totalItems: number;
    totalPrice: number;
}
