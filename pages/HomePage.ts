import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly productName: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="product-name"]').first();
    this.signInButton = page.locator('[data-test="nav-sign-in"]');
  }
}
