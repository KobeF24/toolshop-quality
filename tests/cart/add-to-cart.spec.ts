import { test, expect } from '../../fixtures';

const API_URL = 'http://localhost:8091';

test('adding a product to the cart updates the cart', async ({ page, request, cartPage, productPage, headerPage }) => {
    // Arrange : récupérer un produit par API
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
});