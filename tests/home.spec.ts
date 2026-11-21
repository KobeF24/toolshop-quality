import { test, expect } from '@playwright/test';

test('should displays products on the home page', async ({ page }) => {

    const productName = page.locator('[data-test="product-name"]').first();

    await page.goto('/');
    await expect(productName).toBeVisible();
});