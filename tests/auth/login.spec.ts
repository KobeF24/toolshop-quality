import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import customers from '../../data/customer.json';

test('should login successfully with valid credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await homePage.signInButton.click();
    await expect(loginPage.loginForm).toBeVisible();
    await loginPage.login(customers.valid.email, customers.valid.password);

    await expect(page).toHaveURL(/\/account/);
});
