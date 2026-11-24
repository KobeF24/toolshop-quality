import { test, expect } from '../../fixtures';
import { API_URL } from '../../fixtures/api.fixtures';

test('worker account is authenticated', async ({ request, workerAccount }) => {
  const me = await request.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${workerAccount.token}` },
  });
  await expect(me).toBeOK();
  expect((await me.json()).email).toBe(workerAccount.email);
});
