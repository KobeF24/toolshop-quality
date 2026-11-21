import { test, expect } from '../../fixtures/index';

import customers from '../../data/customer.json';

test('should login successfully with valid credentials', async ({ page, homePage, loginPage }) => {
  
    await page.goto('/');
    await homePage.signInButton.click();
    await expect(loginPage.loginForm).toBeVisible();
    await loginPage.login(customers.valid.email, customers.valid.password);

    await expect(page).toHaveURL(/\/account/);
});
