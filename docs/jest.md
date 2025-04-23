# Jest
In this project, we do both unit and integration testing using Jest. It's important because we want to:

- Catch bugs early
- Makes debugging easier
- Speeds up development
- Makes your project more scalable!

## Unit Testing
Unit testing is a type of software testing where you test small, individual parts (units) of code—like functions or methods—to ensure they work correctly. It involves testing isolated tests with mock (fake) data inputs.

## Integration Testing
If you're testing real interactions between modules (e.g., API calls, database queries, multiple functions working together), it's integration testing. We want to see if the modules / methods work together and that we have a proper data flow for full system behavior checking. 

## Comparion between Unit and Integration Testing

| **Feature**       | **Unit Test (Independent)** | **Integration Test**           |
|-------------------|--------------------------|--------------------------------|
| **What it tests** | A single function/module | Multiple parts working together |
| **Dependencies**  | None (mocks used)        | Uses real APIs, DB, etc.       |
| **Speed**        | Fast                | Slower   |
| **Example**      | Testing an `add()` function | Testing if API fetches real users |

## What is Jest?
Jest is a JavaScript testing framework created by Facebook. In simple terms, it's a tool that helps you write and run tests to make sure your JavaScript code works as expected. It makes testing easier by providing everything you need in one place, like test runners, assertion libraries, and mocking capabilities.

You can use TypeScript in Jest by using a preprocessor called ts-jest. Here's the basic idea of how it works:
1. ts-jest as a Translator: Jest itself is designed to run JavaScript tests. ts-jest acts like a translator that takes your TypeScript test files and converts them into JavaScript "on-the-fly" just before Jest runs them.
2. Configuration is Key: You need to tell Jest to use ts-jest. This is usually done in your Jest configuration file (like jest.config.js or jest.config.ts). You'll set a preset option to ts-jest.
3. Write Tests in TypeScript: Once configured, you can write your Jest test files using TypeScript syntax (e.g., .ts or .tsx file extensions). You get all the benefits of TypeScript in your tests, like type checking and better code completion.
4. Jest Runs JavaScript: Under the hood, Jest still runs JavaScript. ts-jest handles the TypeScript compilation step so you don't have to worry about running a separate TypeScript compiler before your tests.

In short, ts-jest bridges the gap, allowing you to write your tests in TypeScript and have Jest understand and run them as JavaScript.

## How To Write Jest Tests
Since Jest focuses on unit testing, we want to test individual functions/methods in isolation. For project simplicity, we'll write all the tests in the [tests/unit](../tests/unit/) folder. 

You can find Jest syntax documentation here: https://jestjs.io/docs/getting-started

