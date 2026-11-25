import { test, expect } from '@playwright/test';
import { API_URL } from '../../fixtures/api.fixtures';

test.use({ baseURL: API_URL });

const password = 'Str0ng!Pass#2026';
let email: string;

test.beforeAll(async ({ request }) => {
  email = `neg-${Date.now()}@test.local`;
  const res = await request.post(`${API_URL}/users/register`, {
    data: { first_name: 'Neg', last_name: 'Login', email, password },
  });
  expect(res.status(), await res.text()).toBe(201);
});

const cases = [
  { name: 'wrong password', email: () => email, password: 'Wrong!Pass#2026', error: 'Unauthorized' },
  { name: 'unknown email', email: () => `unknown-${Date.now()}@test.local`, password, error: 'Unauthorized' },
  { name: 'empty fields', email: () => '', password: '', error: 'Invalid login request' },
];

for (const c of cases) {
  test(`should reject login: ${c.name}`, async ({ request }) => {
    const res = await request.post('/users/login', {
      data: { email: c.email(), password: c.password },
    });
    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: c.error });
  });
}