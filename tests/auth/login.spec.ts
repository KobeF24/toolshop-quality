import { test, expect } from '../../fixtures/index';
import { env } from '../../config/env';

test('should login successfully with valid credentials', { tag: '@smoke' }, async ({ page, homePage, loginPage }) => {
  await page.goto('/');
  await homePage.signInButton.click();
  await expect(loginPage.loginForm).toBeVisible();
  await loginPage.login(env.customer.email, env.customer.password);
  await expect(page).toHaveURL(/\/account/);
});
