import { test, expect } from '../fixtures/index';

test('should displays products on the home page', async ({ page, homePage }) => {


    await page.goto('/');
    await expect(homePage.productName).toBeVisible();
});