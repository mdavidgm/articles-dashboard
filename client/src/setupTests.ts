import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// This runs a cleanup function after each test case,
// which is essential for ensuring tests are isolated.
afterEach(() => {
  cleanup();
});