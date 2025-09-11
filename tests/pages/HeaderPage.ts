import { Page } from '@playwright/test';
import { HEADER_SELECTORS } from '../data/selectors';

export class HeaderPage {
    private page: Page;
    private selectors: typeof HEADER_SELECTORS;

    constructor(page: Page) {
        this.page = page;
        this.selectors = HEADER_SELECTORS;
    }

    async clickMenuButton(): Promise<void> {
        await this.page.locator(this.selectors.menuButton).click();
    }

    async logout(): Promise<void> {
        // 1. Abrir el menú para que aparezca el botón de logout
        await this.clickMenuButton();
        
        // 2. Esperar a que el menú desplegable esté visible
        const dropdownMenu = this.page.locator(this.selectors.dropdownMenu);
        await dropdownMenu.waitFor({ state: 'visible' });
        
        // 3. Hacer click en el botón de logout
        const logoutButton = this.page.locator(this.selectors.logoutButton);
        await logoutButton.waitFor({ state: 'visible' });
        
        await logoutButton.click();
        
        // 4. Esperar a que redirija a la página principal
        await this.page.waitForURL('https://orbit.upexgalaxy.com/');
    }
}
