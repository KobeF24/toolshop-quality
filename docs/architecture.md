# Test architecture

## Overview

```
                 tests  (import from '../../fixtures')
                    │
               index.ts            ← single entry point
                    │
          session.fixtures.ts      ← UI + service: "customer"
             ┌──────┴──────┐
     ui.fixtures.ts   api.fixtures.ts
     (page objects)   (account per worker)
             └──────┬──────┘
           @playwright/test
```

Each layer builds on the one below and knows nothing about the one above.
Every test imports from the same place: `'../../fixtures'`.

## Layers

### `ui.fixtures.ts` — page objects (test scope)
Each fixture receives `page` and provides a page object:

```ts
homePage: async ({ page }, use) => {
  await use(new HomePage(page));
},
```

### `api.fixtures.ts` — account per worker (worker scope)
- Runs **once per worker process**, not once per test (`{ scope: 'worker' }`).
- Builds a unique email from `workerInfo.parallelIndex` + `Date.now()`
  (unique between workers and between runs).
- Creates the account (`POST /users/register`), logs in (`POST /users/login`), provides `{ email, password, token }`.
- Uses `playwright.request.newContext()`: the test-scoped `request` fixture does not exist at worker level.
- `expect(res.status(), await res.text())`: the second argument is the failure message, so the API error body shows up in the report.

### `session.fixtures.ts` — logged-in browser
- `mergeTests(uiTest, apiTest)` combines both layers, then adds `customer`.
- `customer` injects the worker's token into `localStorage['auth-token']` with `page.addInitScript`,
  before any page script runs: the app starts already logged in, no UI login needed.

### `index.ts` — entry point
Only re-exports `test` and `expect`. Adding a layer changes this file, not the tests.

## Key principles
1. A fixture = setup → `use(value)` → teardown.
2. A fixture declares what it needs in its parameters; Playwright resolves the dependencies.
3. Test-scoped fixtures are recreated for every test; worker-scoped fixtures once per process.
4. Fixtures are lazy: only the ones a test requests are executed.
5. Requesting a fixture for its side effect is valid (e.g. `customer` logs the browser in).

## Why one account per worker
Tests run in parallel in several workers. With a shared account they interfere
(cart, orders, profile, session). Each worker creates its own account through the API,
so tests are isolated without slowing down: one account per worker, not per test.