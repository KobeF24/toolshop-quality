import { test as base, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';


export { expect };

type PageFixtures = {
  accountPage: AccountPage;
  homePage: HomePage;
  loginPage: LoginPage;
  
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
});