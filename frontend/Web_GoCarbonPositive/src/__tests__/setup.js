import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

const storageState = new Map();

const localStorageMock = {
  getItem: vi.fn((key) => {
    return storageState.has(key) ? storageState.get(key) : null;
  }),
  setItem: vi.fn((key, value) => {
    storageState.set(key, String(value));
  }),
  removeItem: vi.fn((key) => {
    storageState.delete(key);
  }),
  clear: vi.fn(() => {
    storageState.clear();
  }),
  key: vi.fn((index) => Array.from(storageState.keys())[index] ?? null),
  get length() {
    return storageState.size;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

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

// Mock console methods to reduce noise in tests
globalThis.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};
