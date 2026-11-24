import { test as base, expect } from '@playwright/test';

export const API_URL = 'http://localhost:8091';

export type WorkerAccount = { email: string; password: string; token: string };

export const test = base.extend<{}, { workerAccount: WorkerAccount }>({
  workerAccount: [async ({ playwright }, use, workerInfo) => {
    const api = await playwright.request.newContext({ baseURL: API_URL });

    // 1. Unique account per worker (and per run)
    const email = `worker${workerInfo.parallelIndex}-${Date.now()}@test.local`;
    const password = 'Str0ng!Pass#2026';

    // 2. Create the account
    const register = await api.post('/users/register', {
      data: { first_name: 'Worker', last_name: `N${workerInfo.parallelIndex}`, email, password },
    });
    expect(register.status(), await register.text()).toBe(201);

    // 3. Log in to get a token
    const login = await api.post('/users/login', { data: { email, password } });
    expect(login.status(), await login.text()).toBe(200);
    const { access_token: token } = await login.json();

    await use({ email, password, token });
    await api.dispose();
  }, { scope: 'worker' }],
});