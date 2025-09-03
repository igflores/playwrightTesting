import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AuthUtils } from '../helper/auth/AuthUtils';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Login Functionality', () => {
    let loginPage: LoginPage;
    let authUtils: AuthUtils;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        authUtils = new AuthUtils(page);
        await page.goto('/');
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await authUtils.login();
    });

    test('should not login with empty username', async ({ page }) => {
        await loginPage.login('', process.env.USER_PASSWORD || '');
        await loginPage.validateErrorMessage();
    });

    test('should not login with empty password', async ({ page }) => {
        await loginPage.login(process.env.USER_NAME || '', '');
        await loginPage.validateErrorMessage();
    });

    test('should not login with invalid credentials', async ({ page }) => {
        await loginPage.login('invalid_user', 'invalid_password');
        await loginPage.validateErrorMessage();
    });

    test('should maintain login state after page refresh', async ({ page }) => {
        await authUtils.login();
        await page.reload();
        await expect(page).toHaveURL(/.*\/inventory/);
    });

    test('password field should mask the input', async ({ page }) => {
        const passwordInput = page.locator(loginPage['selectors'].passwordInput);
        await passwordInput.fill('test123');
        const inputType = await passwordInput.getAttribute('type');
        expect(inputType).toBe('password');
    });

    test('should handle special characters in login credentials', async ({ page }) => {
        await loginPage.login('user@test#$%', 'pass@123!');
        await loginPage.validateErrorMessage();
    });

    test('should prevent SQL injection attempts', async ({ page }) => {
        await loginPage.login("' OR '1'='1", "' OR '1'='1");
        await loginPage.validateErrorMessage();
    });

    test('should handle rapid multiple login attempts', async ({ page }) => {
        for (let i = 0; i < 3; i++) {
            await loginPage.login('invalid_user', 'invalid_password');
            await loginPage.validateErrorMessage();
        }
    });
});
