# Playwright Based UI and API Test Automation framework

## Overview
This is a test automation project using Playwright Test framework for end-to-end testing UI and a few API cases for a web application. The project is structured to support both UI and API testing with a focus on maintainability, code quality, and ease of use.

The web app under test - **Para bank** is a realistic online banking application which enables users to manage fund transactions.

## Prerequisites
- Node.js
- npm (Node Package Manager)
- Git

## Dependencies

### Core Dependencies
- @playwright/test: 1.53.2
- @types/node: 24.0.12
- crypto-random-string: 5.0.0
- short-unique-id: 5.3.2

### Development Dependencies
- eslint: 9.31.0
- @typescript-eslint/eslint-plugin: 8.37.0
- @typescript-eslint/parser: 8.37.0
- prettier: 3.6.2
- eslint-config-prettier: 10.1.5
- eslint-plugin-playwright: 2.2.0
- husky: 9.1.7
- lint-staged: 16.1.2

## Code Quality Tools

### Linting and Formatting
The project uses ESLint and Prettier for code quality and formatting:

- **ESLint**: Enforces code quality rules
- **Prettier**: Ensures consistent code formatting
- **Husky**: Manages Git hooks
- **lint-staged**: Runs linters on staged files

### Git Hooks
- **pre-commit**: Automatically runs linting and formatting checks before commits

## Project Structure

### Core Directories
- `/tests` - Contains test files and test suites
- `/page-objects` - Page Object Model (POM) files
- `/helpers` - Utility functions and helper methods
- `/configs` - Configuration files for different environments
- `/test-data` - Test data files and fixtures

### Generated Directories
- `/test-results` - Test execution results and artifacts
- `/playwright-report` - Generated HTML reports
- `/node_modules` - Node.js dependencies

### Configuration Files
- `playwright.config.ts` - Playwright configuration
- `package.json` - Node.js project configuration
- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier configuration
- `.huskyrc` - Husky hooks configuration
- `.gitignore` - Git ignore patterns
- `qodana.yaml` - Qodana code quality configuration

### IDE-specific
- `.idea` - IntelliJ IDEA configuration

## Configuration Details

### Test Configuration
- Sequential test execution
- HTML test reporter
- Trace capture on first retry
- CI-specific configurations:
  - 2 retry attempts
  - Single worker
  - No `test.only` usage

### Code Style Configuration
- TypeScript strict mode
- 100 character line length limit
- Consistent naming conventions
- Automated code formatting
- Playwright-specific ESLint rules

### Browser Support
Currently configured for:
- Chromium (Desktop Chrome)

Additional configurations available for:
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Microsoft Edge
- Google Chrome

## Running Tests

Execute tests:
bash npx playwright test

## Test Reports
HTML format reports include:
- Test status
- Test duration
- Error messages
- Trace viewer for failed tests

## Development Workflow
1. Write code following the style guide
2. Tests and code are automatically formatted on commit
3. Pre-commit hooks ensure code quality
4. CI pipeline runs all checks and tests

## Additional Notes
- TypeScript support enabled
- Environment variables via `.env` file
- Automated code quality checks
- Consistent code style across the project