import { Page, expect } from '@playwright/test';
import { ICartSelectors } from '../interfaces/CartPage';
import { CART_SELECTORS } from '../data/selectors';

export class CartPage {
    readonly page: Page;
    private selectors: ICartSelectors;

    constructor(page: Page) {
        this.page = page;
        this.selectors = CART_SELECTORS;
    }

    async getCartCount(): Promise<number> {
        // Verificar que el botón del carrito existe y es visible usando el selector por ID
        const cartButton = this.page.locator(this.selectors.cartButton);
        await expect(cartButton).toBeVisible({ timeout: 5000 });

        // Obtener el texto completo del botón (formato: "Cart (X)")
        const buttonText = await cartButton.textContent();
        if (!buttonText) {
            throw new Error('El botón del carrito está vacío');
        }
        
        // Extraer el número entre paréntesis
        const matches = buttonText.match(/Cart\s*\((\d+)\)/);
        if (!matches) {
            throw new Error(`Formato inválido del contador: "${buttonText}"`);
        }
        
        return parseInt(matches[1]);
    }

    async openCart(): Promise<void> {
        const cartButton = this.page.locator(this.selectors.cartButton);
        await cartButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async validateCartCount(expectedCount: number): Promise<void> {
        const actualCount = await this.getCartCount();
        expect(actualCount).toBe(expectedCount);
    }

    async validateCartPersistence(expectedCount: number): Promise<void> {
        try {
            // Validar el contador inicial
            const initialCount = await this.getCartCount();
            expect(initialCount).toBe(expectedCount);
            
            // Recargar la página y esperar a que se cargue
            await this.page.reload();
            await this.page.waitForLoadState('networkidle');
            
            // Validar el contador después de recargar
            const finalCount = await this.getCartCount();
            expect(finalCount).toBe(expectedCount);
        } catch (error: any) {
            throw new Error(`Error al validar la persistencia del carrito: ${error?.message || 'Error desconocido'}`);
        }
    }
}
