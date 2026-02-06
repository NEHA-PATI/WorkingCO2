# Auth Race Condition Fix - Testing Guide

## Overview

This document explains how to test the authentication race condition fix that prevents login page flashing.

## Test Files Created

### 1. **Integration Tests** - `src/__tests__/auth-race-condition.test.jsx`
Automated tests using Vitest and React Testing Library that verify:
- Login uses correct localStorage keys (authToken, authUser)
- AuthProvider properly hydrates state
- ProtectedRoute shows loading state before checking auth
- Logout only clears auth keys
- Corrupted data is handled gracefully

### 2. **Manual Testing Guide** - `src/__tests__/manual-testing-guide.js`
Browser-based testing instructions with console logging. Load this in DevTools Console to see step-by-step instructions.

### 3. **Test Configuration**
- `vitest.config.js` - Vitest configuration
- `src/__tests__/setup.js` - Test environment setup
- `package.test.json` - Dependencies reference

## Running Automated Tests

### Install Test Dependencies (if not already installed)

```bash
cd "d:\Major Internship\CO2plus\CO2-plus\frontend\User"
npm install --save-dev @testing-library/react@^14.1.2 @testing-library/jest-dom@^6.1.5 @testing-library/user-event@^14.5.1 vitest@^1.0.4 jsdom@^23.0.1 @vitest/ui@^1.0.4
```

### Run Tests

```bash
# Run all tests
npm test

# Run auth tests specifically
npm run test:auth

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Manual Testing in Browser

### Quick Start

1. **Load Testing Guide**:
   ```javascript
   // In browser DevTools Console, paste:
   const script = document.createElement('script');
   script.src = '/src/__tests__/manual-testing-guide.js';
   document.head.appendChild(script);
   ```

2. **Check Auth State Anytime**:
   ```javascript
   checkAuthState();
   ```

### Critical Tests to Perform

#### Test 1: No Login Flash ✨ (MOST IMPORTANT)

1. Clear localStorage (DevTools → Application → Local Storage → Clear All)
2. Navigate to `http://localhost:5173/login`
3. Login with valid credentials
4. **Expected**: Direct navigation to dashboard, NO FLASH
5. **Verify localStorage**:
   ```javascript
   console.log('authToken:', localStorage.getItem('authToken')); // Should exist
   console.log('authUser:', localStorage.getItem('authUser')); // Should exist
   console.log('token:', localStorage.getItem('token')); // Should be null
   console.log('user:', localStorage.getItem('user')); // Should be null
   ```

#### Test 2: Page Refresh

1. Login successfully
2. Press F5 to refresh
3. **Expected**: Brief loading spinner, then dashboard (no flash)

#### Test 3: Direct Protected Route Access

1. Logout (clear localStorage)
2. Navigate directly to `http://localhost:5173/user/dashboard`
3. **Expected**: Loading spinner → redirect to login (no dashboard flash)

## What Should Happen

### ✅ CORRECT Behavior (After Fix)

```
Login Success
→ localStorage.setItem("authToken", token)
→ localStorage.setItem("authUser", user)
→ navigate("/user/dashboard")
→ ProtectedRoute renders
→ authLoading = true → Shows spinner
→ useAuth reads localStorage
→ authLoading = false
→ isAuthenticated = true
→ Dashboard renders
→ NO FLASH! 🎉
```

### ❌ INCORRECT Behavior (Before Fix)

```
Login Success
→ localStorage.setItem("token", token)  ⚠️ Wrong key!
→ navigate("/user/dashboard")
→ ProtectedRoute renders
→ useAuth reads "authToken" ⚠️ Not found!
→ isAuthenticated = false
→ Redirect to /login ⚠️ FLASH!
→ Later: hydration finishes
→ Redirect back to dashboard
```

## Debugging

### Console Logs to Watch For

**Good Signs** ✅:
```
✅ Auth initialized: { role: 'user', userId: 'USR_001' }
✅ User logged in: { role: 'user', userId: 'USR_001' }
✅ User logged out
```

**Bad Signs** ❌:
```
❌ Auth init failed: [error]
// If you see this, check localStorage for corrupted data
```

### Common Issues

1. **Still seeing flash?**
   - Check if old `token` or `user` keys exist in localStorage
   - Verify `authLoading` is being checked in ProtectedRoute
   - Ensure AuthProvider wraps App in main.jsx

2. **Tests failing?**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check that all test dependencies are installed
   - Run `npm run test -- --reporter=verbose` for detailed output

3. **localStorage still has old keys?**
   - Clear browser data completely
   - Check for other files still using old keys (search codebase for `localStorage.getItem("token")`)

## Test Coverage

The fix covers these files:
- ✅ `src/auth/useAuth.js` - AuthProvider context
- ✅ `src/components/ProtectedRoute.jsx` - Loading guard
- ✅ `src/pages/Login.jsx` - authToken, authUser keys
- ✅ `src/pages/Signup.jsx` - authUser key
- ✅ `src/services/apiClient.js` - authToken key
- ✅ `src/pages/userDashboard.jsx` - authUser key
- ✅ `src/pages/ViewAssets.jsx` - authUser key
- ✅ `src/pages/contact.jsx` - authUser key
- ✅ `src/components/user/popupform.jsx` - authUser key (3 instances)

## Success Criteria

All tests pass when:
- ✅ No login flash after successful authentication
- ✅ Only `authToken` and `authUser` keys are used
- ✅ ProtectedRoute waits for auth hydration
- ✅ Page refresh works without flash
- ✅ Logout only clears auth keys
- ✅ Corrupted data doesn't crash the app
- ✅ Role-based redirects work correctly
