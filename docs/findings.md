# Findings

Defects found while automating the Toolshop (sprint5) test suite.

## F-01 — Order rejected silently after "Payment was successful"

- **Severity:** Major
- **Steps:**
  1. Log in as a customer, add a product to the cart, go through checkout.
  2. Enter an address the server rejects (e.g. country FR with a city that does not match the postcode).
  3. Select "Cash on Delivery", click Confirm, then Confirm again.
- **Expected:** An error message tells the customer the order could not be placed and why.
- **Actual:** "Payment was successful" is displayed, `POST /invoices` returns a validation error, no confirmation appears and no error is shown. The customer cannot tell the order failed.
- **Evidence:** Playwright trace, `POST /invoices` response:
  `{"billing_country": ["The billing_country does not match the entered address. The city does not belong to the selected country."]}`

## F-02 — Postcode auto-fill clears the state for France, blocking checkout

- **Severity:** Major
- **Steps:**
  1. On the billing address step, select France.
  2. Enter postcode `59000` and a house number, type a state.
  3. Wait for the auto-fill, then proceed and confirm the order.
- **Expected:** The state is kept, or filled in by the lookup, and the order is accepted.
- **Actual:** `GET /postcode-lookup` returns an empty `state` for FR and the auto-fill overwrites the field with it. `POST /invoices` then fails with "The billing state field must be a string." (combined with F-01, the failure is silent).
- **Evidence:** Request payload `billing_state: ""` after typing a state.

## F-03 — Required search parameter `q` is not enforced

- **Severity:** Minor
- **Steps:** `GET /products/search` without the `q` parameter.
- **Expected:** 422 with a validation error (Swagger marks `q` as required).
- **Actual:** 200 with an empty result (`"data": [], "total": 0`).
- **Risk:** Clients sending a wrong parameter name get "no results" instead of an error, which hides integration bugs.

## F-04 — API documentation does not match actual response types

- **Severity:** Minor
- **Steps:** Compare the Swagger example for `GET /products/search` with a real response.
- **Expected:** Same types in the documentation and the response.
- **Actual:** Swagger shows `is_location_offer: 1`, `in_stock: 0` (integers); the API returns `true` / `false` (booleans).
- **Risk:** Consumers built against the documentation may parse the fields incorrectly.

## Suite validation against the buggy build (`sprint5-with-bugs`)

Goal: check that the suite fails when the application is broken, and find coverage gaps.

| Test | Result | Verdict |
|---|---|---|
| Product search (API) | Search "hammer" returns "Leather toolbelt" | Defect detected |
| Home page (UI) | Product cards rendered with empty names | Defect detected |
| Login (UI) | Valid demo credentials rejected ("Invalid email or password") | Defect detected |
| Worker account fixture | Registration contract changed (address, city, country required; last name format) | Blocked: checkout E2E never ran |
| Add to cart (hybrid) | Hash routing (`/#/...`): direct product URL does not open the product page | Test assumption, not a defect |

**Not detected by the suite:** typos in labels ("Sorth", "Serch"), broken search icon. No visual or label checks exist.

**Lessons:**
- 3 customer-facing defects caught by 6 tests.
- The critical checkout path depends on the account fixture: when registration changes, checkout is no longer verified. Next step: make the fixture fail with a clear "blocked" status, or add a fallback account.
- Label and visual defects need `toHaveScreenshot` on key screens.
