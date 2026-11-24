# Toolshop Quality

![Playwright tests](https://github.com/KobeF24/toolshop-quality/actions/workflows/playwright.yml/badge.svg)

Risk-based test automation for an e-commerce checkout, built with Playwright and TypeScript.

This repository shows how I approach quality on a web shop: what to test first, how to keep tests reliable, and how test results support a release decision.

## Application under test

[Practice Software Testing — Toolshop](https://github.com/testsmith-io/practice-software-testing) (sprint 5): Angular UI and Laravel REST API, run locally with Docker.

## Test strategy

### Risk-based priorities

| Priority | Area                                        | Why                                                                                | Coverage                              |
| -------- | ------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| P1       | Checkout (cart → address → payment → order) | Revenue-critical, crosses most integrations (cart, auth, address lookup, invoices) | End-to-end UI test                    |
| P1       | Authentication                              | Gate to the checkout                                                               | UI login test, API account per worker |
| P2       | Add to cart                                 | Entry to the funnel, price and name consistency between API and UI                 | Hybrid test (API data, UI behaviour)  |
| P2       | Product search                              | Main navigation path                                                               | API test                              |
| P3       | Home page catalogue                         | Smoke check: the shop is up and serves products                                    | UI smoke test                         |

### Test levels

- **API tests** for business data: fast and stable.
- **Hybrid tests**: test data prepared through the API, behaviour checked in the UI.
- **Few end-to-end UI tests**, kept for critical journeys only.

### Not automated yet, and why

- **Other payment methods**: same flow as cash on delivery, low added value until a risk justifies it.
- **Accessibility and visual checks**: out of scope for v1 (candidate: axe on the checkout).
- **Performance**: needs dedicated tooling.
- **Admin back-office**: not on the customer critical path.

## Reliability principles

- **Web-first assertions only**, no fixed waits.
- **Selectors on `data-test` attributes**, independent of styling.
- **Assert content, not just status codes.** Two false positives were caught while building this suite: an HTML page returning 200 instead of the API, and a search returning 200 with no results.
- **Wait for the application's real signal** (e.g. the postcode lookup) instead of racing it.
- **Isolated test data**: one account per worker, created through the API; the session is injected by token, so tests share no state and skip the UI login.
- **Fixed locale** (`en-US`), so assertions do not depend on the machine running them.

## Architecture

Page objects and layered fixtures (UI, API, session) combined with `mergeTests`.
Details: [docs/architecture.md](docs/architecture.md)

## Continuous integration

GitHub Actions starts the Toolshop in Docker, seeds the database and runs the suite on Chromium, Firefox and WebKit. The HTML report is uploaded as an artifact.

URLs come from `BASE_URL` and `API_URL`: the same suite can target an ephemeral environment in CI or a staging environment, without changing any test.

## Release decision (go / no-go)

- **GO**: all P1 tests pass on all browsers, and no open Major finding on the checkout path.
- **NO-GO**: any P1 failure, or a Major finding on payment or order creation.
- **P2/P3 failures**: release possible with a documented risk, decided with the product owner.

**Current assessment:** findings F-01 and F-02 (silent order failure, state cleared for France) are Major on the checkout path. A release targeting France would be **NO-GO**.

## Findings

Defects found while automating: [docs/findings.md](docs/findings.md) (4 findings, 2 Major).

## Run locally

Prerequisites: Node.js LTS, Docker.

```bash
# Application under test
git clone https://github.com/testsmith-io/practice-software-testing.git
cd practice-software-testing
docker compose up -d
docker compose exec laravel-api php artisan migrate:fresh --seed

# This repository
npm ci
npx playwright install
npx playwright test
```

## Roadmap

- Run the suite against the deliberately buggy version and report what it detects.
- API contract tests on response schemas (see F-04).
- Accessibility checks on the checkout.
