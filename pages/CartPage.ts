import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('[data-test="product-title"]');
    this.productPrice = page.locator('[data-test="product-price"]');
  }
}
