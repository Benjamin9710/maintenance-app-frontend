# Testing Guidelines

## Automated Test Execution

When running tests, always use these patterns to ensure proper execution and avoid hanging:

### Frontend E2E Tests
- Always use `--reporter=list` for CI/automation to see results in real-time
- Use specific test files when possible: `yarn test:e2e path/to/test.spec.ts`
- For full test suite: `yarn test:e2e --reporter=list`
- Never run E2E tests without explicit reporter in automated contexts

### Backend Tests  
- Use `npm test` for unit tests
- Use `npm run test -- --verbose` for detailed output when needed
- Always check exit codes, never assume tests passed

### Test Timeouts
- E2E tests: Default 10s timeouts for navigation, 5s for element visibility
- Unit tests: Jest defaults (5s) are usually sufficient
- If tests hang, check for: unclosed database connections, open timers, or network requests

### Build Verification
- Frontend: Always run `yarn build` after TypeScript changes
- Backend: Always run `npm run build` after handler changes
- Check for TypeScript errors before running tests

## Test Command Patterns

✅ GOOD:
```bash
yarn test:e2e e2e/admin-properties-simple.spec.ts --reporter=list
npm test
yarn build && npm test
```

❌ AVOID:
```bash
yarn test:e2e  # Hangs waiting for user input
npm test  # Without checking exit code
```

## When Tests Fail

1. Check the error output for specific failure reasons
2. Look for screenshots/videos in `test-results/` for E2E failures  
3. Verify mocks are properly configured
4. Check authentication/authorization flows
5. Ensure test data is properly set up

## Test Environment Cleanup

- Backend tests use `cleanupRateLimiters()` and `closePool()` in teardown
- Frontend tests automatically clean up between runs
- Never leave database connections or timers open after tests
