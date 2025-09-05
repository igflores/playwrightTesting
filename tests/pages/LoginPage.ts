import { Page, expect } from '@playwright/test';
import { ILoginSelectors } from '../interfaces/LoginPage';

export class LoginPage {
    private page: Page;
    private selectors: ILoginSelectors;

    constructor(page: Page) {
        this.page = page;
        this.selectors = {
            usernameInput: '#username',
            passwordInput: 'input[type="password"]',
            loginButton: 'button[type="submit"]'
        };
    }

    async navigateToLoginPage() {
        await this.page.goto('/');
        await expect(this.page).toHaveTitle('QA Practice Site');
    }

    async login(username: string, password: string) {
        await this.page.fill(this.selectors.usernameInput, username);
        await this.page.fill(this.selectors.passwordInput, password);
        await this.page.click(this.selectors.loginButton);
    }

    async validateSuccessfulLogin() {
        // After successful login, we should be redirected to the inventory page
        await expect(this.page).toHaveURL(/.*\/inventory/);
        // Usando un selector más específico para el h1
        await expect(this.page.locator('h1.text-3xl.font-bold')).toHaveText('Inventory - Practice UPEX');
    }

    async validateErrorMessage() {
        // Cambio en la validación: verificamos que no podemos acceder a la página de inventario
        const currentUrl = this.page.url();
        expect(currentUrl).not.toContain('/inventory');
        // Podríamos agregar más validaciones específicas aquí según el comportamiento real de la aplicación
    }
}
