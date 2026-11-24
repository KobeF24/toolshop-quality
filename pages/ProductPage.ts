import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="product-name"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
  }
  async goto(productId: string) {
    await this.page.goto(`/product/${productId}`);
  }
}
