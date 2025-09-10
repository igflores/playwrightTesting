import { Page, expect, Locator } from '@playwright/test';
import { IProductListSelectors, IProduct } from '../interfaces/ProductListPage';
import { PRODUCT_LIST_SELECTORS } from '../data/selectors';

export class ProductListPage {
    readonly page: Page;
    private selectors: IProductListSelectors;

    constructor(page: Page) {
        this.page = page;
        this.selectors = PRODUCT_LIST_SELECTORS;
    }

    private async getAllProducts(): Promise<Locator[]> {
        await this.page.waitForSelector(this.selectors.productsGrid);
        return await this.page.locator(this.selectors.productCard).all();
    }

    async getAvailableProductsCount(): Promise<number> {
        const products = await this.getAllProducts();
        return products.length;
    }

    async getRandomProduct(): Promise<Locator> {
        const products = await this.getAllProducts();
        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex];
    }

    async getRandomProducts(count: number): Promise<Locator[]> {
        const products = await this.getAllProducts();
        const shuffled = [...products].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, products.length));
    }

    async addProductToCart(productCard: Locator): Promise<void> {
        // Click en el botón Add to Cart dentro de la tarjeta de producto usando el selector por ID
        const addButton = productCard.locator(this.selectors.addToCartButton);
        await addButton.click();

        // Esperar y validar que aparezca el botón Remove
        await expect(productCard.locator(this.selectors.removeButton))
            .toBeVisible({ timeout: 5000 });
    }

    async removeProductFromCart(productCard: Locator): Promise<void> {
        // Click en el botón Remove
        const removeButton = productCard.locator(this.selectors.removeButton)
        await removeButton.click();

        // Esperar y validar que aparezca el texto "Add to Cart"
        await expect(productCard.locator(this.selectors.addToCartButton))
            .toBeVisible({ timeout: 5000 });
    }

    async addMultipleProducts(count: number): Promise<string[]> {
        const products = await this.getRandomProducts(count);
        const addedProductIds: string[] = [];
        
        for (const product of products) {
            const title = await product.locator('h2').textContent();
            await this.addProductToCart(product);
            if (title) addedProductIds.push(title);
        }
        
        return addedProductIds;
    }

    async getProductInfo(productCard: Locator): Promise<IProduct> {
        const title = await productCard.locator(this.selectors.productTitle).textContent() || '';
        const price = await productCard.locator(this.selectors.productPrice).textContent() || '';
        const description = await productCard.locator(this.selectors.productDescription).textContent() || '';
        
        return { title, price, description };
    }

    async getNumberOfPages(): Promise<number> {
        // Encuentra todos los botones con el rol 'button' cuyo nombre accesible sea un número.
        const pageButtons = this.page.getByRole('button', {name: /^\d+$/ });;
        const count = await pageButtons.count();
        
        // Si no se encuentra ningún botón, retorna 1.
        if (count === 0) {
            return 1;
        }

        // Obtiene el texto del último botón, que será el número total de páginas.
        const lastPageText = await pageButtons.nth(count - 1).textContent();

        // Retorna el número, o 1 si no se puede convertir a número.
        return lastPageText ? parseInt(lastPageText) : 1;
    }

    async goToPage(pageNumber: number): Promise<void> {
        const paginationButton = this.page.getByRole('button', { name: pageNumber.toString(), exact: true });

        await paginationButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}
