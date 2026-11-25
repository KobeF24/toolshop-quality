import { test, expect } from '../fixtures/index';

test('should display  products on the home page',{tag: '@smoke'}, async ({ page, homePage }) => {
  await page.goto('/');
  await expect(homePage.productName).toBeVisible();
});
