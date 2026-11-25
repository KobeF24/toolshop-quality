import { test, expect } from '../../fixtures';
import { API_URL } from '../../fixtures/api.fixtures';

test.describe('Cart business rules', () => {
  let product: { id: string; name: string; price: number };

  test.beforeEach(async ({ page, request, productPage, headerPage }) => {
    const response = await request.get(`${API_URL}/products/search`, { params: { q: 'hammer' } });
    await expect(response).toBeOK();
    product = (await response.json()).data[0];

    await productPage.goto(product.id);
    await productPage.addToCartButton.click();
    await expect(headerPage.cartQuantity).toHaveText('1');
    await headerPage.miniCart.click();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test('should recalculate line price when quantity changes', async ({ cartPage }) => {
    await cartPage.setQuantity('3');
    await expect(cartPage.linePrice).toContainText((product.price * 3).toFixed(2));
  });

  const boundaries = [
    { input: '0', expected: '1' },
    { input: '100', expected: '99' },
  ];

  for (const b of boundaries) {
    test(`should clamp quantity ${b.input} to ${b.expected}`, async ({ cartPage }) => {
      await cartPage.setQuantity(b.input);
      await expect(cartPage.quantityInput).toHaveValue(b.expected);
    });
  }

  test('should empty the cart when the item is removed', async ({ page, cartPage }) => {
    await cartPage.removeButton.click();
    await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();
  });
});