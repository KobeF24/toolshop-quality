import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly proceedToCheckout1: Locator;
  readonly proceedToCheckout2: Locator;
  readonly proceedToCheckout3: Locator;
  readonly confirmButton: Locator;

  readonly countryDropdown: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly paymentMethodDropdown: Locator;
  readonly paymentSuccessMessage: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceedToCheckout1 = page.locator('[data-test="proceed-1"]');
    this.proceedToCheckout2 = page.locator('[data-test="proceed-2"]');
    this.proceedToCheckout3 = page.locator('[data-test="proceed-3"]');
    this.confirmButton = page.locator('[data-test="finish"]');

    this.countryDropdown = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.paymentMethodDropdown = page.locator('[data-test="payment-method"]');
    this.paymentSuccessMessage = page.locator('[data-test="payment-success-message"]');
    this.confirmationMessage = page.locator('[id="order-confirmation"]');
  }
}
