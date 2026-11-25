import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly linePrice: Locator;
  readonly cartTotal: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('[data-test="product-title"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.quantityInput = page.locator('[data-test="product-quantity"]');
    this.linePrice = page.locator('[data-test="line-price"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    // No data-test on this button in the app: testability gap
    this.removeButton = page.locator('a.btn-danger');
  }

  async setQuantity(quantity: string) {
    await this.quantityInput.fill(quantity);
    // The app recalculates on "change", which fires when the field loses focus
    await this.quantityInput.press('Tab');
  }
}