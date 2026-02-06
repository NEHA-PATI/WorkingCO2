import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

// Mock environment variables
vi.stubEnv('VITE_API_URL', 'http://localhost:5002');
vi.stubEnv('VITE_ASSET_SERVICE_URL', 'http://localhost:5000');
vi.stubEnv('VITE_AUTH_SERVICE_URL', 'http://localhost:5002');
vi.stubEnv('VITE_NOTIFICATION_SERVICE_URL', 'http://localhost:5001');

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key) => localStorage[key] || null),
  setItem: vi.fn((key, value) => {
    localStorage[key] = value.toString();
  }),
  removeItem: vi.fn((key) => {
    delete localStorage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStorage).forEach((key) => delete localStorage[key]);
  }),
};

global.localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};
