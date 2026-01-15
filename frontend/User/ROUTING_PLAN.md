# Protected Routes Implementation Plan

## Current Status: Phase 1 Complete ✅

### Phase 1: Base Layout Stabilization (COMPLETE)

- ✅ BaseLayout/PublicLayout created
- ✅ Navbar + Footer centralized
- ✅ Removed duplicate Navbar/Footer from pages
- ✅ Login/Signup modals managed globally
- ✅ Clean routing structure

---

## Phase 2: Protected Routes with Nested Layouts

### Goal

Implement JWT-based protected routes with role-specific layouts while maintaining:

- **Single Navbar structure** (never changes)
- **Natural back button behavior**
- **No full page reloads**
- **Clean nested routing**

### Architecture Overview

```
App
├── BaseLayout (PublicLayout) - Navbar + Footer
│   ├── Public Routes (No Auth Required)
│   │   ├── / (Home)
│   │   ├── /login
│   │   ├── /signup
│   │   ├── /about
│   │   ├── /blog
│   │   ├── /careers
│   │   ├── /community
│   │   ├── /contact
│   │   └── /case-studies
│   │
│   ├── Protected Routes (Auth Required, Public Layout)
│   │   ├── /upload (roles: user, organization)
│   │   ├── /view-assets (roles: user, organization)
│   │   ├── /wallet (roles: user, organization)
│   │   └── /profile (all authenticated users)
│   │   Note: These render in BaseLayout but require authentication
│   │   Content changes based on role, but structure stays in public layout
│   │
│   └── Dashboard Routes (Auth + Role Required, Dashboard Layouts)
│       ├── /user/* → UserLayout → UserDashboard + nested tabs
│       ├── /org/* → OrgLayout → OrgDashboard + nested tabs
│       └── /admin/* → AdminLayout → AdminDashboard + nested tabs
```

### Step-by-Step Implementation

#### Step 1: Create ProtectedRoute Component

**File:** `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth";

/**
 * ProtectedRoute Component
 *
 * Features:
 * - JWT-based authentication check
 * - Role-based access control
 * - Account status validation (only active users)
 * - Automatic redirect to login if not authenticated
 * - Redirect to user's dashboard if wrong role
 */
const ProtectedRoute = ({
  children,
  requiredRole = null,
  allowedRoles = null,
}) => {
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();

  // Route requires authentication
  if (requiredRole !== null || allowedRoles !== null) {
    // Not authenticated → redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Account not active → redirect to home
    if (user?.status !== "active") {
      return <Navigate to="/" replace />;
    }

    // Specific role required
    if (requiredRole && role !== requiredRole.toLowerCase()) {
      const dashboardRoute = getDashboardRoute(role);
      return <Navigate to={dashboardRoute} replace />;
    }

    // Check allowed roles
    if (
      allowedRoles &&
      !allowedRoles.map((r) => r.toLowerCase()).includes(role)
    ) {
      const dashboardRoute = getDashboardRoute(role);
      return <Navigate to={dashboardRoute} replace />;
    }
  } else {
    // Route requires authentication (no specific role)
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (user?.status !== "active") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const getDashboardRoute = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/admin/dashboard";
    case "organization":
      return "/org/dashboard";
    case "user":
      return "/user/dashboard";
    default:
      return "/";
  }
};

export default ProtectedRoute;
```

#### Step 2: Create Dashboard Layouts

##### UserLayout

**File:** `src/layouts/UserLayout.jsx`

```jsx
import { Outlet } from "react-router-dom";

/**
 * UserLayout
 *
 * Purpose:
 * - Wraps user dashboard pages
 * - Can add user-specific sidebar/navigation here later
 * - No Navbar/Footer (handled by BaseLayout)
 */
export default function UserLayout() {
  return (
    <div className="user-layout">
      <Outlet />
    </div>
  );
}
```

##### OrgLayout

**File:** `src/layouts/OrgLayout.jsx`

```jsx
import { Outlet } from "react-router-dom";

/**
 * OrgLayout
 *
 * Purpose:
 * - Wraps organization dashboard pages
 * - Can add org-specific sidebar/navigation here later
 */
export default function OrgLayout() {
  return (
    <div className="org-layout">
      <Outlet />
    </div>
  );
}
```

##### AdminLayout

**File:** `src/layouts/AdminLayout.jsx`

```jsx
import { Outlet } from "react-router-dom";

/**
 * AdminLayout
 *
 * Purpose:
 * - Wraps admin dashboard pages
 * - Can add admin-specific sidebar/navigation here later
 */
export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Outlet />
    </div>
  );
}
```

#### Step 3: Update App.jsx with Nested Routes

**File:** `src/App.jsx`

```jsx
import { Routes, Route, Navigate } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import UserLayout from "./layouts/UserLayout";
import OrgLayout from "./layouts/OrgLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/about";
import Blog from "./pages/blog";
import Careers from "./pages/Careers";
import Community from "./pages/community";
import Contact from "./pages/contact";
import CaseStudy from "./pages/CaseStudy";

// Dashboard pages
import UserDashboard from "./components/userDashboard";
import OrgDashboard from "./pages/OrgDashboard";
import AdminDashboard from "./pages/AdminDashboard";
// Note: ViewAssets, Profile, Wallet, Upload are in PUBLIC layout (protected but not under dashboards)
import ViewAssets from "./pages/ViewAssets";
import Profile from "./pages/profile";
import Wallet from "./pages/wallet";
import Upload from "./components/upload";

function App() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/case-studies" element={<CaseStudy />} />

        {/* ================= PROTECTED ROUTES (PUBLIC LAYOUT) ================= */}
        {/* These routes are in BaseLayout but require authentication */}
        {/* They render differently based on role, but structure stays in public layout */}
        {/* Profile dropdown menu contents change based on auth/role (handled by Navbar) */}

        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={["user", "organization"]}>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-assets"
          element={
            <ProtectedRoute allowedRoles={["user", "organization"]}>
              <ViewAssets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute allowedRoles={["user", "organization"]}>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= USER DASHBOARD ROUTES ================= */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          {/* Add nested dashboard tabs here later */}
          {/* Redirect /user to /user/dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ================= ORGANIZATION DASHBOARD ROUTES ================= */}
        <Route
          path="/org/*"
          element={
            <ProtectedRoute requiredRole="organization">
              <OrgLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OrgDashboard />} />
          {/* Add nested dashboard tabs here later */}
          {/* Redirect /org to /org/dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ================= ADMIN DASHBOARD ROUTES ================= */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Add nested dashboard tabs here later */}
          {/* Redirect /admin to /admin/dashboard */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* ================= LEGACY ROUTE REDIRECTS ================= */}
        {/* Keep these for backward compatibility during migration */}
        <Route
          path="/userDashboard"
          element={<Navigate to="/user/dashboard" replace />}
        />
        <Route
          path="/orgDashboard"
          element={<Navigate to="/org/dashboard" replace />}
        />
        <Route
          path="/adminDashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* ================= CATCH ALL ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
```

#### Step 4: Update Login Redirects

**File:** `src/pages/Login.jsx`

Update the redirect logic:

```jsx
// ✅ If active, redirect based on role
switch (role) {
  case "USER":
    navigate("/user/dashboard", { replace: true });
    break;
  case "ORGANIZATION":
    navigate("/org/dashboard", { replace: true });
    break;
  case "ADMIN":
    navigate("/admin/dashboard", { replace: true });
    break;
  default:
    console.warn("Unknown role:", role);
    navigate("/", { replace: true });
}
```

#### Step 5: Update Navbar Dashboard Links

**File:** `src/common/Navbar.jsx`

Update `getDashboardRoute()`:

```jsx
const getDashboardRoute = () => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "organization") return "/org/dashboard";
  return "/user/dashboard";
};
```

---

## UX Rules Implementation

### ✅ Navbar Never Changes Structurally

- **Implementation:** Navbar is in BaseLayout, always renders
- **Behavior:** Only visibility of elements changes based on JWT/auth state
- **Location:** `src/common/Navbar.jsx`

### ✅ JWT-Driven Visibility

- **Implementation:** `useAuth()` hook reads JWT from localStorage
- **Behavior:** Navbar checks `isAuthenticated` and `role` to show/hide elements
- **No state management needed:** Just reads from localStorage

### ✅ Dashboards Are NOT New Apps

- **Implementation:** Nested routes under BaseLayout
- **Behavior:** Dashboards are just routes, not separate apps
- **Structure:** `/user/dashboard`, `/org/dashboard`, `/admin/dashboard`

### ✅ Protected Routes in Public Layout

- **Implementation:** `/upload`, `/view-assets`, `/wallet`, `/profile` are in BaseLayout (public layout)
- **Behavior:** Require authentication, render in BaseLayout with Navbar + Footer visible
- **Role-based rendering:** Content changes based on role, but route structure stays in public layout
- **Profile dropdown:** Menu contents change based on auth/role (handled by Navbar component)
- **Key point:** These routes are NOT under dashboard layouts - they're directly in BaseLayout

### ✅ Back Button Behavior

- **Dashboard → Home (logged-in):**
  - User clicks back from `/user/dashboard` → goes to `/` (home)
  - Still logged in, Navbar shows logged-in state
- **Home → stays home:**
  - User on `/` clicks back → stays on `/` (no loop)
- **Implementation:** React Router handles this naturally with `replace: true` on navigation

### ✅ No Full Reloads

- **Implementation:** All navigation uses React Router
- **Behavior:** Client-side routing, no `window.location.href`
- **Exception:** Only logout triggers a navigation

### ✅ No Role Switching Without Logout

- **Implementation:** ProtectedRoute checks role
- **Behavior:** If user tries to access `/admin/dashboard` but is a user, redirects to `/user/dashboard`
- **Enforcement:** ProtectedRoute component validates role

---

## File Structure (After Phase 2)

```
src/
├── layouts/
│   ├── BaseLayout.jsx          ✅ (Phase 1 - DONE)
│   ├── UserLayout.jsx          📝 (Phase 2 - TODO)
│   ├── OrgLayout.jsx           📝 (Phase 2 - TODO)
│   └── AdminLayout.jsx         📝 (Phase 2 - TODO)
│
├── components/
│   ├── ProtectedRoute.jsx      📝 (Phase 2 - TODO)
│   └── ...
│
├── pages/
│   ├── OrgDashboard.jsx        📝 (Phase 2 - TODO: Create or import)
│   ├── AdminDashboard.jsx      📝 (Phase 2 - TODO: Create or import)
│   └── ...
│
└── App.jsx                     📝 (Phase 2 - TODO: Update with nested routes)
```

---

## Migration Strategy

### Phase 2A: Create Components (No Breaking Changes)

1. Create ProtectedRoute component
2. Create UserLayout, OrgLayout, AdminLayout
3. Create OrgDashboard and AdminDashboard placeholder pages
4. **No route changes yet** - just create files

### Phase 2B: Add New Routes (Backward Compatible)

1. Add nested routes `/user/*`, `/org/*`, `/admin/*`
2. Keep old routes `/userDashboard`, `/orgDashboard`, `/adminDashboard`
3. Old routes redirect to new routes
4. **Users can access both** - no breaking changes

### Phase 2C: Update Navigation (Internal)

1. Update Login.jsx to redirect to new routes
2. Update Navbar.jsx to link to new routes
3. Update internal links in components
4. **Old routes still work** via redirects

### Phase 2D: Cleanup (Optional)

1. Remove old route redirects after migration period
2. Update any external links/bookmarks
3. **Complete migration**

---

## Testing Checklist (Phase 2)

- [ ] User login → redirects to `/user/dashboard`
- [ ] Org login → redirects to `/org/dashboard`
- [ ] Admin login → redirects to `/admin/dashboard`
- [ ] Access `/user/dashboard` without login → redirects to `/login`
- [ ] User tries to access `/org/dashboard` → redirects to `/user/dashboard`
- [ ] Back button from dashboard → goes to home
- [ ] Back button on home → stays on home
- [ ] Old routes (`/userDashboard`) → redirect to new routes
- [ ] Navbar shows correct state based on JWT
- [ ] Logout → clears auth → redirects to home
- [ ] No page reloads during navigation

---

## Next Steps

1. **Review this plan** and approve Phase 2 approach
2. **Create ProtectedRoute component** (Step 1)
3. **Create dashboard layouts** (Step 2)
4. **Update App.jsx** (Step 3)
5. **Update Login redirects** (Step 4)
6. **Update Navbar links** (Step 5)
7. **Test thoroughly** (Testing Checklist)

---

## Notes

- **No changes to dashboards yet** - they remain as-is
- **Nested routing is optional** - can add tabs later
- **Backward compatibility** - old routes will redirect
- **Incremental approach** - can implement step by step
- **BaseLayout stays** - Navbar/Footer never change
