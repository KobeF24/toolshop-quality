import { test, expect } from '../../fixtures/index';
import { API_URL } from '../../fixtures/api.fixtures';

test('Checkout order E2E', { tag: '@smoke' }, async ({ page, request, cartPage, productPage, headerPage, checkoutPage, customer }) => {
  await page.goto('/');

  const response = await request.get(`${API_URL}/products/search`, {
    params: { q: 'hammer' },
  });
  await expect(response).toBeOK();
  const product = (await response.json()).data[0];

  // Act : ouvrir sa page et l'ajouter au panier
  await productPage.goto(product.id);
  await expect(productPage.productName).toHaveText(product.name);

  await productPage.addToCartButton.click();
  // Assert : compteur, nom et prix dans le panier

  await expect(headerPage.cartQuantity).toHaveText('1');

  await headerPage.miniCart.click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(cartPage.productTitle).toHaveText(product.name);
  await expect(cartPage.productPrice).toContainText(product.price.toFixed(2));

  await checkoutPage.proceedToCheckout1.click();

  await expect(checkoutPage.proceedToCheckout2).toBeVisible();
  await checkoutPage.proceedToCheckout2.click();

  await expect(checkoutPage.countryDropdown).toBeVisible();
  // Arrange : valeurs attendues, calculées par le lookup de l'application
  const lookup = await request.get(`${API_URL}/postcode-lookup`, {
    params: { country: 'DE', postcode: '10115', house_number: '1' },
  });
  await expect(lookup).toBeOK();
  const expected = await lookup.json();

  // Act : saisir comme un vrai client, puis laisser l'auto-remplissage agir
  await checkoutPage.countryDropdown.selectOption('DE');
  await checkoutPage.postalCodeInput.fill('10115');
  await checkoutPage.houseNumberInput.fill('1');

  // Assert : le formulaire est rempli par le lookup
  await expect(checkoutPage.streetInput).toHaveValue(expected.street);
  await expect(checkoutPage.cityInput).toHaveValue(expected.city);
  await expect(checkoutPage.stateInput).toHaveValue(expected.state);
  const auth = { headers: { Authorization: `Bearer ${customer.token}` } };
  const before = await (await request.get(`${API_URL}/invoices`, auth)).json();

  await checkoutPage.proceedToCheckout3.click();

  await expect(checkoutPage.paymentMethodDropdown).toBeVisible();
  await checkoutPage.paymentMethodDropdown.selectOption('cash-on-delivery');
  await checkoutPage.confirmButton.click();
  await expect(checkoutPage.paymentSuccessMessage).toBeVisible();
  await checkoutPage.confirmButton.click();
  await expect(checkoutPage.confirmationMessage).toBeVisible();
  const after = await (await request.get(`${API_URL}/invoices`, auth)).json();
  expect(after.total).toBe(before.total + 1);
});
