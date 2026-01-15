# Complete Migration Plan: Organization & Admin → User App

## Phase 2 Status: ✅ COMPLETE

Phase 2 (Protected Routes & Dashboard Layouts) has been successfully implemented.

---

## Phase 3: Complete Migration Plan

### Goal

Migrate all functionality from `frontend/Organization/` and `frontend/Admin/` into `frontend/User/` to create a **single unified application**. The User app will be renamed to the final app name after migration.

### Principles

1. **No functionality loss** - All features must be preserved
2. **Production-grade** - Clean, maintainable, optimal code structure
3. **Incremental migration** - Step-by-step approach with testing at each stage
4. **Dependency consolidation** - Merge dependencies, remove duplicates
5. **Path updates** - All imports updated to new structure

---

## Inventory Analysis

### Organization App (`frontend/Organization/`)

#### Pages (1)

- ✅ `src/pages/OrgDashboard.jsx` - Main dashboard with tabs

#### Components (15)

- `AddAsset.jsx` - Add new asset form
- `AssetCard.jsx` - Asset card display
- `AssetManagement.jsx` - Asset management tab component
- `AssetTopBar.jsx` - Asset management toolbar
- `basic-ui.jsx` - UI component library (Tabs, Button, Badge, Card, etc.)
- `ComplianceReports.jsx` - Compliance reports tab
- `CreditEarnings.jsx` - Credit earnings tab
- `FilterPanel.jsx` - Asset filtering panel
- `FleetManagement.jsx` - Fleet management (commented out)
- `Footer.jsx` - Footer component (may conflict with User app)
- `Overview.jsx` - Overview tab component
- `popupforms.jsx` - Popup form components
- `QuickActions.jsx` - Quick actions tab
- `Sidebar.jsx` - Sidebar navigation (not currently used in OrgDashboard)
- `TeamManagement.jsx` - Team management tab

#### Services (1)

- `api.js` - Asset API service (EV, Solar, Tree CRUD operations)

#### Styles (8)

- `AddAsset.css`
- `AssetTopBar.css`
- `ComplianceReports.css`
- `Footer.css`
- `global.css`
- `global1.css`
- `popupforms.css`
- `TeamManagement.css`

#### Routes (3)

- `/` → OrgDashboard
- `/add-asset` → AddAsset
- `/view-fleet` → FleetManagement (commented out)

#### Dependencies

- `framer-motion` ✅ (User has it)
- `react-icons` ✅ (User has it)
- `axios` ✅ (User has it)
- `chart.js` ✅ (User has it)
- `react-chartjs-2` ✅ (User has it)
- `recharts` ✅ (User has it)
- `styled-components` ❌ (User doesn't have - check if needed)
- `jspdf` ✅ (User has it)
- `xlsx` ✅ (User has it)
- `@radix-ui/react-dropdown-menu` ❌ (User doesn't have)

---

### Admin App (`frontend/Admin/`)

#### Pages (10)

- `AdminDashboard.jsx` - Redirects to `/overview`
- `Overview.jsx` - Admin overview page
- `Users.jsx` - User management page
- `Support.jsx` - Support management page
- `Security.jsx` - Security settings page
- `Configuration.jsx` - Configuration page
- `Analytics.jsx` - Analytics page
- `CareerManagement.jsx` - Career management page
- `CaseStudyManagement.jsx` - Case study management page
- `Reports.jsx` - Reports page (exists but not in routes)

#### Components (2)

- `AdminHeader.jsx` - Admin header with profile/logout
- `AdminNavbar.jsx` - Admin navigation bar

#### Services (3)

- `apiClient.js` - Base API client
- `userManagementApi.js` - User management API
- `notificationApi.js` - Notification API

#### API Clients (2)

- `api/authClient.js` - Authenticated API client
- `api/notificationClient.js` - Notification service client

#### Styles (11)

- `AdminDashboard.css`
- `AdminHeader.css`
- `AdminNavbar.css`
- `Analytics.css`
- `CareerManagement.css`
- `CaseStudyManagement.css`
- `Configuration.css`
- `Overview.css`
- `Security.css`
- `Support.css`
- `Users.css`

#### Routes (9)

- `/` → AdminDashboard (redirects to `/overview`)
- `/overview` → Overview
- `/users` → Users
- `/support` → Support
- `/security` → Security
- `/configuration` → Configuration
- `/analytics` → Analytics
- `/career-management` → CareerManagement
- `/case-study-management` → CaseStudyManagement

#### Dependencies

- `axios` ✅ (User has it)
- `chart.js` ✅ (User has it)
- `react-chartjs-2` ✅ (User has it)
- `recharts` ✅ (User has it)
- `lucide-react` ✅ (User has it)
- `react-icons` ✅ (User has it)

---

## Migration Strategy

### Phase 3A: Organization Dashboard Migration

#### Step 1: Copy Organization Components

**Target:** `frontend/User/src/components/org/`

**Files to copy:**

```
Organization/src/components/
├── AddAsset.jsx → User/src/components/org/AddAsset.jsx
├── AssetCard.jsx → User/src/components/org/AssetCard.jsx
├── AssetManagement.jsx → User/src/components/org/AssetManagement.jsx
├── AssetTopBar.jsx → User/src/components/org/AssetTopBar.jsx
├── basic-ui.jsx → User/src/components/org/basic-ui.jsx
├── ComplianceReports.jsx → User/src/components/org/ComplianceReports.jsx
├── CreditEarnings.jsx → User/src/components/org/CreditEarnings.jsx
├── FilterPanel.jsx → User/src/components/org/FilterPanel.jsx
├── Overview.jsx → User/src/components/org/Overview.jsx
├── popupforms.jsx → User/src/components/org/popupforms.jsx
├── QuickActions.jsx → User/src/components/org/QuickActions.jsx
└── TeamManagement.jsx → User/src/components/org/TeamManagement.jsx
```

**Actions:**

1. Create `frontend/User/src/components/org/` directory
2. Copy all components
3. Update import paths (relative paths should work, but check for absolute imports)
4. Update style imports to point to new styles location

#### Step 2: Copy Organization Styles

**Target:** `frontend/User/src/styles/org/`

**Files to copy:**

```
Organization/src/styles/
├── AddAsset.css → User/src/styles/org/AddAsset.css
├── AssetTopBar.css → User/src/styles/org/AssetTopBar.css
├── ComplianceReports.css → User/src/styles/org/ComplianceReports.css
├── global.css → User/src/styles/org/global.css (check for conflicts)
├── global1.css → User/src/styles/org/global1.css
├── popupforms.css → User/src/styles/org/popupforms.css
└── TeamManagement.css → User/src/styles/org/TeamManagement.css
```

**Actions:**

1. Create `frontend/User/src/styles/org/` directory
2. Copy styles (excluding Footer.css - User app has its own)
3. Update component imports to new paths
4. Check for CSS conflicts with User app styles

#### Step 3: Copy Organization Services

**Target:** `frontend/User/src/services/org/`

**Files to copy:**

```
Organization/src/services/
└── api.js → User/src/services/org/assetApi.js
```

**Actions:**

1. Create `frontend/User/src/services/org/` directory
2. Copy service file
3. Rename to `assetApi.js` for clarity
4. Update API_BASE_URL to use environment variable if needed
5. Check if User app has similar service that needs merging

#### Step 4: Replace OrgDashboard Placeholder

**Target:** `frontend/User/src/pages/OrgDashboard.jsx`

**Actions:**

1. Copy `Organization/src/pages/OrgDashboard.jsx`
2. Update all import paths:
   - `../components/*` → `../components/org/*`
   - `../styles/*` → `../styles/org/*`
3. Ensure it works within BaseLayout (no Navbar/Footer duplication)
4. Test all tabs render correctly

#### Step 5: Update Dependencies

**Actions:**

1. Check if User app needs `styled-components` (if Organization uses it)
2. Check if User app needs `@radix-ui/react-dropdown-menu` (if used)
3. Add missing dependencies to `frontend/User/package.json`
4. Run `npm install`

---

### Phase 3B: Admin Dashboard Migration

#### Step 1: Copy Admin Pages

**Target:** `frontend/User/src/pages/admin/`

**Files to copy:**

```
Admin/src/pages/
├── Overview.jsx → User/src/pages/admin/Overview.jsx
├── Users.jsx → User/src/pages/admin/Users.jsx
├── Support.jsx → User/src/pages/admin/Support.jsx
├── Security.jsx → User/src/pages/admin/Security.jsx
├── Configuration.jsx → User/src/pages/admin/Configuration.jsx
├── Analytics.jsx → User/src/pages/admin/Analytics.jsx
├── CareerManagement.jsx → User/src/pages/admin/CareerManagement.jsx
├── CaseStudyManagement.jsx → User/src/pages/admin/CaseStudyManagement.jsx
└── Reports.jsx → User/src/pages/admin/Reports.jsx
```

**Actions:**

1. Create `frontend/User/src/pages/admin/` directory
2. Copy all pages
3. Update import paths (check for relative vs absolute)

#### Step 2: Copy Admin Components

**Target:** `frontend/User/src/components/admin/`

**Files to copy:**

```
Admin/src/components/
├── AdminHeader.jsx → User/src/components/admin/AdminHeader.jsx
├── AdminNavbar.jsx → User/src/components/admin/AdminNavbar.jsx
```

**Actions:**

1. Create `frontend/User/src/components/admin/` directory
2. Copy components
3. Update import paths
4. Update logout navigation to use User app routes
5. Update header logo path if needed

#### Step 3: Copy Admin Styles

**Target:** `frontend/User/src/styles/admin/`

**Files to copy:**

```
Admin/src/styles/
├── AdminDashboard.css → User/src/styles/admin/AdminDashboard.css
├── AdminHeader.css → User/src/styles/admin/AdminHeader.css
├── AdminNavbar.css → User/src/styles/admin/AdminNavbar.css
├── Analytics.css → User/src/styles/admin/Analytics.css
├── CareerManagement.css → User/src/styles/admin/CareerManagement.css
├── CaseStudyManagement.css → User/src/styles/admin/CaseStudyManagement.css
├── Configuration.css → User/src/styles/admin/Configuration.css
├── Overview.css → User/src/styles/admin/Overview.css
├── Security.css → User/src/styles/admin/Security.css
├── Support.css → User/src/styles/admin/Support.css
└── Users.css → User/src/styles/admin/Users.css
```

**Actions:**

1. Create `frontend/User/src/styles/admin/` directory
2. Copy all styles
3. Update component imports

#### Step 4: Copy Admin Services & API Clients

**Target:** `frontend/User/src/services/admin/` and `frontend/User/src/api/admin/`

**Files to copy:**

```
Admin/src/services/
├── apiClient.js → User/src/services/admin/apiClient.js
├── userManagementApi.js → User/src/services/admin/userManagementApi.js
└── notificationApi.js → User/src/services/admin/notificationApi.js

Admin/src/api/
├── authClient.js → User/src/api/admin/authClient.js
└── notificationClient.js → User/src/api/admin/notificationClient.js
```

**Actions:**

1. Create directories
2. Copy files
3. Check authClient token key (`authToken` vs `token`) - may need to align with User app
4. Update import paths in services
5. Check if User app has similar API clients that need merging

#### Step 5: Update AdminLayout

**Target:** `frontend/User/src/layouts/AdminLayout.jsx`

**Actions:**

1. Replace placeholder with layout that includes:
   - AdminHeader
   - AdminNavbar
   - Outlet for pages
2. Ensure it works within BaseLayout (check if AdminHeader conflicts with BaseLayout Navbar)
3. Admin app structure shows AdminHeader + AdminNavbar + content
4. Need to decide: Should AdminLayout replace BaseLayout Navbar/Footer, or work alongside?

**Decision Required:**

- **Option A:** AdminLayout works within BaseLayout, AdminHeader is additional header
- **Option B:** AdminLayout replaces BaseLayout Navbar/Footer for admin routes
- **Recommendation:** Option B - Admin should have its own header/navbar (different UX)

**Implementation for Option B:**

- AdminLayout should NOT use BaseLayout
- Admin routes should be direct children of Routes, not BaseLayout
- OR: Create AdminBaseLayout that wraps admin routes

**Alternative Approach:**

- Keep admin routes under BaseLayout
- AdminHeader replaces Navbar for admin routes (conditional rendering)
- AdminNavbar is additional navigation

**Recommended:** Keep Admin routes separate from BaseLayout (different header/navbar structure)

#### Step 6: Update AdminDashboard

**Target:** `frontend/User/src/pages/AdminDashboard.jsx`

**Actions:**

1. Replace placeholder with redirect component (like Admin app has)
2. Or make it redirect to `/admin/overview`

#### Step 7: Update App.jsx Routes

**Target:** `frontend/User/src/App.jsx`

**Current Structure:**

```jsx
<Route element={<BaseLayout />}>
  {/* Public routes */}
  {/* Protected routes */}
  {/* Dashboard routes */}
</Route>
```

**New Structure Needed:**

```jsx
<Routes>
  {/* Admin routes - separate from BaseLayout */}
  <Route
    path="/admin/*"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="overview" element={<AdminOverview />} />
    <Route path="users" element={<AdminUsers />} />
    {/* ... other admin routes */}
  </Route>

  {/* BaseLayout routes (User, Org, Public) */}
  <Route element={<BaseLayout />}>{/* ... existing routes */}</Route>
</Routes>
```

---

### Phase 3C: Route Integration & Testing

#### Step 1: Update App.jsx

1. Add admin routes (separate from BaseLayout)
2. Ensure organization routes use OrgLayout correctly
3. Test all route paths

#### Step 2: Update Navigation

1. Update Navbar.jsx dashboard links (already done)
2. Check AdminHeader navigation
3. Check AdminNavbar navigation
4. Ensure all internal links work

#### Step 3: Dependency Consolidation

1. Review all package.json files
2. Merge dependencies (keep highest version)
3. Remove duplicates
4. Test that all imports work

#### Step 4: Environment Variables

1. Check API URLs in copied services
2. Use environment variables where needed
3. Document required env vars

#### Step 5: Testing Checklist

- [ ] Organization dashboard renders correctly
- [ ] All Organization tabs work (Overview, Assets, Earnings, Compliance, Team, QuickActions)
- [ ] Organization asset management works
- [ ] Admin dashboard redirects correctly
- [ ] All Admin pages render correctly
- [ ] Admin navigation works
- [ ] AdminHeader logout works
- [ ] All API calls work (check CORS, auth tokens)
- [ ] Styles render correctly (no conflicts)
- [ ] No console errors
- [ ] Role-based routing works (user can't access admin, etc.)

---

## File Structure (After Migration)

```
frontend/User/
├── src/
│   ├── api/
│   │   └── admin/
│   │       ├── authClient.js
│   │       └── notificationClient.js
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.jsx
│   │   │   └── AdminNavbar.jsx
│   │   ├── org/
│   │   │   ├── AddAsset.jsx
│   │   │   ├── AssetCard.jsx
│   │   │   ├── AssetManagement.jsx
│   │   │   ├── AssetTopBar.jsx
│   │   │   ├── basic-ui.jsx
│   │   │   ├── ComplianceReports.jsx
│   │   │   ├── CreditEarnings.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── popupforms.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   └── TeamManagement.jsx
│   │   └── [existing User components]
│   │
│   ├── layouts/
│   │   ├── AdminLayout.jsx (updated)
│   │   ├── BaseLayout.jsx
│   │   ├── OrgLayout.jsx
│   │   └── UserLayout.jsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Analytics.jsx
│   │   │   ├── CareerManagement.jsx
│   │   │   ├── CaseStudyManagement.jsx
│   │   │   ├── Configuration.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Security.jsx
│   │   │   ├── Support.jsx
│   │   │   └── Users.jsx
│   │   ├── AdminDashboard.jsx (updated)
│   │   ├── OrgDashboard.jsx (updated)
│   │   └── [existing User pages]
│   │
│   ├── services/
│   │   ├── admin/
│   │   │   ├── apiClient.js
│   │   │   ├── notificationApi.js
│   │   │   └── userManagementApi.js
│   │   └── org/
│   │       └── assetApi.js
│   │
│   └── styles/
│       ├── admin/
│       │   ├── AdminDashboard.css
│       │   ├── AdminHeader.css
│       │   ├── AdminNavbar.css
│       │   ├── Analytics.css
│       │   ├── CareerManagement.css
│       │   ├── CaseStudyManagement.css
│       │   ├── Configuration.css
│       │   ├── Overview.css
│       │   ├── Security.css
│       │   ├── Support.css
│       │   └── Users.css
│       └── org/
│           ├── AddAsset.css
│           ├── AssetTopBar.css
│           ├── ComplianceReports.css
│           ├── global.css
│           ├── global1.css
│           ├── popupforms.css
│           └── TeamManagement.css
│
└── package.json (consolidated dependencies)
```

---

## Critical Decisions Needed

### 1. Admin Layout Structure ✅ DECIDED

**Decision:** AdminLayout works alongside BaseLayout (does NOT replace Navbar/Footer)

**Implementation:**

- AdminLayout uses BaseLayout (admin routes are under BaseLayout)
- AdminHeader.jsx is NOT needed - AdminHeader functionality is already merged into `User/src/common/Navbar.jsx`
- AdminLayout contains: AdminNavbar (tabs/navigation) + Outlet (for admin pages)
- BaseLayout provides: Navbar (role-aware, already handles admin) + Footer (always visible)
- Admin routes structure: `<BaseLayout><AdminLayout><Outlet/></AdminLayout></BaseLayout>`

### 2. API Token Key Alignment ✅ DECIDED

**Issue:** Admin uses `authToken`, User app uses `token`

**Solution:** Standardize on `token` (User app standard), update Admin authClient to use `token` instead of `authToken`

### 3. CSS Organization ✅ DECIDED

**Current Situation:**

- User app has styles in `src/styles/` (various CSS files)
- Organization has styles in `src/styles/` (including `global.css`, `global1.css`)
- Admin has styles in `src/styles/` (various CSS files)

**Problem:**

- CSS file names may conflict (e.g., multiple `global.css` files)
- Global styles from one module might affect other modules
- Hard to track which styles belong to which module
- Potential specificity conflicts

**Current Solution (Decided):**

- Organization styles → `src/styles/org/` (with org/global.css, org/global1.css)
- Admin styles → `src/styles/admin/` (with admin/Overview.css, etc.)
- User styles → `src/styles/` (keep as-is for now)
- **Rule:** Each module (org, admin) imports its own global CSS ONLY in its own pages/components
  - OrgDashboard imports org/global.css and org/global1.css
  - Admin pages import their own CSS files
  - No global CSS from org/admin affects User app styles

**Future Consideration (Not Decided Yet):**

- Option: Move User styles to `src/styles/user/` for consistency
- **Pros:** Consistent structure, clearer organization, easier to manage
- **Cons:** Requires updating all User component imports, more refactoring
- **Recommendation:** Leave for future refactoring after migration is stable

**CSS Conflict Prevention:**

- All CSS files have unique names (no same filename conflicts)
- Each module's global CSS is imported only in that module's components
- Scoped styles prevent cross-module conflicts
- Check for any class name conflicts manually if issues arise

### 4. Footer Component ✅ DECIDED

**Decision:** Only ONE Footer component (from BaseLayout)

**Solution:**

- Use User app Footer (already in BaseLayout)
- Ignore Organization Footer.jsx (don't copy it)
- Ignore Admin Footer (Admin doesn't have one, but if it did, ignore it)
- Footer is always visible from BaseLayout

---

## Migration Checklist

### Phase 3A: Organization Migration

- [ ] Create `src/components/org/` directory
- [ ] Copy all Organization components
- [ ] Update component import paths
- [ ] Create `src/styles/org/` directory
- [ ] Copy Organization styles (except Footer.css)
- [ ] Update style import paths
- [ ] Create `src/services/org/` directory
- [ ] Copy and update Organization service
- [ ] Replace OrgDashboard placeholder
- [ ] Update OrgDashboard imports
- [ ] Test Organization dashboard
- [ ] Test all Organization tabs
- [ ] Add missing dependencies (styled-components, @radix-ui/react-dropdown-menu)

### Phase 3B: Admin Migration

- [ ] Create `src/pages/admin/` directory
- [ ] Copy all Admin pages
- [ ] Update page import paths
- [ ] Create `src/components/admin/` directory
- [ ] Copy Admin components
- [ ] Update AdminHeader logout navigation
- [ ] Create `src/styles/admin/` directory
- [ ] Copy Admin styles
- [ ] Create `src/services/admin/` directory
- [ ] Copy Admin services
- [ ] Create `src/api/admin/` directory
- [ ] Copy Admin API clients
- [ ] Update authClient token key to match User app
- [ ] Update AdminLayout
- [ ] Update AdminDashboard
- [ ] Update App.jsx routes (Admin separate from BaseLayout)
- [ ] Test Admin dashboard
- [ ] Test all Admin pages

### Phase 3C: Integration & Testing

- [ ] Consolidate package.json dependencies
- [ ] Update all import paths
- [ ] Fix API URLs (use env vars)
- [ ] Test all routes
- [ ] Test role-based access
- [ ] Fix any CSS conflicts
- [ ] Fix any console errors
- [ ] Test authentication flows
- [ ] Test logout from all dashboards
- [ ] Performance check
- [ ] Final testing checklist

---

## Post-Migration: Final Steps

1. **Rename User App**

   - After migration complete and tested
   - Rename `frontend/User/` to final app name (e.g., `frontend/app/` or `frontend/frontend/`)

2. **Cleanup**

   - Archive or delete `frontend/Organization/`
   - Archive or delete `frontend/Admin/`
   - Update documentation
   - Update CI/CD pipelines if any

3. **Documentation**
   - Update README
   - Document new structure
   - Document API endpoints
   - Document environment variables

---

## Notes

- **No functionality loss** - All features from Organization and Admin apps must work
- **Incremental approach** - Complete Phase 3A, test, then Phase 3B, test, then Phase 3C
- **Backward compatibility** - Legacy routes should still work during migration
- **Testing is critical** - Test after each phase before proceeding
- **Dependencies** - Check for conflicts, use highest version
- **Environment variables** - Document all required env vars
- **API consistency** - Align token keys, base URLs, etc.

---

## Estimated Timeline

- Phase 3A (Organization): 2-3 hours
- Phase 3B (Admin): 2-3 hours
- Phase 3C (Integration & Testing): 2-3 hours
- **Total: 6-9 hours**

---

**Status:** Ready to begin implementation



import axios from "axios";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default authClient;
