import { test as base, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CartPage } from '../pages/CartPage';
import { ProductPage } from '../pages/ProductPage';
import { HeaderPage } from '../pages/HeaderPage';
import { CheckoutPage } from '../pages/CheckoutPage';


export { expect };

type PageFixtures = {
    accountPage: AccountPage;
    homePage: HomePage;
    loginPage: LoginPage;
    productPage: ProductPage;
    cartPage: CartPage;
    headerPage: HeaderPage;
    checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
    accountPage: async ({ page }, use) => {
        const accountPage = new AccountPage(page);
        await use(accountPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);

    },
    productPage: async ({ page }, use) => {
        const productPage = new ProductPage(page);
        await use(productPage);
    },
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    headerPage: async ({ page }, use) => {
        const headerPage = new HeaderPage(page);
        await use(headerPage);
    },
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
});