import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider } from "@contexts/AuthContext";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import Login from "@features/auth/pages/Login";

/**
 * Auth Race Condition Integration Tests
 * 
 * These tests verify that the auth race condition has been fixed:
 * 1. No login flash after successful authentication
 * 2. ProtectedRoute waits for auth hydration before redirecting
 * 3. Correct localStorage keys are used throughout
 */

describe('Auth Race Condition Fix', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should use authToken and authUser keys after login', async () => {
      // Mock successful login API response
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              token: 'test-jwt-token',
              user: {
                u_id: 'USR_001',
                email: 'test@example.com',
                role_name: 'USER',
                status: 'active',
                verified: true,
              },
            }),
        })
      );

      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      render(
        <BrowserRouter>
          <Login onClose={() => { }} />
        </BrowserRouter>
      );

      // Fill in credentials
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Wait for login to complete
      await waitFor(() => {
        expect(localStorage.getItem('authToken')).toBe('test-jwt-token');
        expect(localStorage.getItem('authUser')).toBeTruthy();

        // Verify OLD keys are NOT used
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
      });
    });
  });

  describe('AuthProvider Hydration', () => {
    it('should properly hydrate auth state from localStorage', async () => {
      // Setup localStorage with auth data
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem(
        'authUser',
        JSON.stringify({
          u_id: 'USR_001',
          email: 'test@example.com',
          role_name: 'USER',
          status: 'active',
        })
      );

      const TestComponent = () => {
        const { user, isAuthenticated, authLoading } = useAuth();

        if (authLoading) {
          return <div>Loading...</div>;
        }

        return (
          <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
            <div data-testid="user-email">{user?.email || 'no user'}</div>
          </div>
        );
      };

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      // Should show loading initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for hydration to complete
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      // Setup corrupted data
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('authUser', 'invalid-json{');

      const TestComponent = () => {
        const { user, isAuthenticated, authLoading } = useAuth();

        if (authLoading) {
          return <div>Loading...</div>;
        }

        return <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>;
      };

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      // Wait for hydration to complete
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');

        // Should clear corrupted data
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(localStorage.getItem('authUser')).toBeNull();
      });
    });
  });

  describe('ProtectedRoute Loading Guard', () => {
    it('should show loading state while auth is hydrating', async () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem(
        'authUser',
        JSON.stringify({
          u_id: 'USR_001',
          role_name: 'USER',
          status: 'active',
        })
      );

      const ProtectedContent = () => <div>Protected Content</div>;

      render(
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          </AuthProvider>
        </BrowserRouter>
      );

      // Should show loading spinner initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Should render protected content after hydration
      await waitFor(() => {
        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
      });
    });

    it('should NOT redirect to login before auth finishes loading', async () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
          Navigate: ({ to }) => {
            mockNavigate(to);
            return <div>Redirecting to {to}</div>;
          },
        };
      });

      const ProtectedContent = () => <div>Protected Content</div>;

      render(
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          </AuthProvider>
        </BrowserRouter>
      );

      // During loading phase, should NOT navigate
      expect(mockNavigate).not.toHaveBeenCalled();

      // After loading completes, if not authenticated, should redirect
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Logout Cleanup', () => {
    it('should clear only auth keys on logout', async () => {
      // Setup auth and other localStorage data
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('authUser', JSON.stringify({ u_id: 'USR_001' }));
      localStorage.setItem('userPreferences', JSON.stringify({ theme: 'dark' }));
      localStorage.setItem('cartItems', JSON.stringify([1, 2, 3]));

      const TestComponent = () => {
        const { logout } = useAuth();
        return <button onClick={logout}>Logout</button>;
      };

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        // Auth keys should be cleared
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(localStorage.getItem('authUser')).toBeNull();

        // Other keys should remain
        expect(localStorage.getItem('userPreferences')).toBeTruthy();
        expect(localStorage.getItem('cartItems')).toBeTruthy();
      });
    });
  });
});
