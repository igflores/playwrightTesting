export interface IProductListSelectors {
    productsGrid: string;
    productCard: string;
    addToCartButton: string;
    removeButton: string;
    productPrice: string;
    productTitle: string;
    productDescription: string;
    paginationPage: (pageNumber: string) => string;
    paginationContainer?: string; // Propiedad opcional .. solo se usan en un TC
    paginationButtons?: string; // Propiedad opcional .. solo se usan en un TC
}

export interface IProduct {
    title: string;
    price: string;
    description: string;
}
