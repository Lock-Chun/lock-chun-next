# Playwright

In this project, we use Playwright for End-to-End (E2E) and API testing. We do this because:

- Imitate the user's perspective: We want to verify that the application works correctly from the user's perspective.
- Flow: We want to ensure that the entire system flows properly (frontend to backend)
- Endpoint Verification: We want to verify that our endpoints return the correct data
- Catching Regressions: We don't want anything that worked before to not work after a new update

## End-to-End (E2E) Testing

E2E testing simulates REAL (emphasis on real) life scenarios involing users while they navigate through the website. We want to test every part of the website. Playwright helps us by creating dummy browsers like Chrome, Firefox, etc. to simulate these actions by clicking buttons, filling forms, navigating pages, etc., and verifies that everything looks and works as expected.

## API Testing

API testing involves sending requests directly to the application's backend endpoints (APIs) and validating the responses. This is done without interacting with the user interface. Playwright provides tools to make HTTP requests (GET, POST, PUT, DELETE, etc.), set headers, send data, and assert on the response status, headers, and body content. This ensures the backend logic and data handling work correctly independently of the frontend.

## Playwright vs Jest

Playwright captures the entire story (E2E testing), while Jest only tests a single function.

## Configuration 

Playwright configuration is handled in the playwright.config.ts file in the project root. This file defines:

- The directory where test files are located (testDir).
- Browsers to run tests against (projects).
- Reporters for test results (reporter).
- Base URL (optional, for easier navigation).
- Other options like parallel execution, retries, and trace generation.

## How To Write Playwright Tests

Playwright tests are typically organized by feature or page. For project simplicity, we'll write E2E and API tests in the tests/e2e folder (note: the playwright.config.ts currently points testDir to ./tests, but Jest ignores tests/e2e/, suggesting this is the intended location for Playwright tests).

Tests are written within test(...) blocks, often using async/await. Playwright provides fixtures like page (for browser interaction) and request (for API testing). Assertions are made using expect(...).

You can find comprehensive Playwright documentation here: https://playwright.dev/docs/intro

## Running Tests
To run all Playwright tests, use the command:

npm run test:e2e

After running the command, you can run

npx playwright show-report

and a report will pop up in your browser.