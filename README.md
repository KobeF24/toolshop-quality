# Toolshop Quality

![Playwright tests](https://github.com/KobeF24/toolshop-quality/actions/workflows/playwright.yml/badge.svg)

Risk-based test automation for an e-commerce checkout, built with Playwright and TypeScript.

This repository shows how I approach quality on a web shop: what to test first, how to keep tests reliable, and how test results support a release decision.

## Application under test

[Practice Software Testing — Toolshop](https://github.com/testsmith-io/practice-software-testing) (sprint 5): Angular UI and Laravel REST API, run locally with Docker.

## Test strategy

### Risk-based priorities

| Priority | Area                                        | Why                                                                                | Coverage                                                  |
| -------- | ------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------- |
| P1       | Checkout (cart → address → payment → order) | Revenue-critical, crosses most integrations (cart, auth, address lookup, invoices) | End-to-end UI test                                        |
| P1       | Authentication                              | Gate to the checkout                                                               | UI login, negative cases (API data-driven + UI error)     |
| P2       | Cart                                        | Entry to the funnel, price consistency, quantity rules                             | Hybrid tests: add to cart, recalculation, boundaries, removal |
| P2       | Product search                              | Main navigation path                                                               | API test                                                  |
| P3       | Home page catalogue                         | The shop is up and serves products                                                 | UI smoke test                                             |

### Test levels

- **API tests** for business data and negative cases: fast and stable.
- **Hybrid tests**: test data prepared through the API, behaviour checked in the UI.
- **Few end-to-end UI tests**, kept for critical journeys only.

### Test design

- **Data-driven tests** for negative cases (wrong password, unknown email, empty fields), each with its expected error.
- **Boundary values** on cart quantity (allowed range 1–99: 0 and 100 are clamped).
- **One rule per test**, so a failure points to a single cause.

### Execution strategy

| Suite      | Content                                   | When                         | Browsers                  |
| ---------- | ----------------------------------------- | ---------------------------- | ------------------------- |
| Smoke      | Tests tagged `@smoke`: critical journeys  | Every pull request           | Chromium                  |
| Regression | All tests (no tag = regression)           | Push on `main`, every night  | Chromium, Firefox, WebKit |

Negative and boundary cases stay in regression: the smoke suite stays short.

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
- **Unique identifiers (UUID), not timestamps**: two parallel workers can start in the same millisecond.
- **Business rules respected by the tests themselves**: accounts lock after 3 failed logins, so wrong-password tests use a disposable account, never a shared one.
- **Fixed locale** (`en-US`), so assertions do not depend on the machine running them.

## Architecture

Page objects and layered fixtures (UI, API, session) combined with `mergeTests`.
Details: [docs/architecture.md](docs/architecture.md)

## Configuration and secrets

- **One file per environment**: `.env.<TEST_ENV>` (default `local`), loaded by `playwright.config.ts`. Only `.env.example` is committed.
- **Fail fast**: `config/env.ts` stops with a clear message when a required variable is missing.
- **CI secrets** come from GitHub Secrets. In a company setup, I would use a secrets manager (HashiCorp Vault or the cloud provider's).
- **Secrets vs test data**: credentials are secrets; disposable accounts and deliberately wrong passwords are test data and stay in the code.

## Code quality

- **ESLint** (typescript-eslint, eslint-plugin-playwright) with `no-floating-promises`: an un-awaited promise is the first cause of flaky tests.
- **Prettier** for formatting.
- **Lint runs first in CI**: the suite does not run on code that fails the lint.

## Continuous integration

GitHub Actions starts the Toolshop in Docker, seeds the database and runs the suite. The HTML report is uploaded as an artifact.

URLs come from `BASE_URL` and `API_URL`: the same suite can target an ephemeral environment in CI or a staging environment, without changing any test.

## Reporting

Each run publishes a **release decision summary** on its GitHub Actions page, built from the JSON report by `scripts/report-summary.mjs`:

- results per scope (smoke, regression) and status (passed, failed, flaky, skipped);
- a decision: **✅ GO**, **⚠️ GO under conditions** (regression failures or flaky tests to analyse), or **❌ NO-GO** (smoke failure);
- the list of failed tests.

The HTML report stays available for debugging (traces, screenshots).

## Release decision (go / no-go)

- **GO**: all P1 tests pass on all browsers, and no open Major finding on the checkout path.
- **NO-GO**: any P1 failure, or a Major finding on payment or order creation.
- **P2/P3 failures**: release possible with a documented risk, decided with the product owner.

The automated summary covers test results; open findings are assessed by the QA lead.

**Current assessment:** findings F-01 and F-02 (silent order failure, state cleared for France) are Major on the checkout path. A release targeting France would be **NO-GO**.

## Suite validation against a buggy build

A suite is only useful if it catches defects. It was run against the deliberately buggy version of the application (`sprint5-with-bugs`):

- **Detected**: broken search, empty product names, broken login.
- **Blocked**: a changed registration contract stopped the checkout test before it ran.
- **Not detected**: typos and a broken icon (out of scope: no visual checks).

Details: [docs/findings.md](docs/findings.md)

## Findings

Defects found while automating: [docs/findings.md](docs/findings.md) (5 findings, 2 Major, including one testability gap).

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
cp .env.example .env.local   # then fill in the values
npx playwright test
npx playwright test --grep @smoke   # smoke suite only
```

## Roadmap

- Account lockout test (4th attempt after 3 failures).
- API contract tests on response schemas (see F-04).
- Accessibility checks on the checkout.
- Published HTML report (GitHub Pages) and feature tags (`@cart`, `@auth`) when the suite grows.