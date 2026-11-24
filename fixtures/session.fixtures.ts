import { mergeTests } from '@playwright/test';
import { test as uiTest } from './ui.fixtures';
import { test as apiTest, WorkerAccount } from './api.fixtures';

export const test = mergeTests(uiTest, apiTest).extend<{ customer: WorkerAccount }>({
  customer: async ({ page, workerAccount }, use) => {
    // Inject the worker's token before any page script runs
    await page.addInitScript((token) => {
      window.localStorage.setItem('auth-token', token);
    }, workerAccount.token);
    await use(workerAccount);
  },
});
