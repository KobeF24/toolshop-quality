import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:8091' });

test('search products by keyword returns matching products', async ({ request }) => {
  const response = await request.get('/products/search', {
    params: { q: 'hammer' },
  });
  
  await expect(response).toBeOK();

  const responseBody = await response.json();
  
  expect(responseBody.data.length).toBeGreaterThan(0);

  for (const product of responseBody.data) {
    expect(product.name.toLowerCase()).toContain('hammer');
  }
  
const producthammerid = responseBody.data[0].id;
const producthammername = responseBody.data[0].name;
const producthammerprice = responseBody.data[0].price;
});
