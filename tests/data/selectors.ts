export const HEADER_SELECTORS = {
    menuButton: 'header button:has(svg.lucide-menu)',
    dropdownMenu: '.absolute.right-0.mt-2',
    logoutButton: '.absolute.right-0.mt-2 button:has-text("Logout")'
};

export const CART_SELECTORS = {
    cartButton: '#view-cart',
    cartCounter: '#view-cart'
};

export const PRODUCT_LIST_SELECTORS = {
    productsGrid: '#card-container',
    productCard: '#card-container > div', // Each product card within the products grid
    addToCartButton: 'button:has-text("Add to Cart")', //all Add to Cart buttons have the same ID
    removeButton: 'button:has-text("Remove")', //all Remove buttons
    //productPrice: '[class^="text-xl font-bold"]', //all prices
    productPrice: 'div.flex.justify-between.items-center span.text-xl.font-bold',
    productTitle: 'h2.text-2xl',
    productDescription: 'p',    //all product descriptions
    paginationPage: (pageNumber: string) => `button:has-text("${pageNumber}")`,
    paginationContainer: 'div.flex.justify-center.items-center.space-x-4',     //  selector para el contenedor de paginación
    paginationButtons: 'div.flex.justify-center.items-center.space-x-4 button'     // selector para los botones de paginación dentro del contenedor
};