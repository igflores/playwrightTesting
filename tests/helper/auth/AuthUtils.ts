import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import dotenv from 'dotenv';dotenv.config();

export class AuthUtils {
    private page: Page;
    private loginPage: LoginPage;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    async login(username?: string, password?: string) {     //Accepts two optional arguments (?)
        await this.loginPage.navigateToLoginPage();
        await this.loginPage.login(
            username || process.env.USER_NAME || '',
            password || process.env.USER_PASSWORD || ''
        );
        await this.loginPage.validateSuccessfulLogin();
    }
}
