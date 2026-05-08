# Frontend Development Guide

This guide documents the structure, patterns, and conventions used throughout the Ondo Voting Admin frontend.

## Project Structure

```
src/
├── components/          # Shared UI components (forms, cards, buttons)
├── contexts/            # React context providers (AuthContext)
├── hooks/               # Custom React hooks (useData, useForm, etc.)
├── api/                 # API client and configuration
├── mocks/               # Mock data for development
├── types/               # TypeScript type definitions
├── features/            # Feature modules (see below)
│   ├── auth/
│   ├── dashboard/
│   ├── elections/
│   ├── geography/
│   ├── parties/
│   ├── candidates/
│   ├── ballot-builder/
│   ├── voters/
│   ├── biometric-review/
│   ├── monitoring/
│   ├── results/
│   ├── audit-logs/
│   ├── admin-users/
│   └── settings/
├── pages/               # Page-level components (routing destinations)
├── layouts/             # Layout wrappers (AdminLayout, etc.)
├── lib/                 # Utility functions and helpers
└── services/            # Higher-level service layer (optional)
```

## Feature Module Structure

Each feature module (e.g., `features/elections/`) follows this structure:

```
features/elections/
├── components/          # Feature-specific components
│   ├── ElectionForm.tsx
│   ├── ElectionTable.tsx
│   └── ElectionDetail.tsx
├── services/            # Feature-specific API services
│   └── electionsService.ts
├── types/               # Feature-specific types
│   └── index.ts
├── hooks/               # Feature-specific hooks (optional)
│   └── useElections.ts
└── index.ts             # Barrel export
```

## Core Patterns

### 1. API Client Usage

Use the centralized `apiClient` for all API calls:

```typescript
import { apiClient } from "../api/client";

// GET
const elections = await apiClient.get("/elections");

// POST
const newElection = await apiClient.post("/elections", {
  title: "My Election",
  date: "2024-11-16",
});

// PUT
const updated = await apiClient.put("/elections/1", { title: "Updated" });

// DELETE
await apiClient.delete("/elections/1");
```

### 2. Feature Service Pattern

Create a service file for each feature's API operations:

```typescript
// features/elections/services/electionsService.ts
import { apiClient, fetchPaginated } from "../../../api/client";
import { Election, PaginatedResponse } from "../../../types";

export const electionsService = {
  list: (page: number, limit: number) =>
    fetchPaginated<Election>("/elections", page, limit),

  get: (id: string) => apiClient.get<Election>(`/elections/${id}`),

  create: (data: Partial<Election>) =>
    apiClient.post<Election>("/elections", data),

  update: (id: string, data: Partial<Election>) =>
    apiClient.put<Election>(`/elections/${id}`, data),

  delete: (id: string) => apiClient.delete(`/elections/${id}`),
};
```

### 3. Custom Hooks for Data Management

Use provided hooks from `hooks/useData.ts`:

#### `usePaginatedList` - For paginated data:

```typescript
function ElectionsList() {
  const { data, page, isLoading, error, goToPage, nextPage, prevPage } =
    usePaginatedList(
      (page, limit) => electionsService.list(page, limit),
      20
    );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(election => <div key={election.id}>{election.title}</div>)}
      <button onClick={prevPage}>Previous</button>
      <span>Page {page}</span>
      <button onClick={nextPage}>Next</button>
    </div>
  );
}
```

#### `useFilteredList` - For search and filtering:

```typescript
function VotersList() {
  const { data, search, sort, isLoading, error } =
    useFilteredList(
      (filters) => votersService.list(filters)
    );

  return (
    <div>
      <input
        onChange={(e) => search(e.target.value)}
        placeholder="Search voters..."
      />
      <button onClick={() => sort('createdAt', 'desc')}>Sort by Date</button>
      {data.map(voter => <VoterCard key={voter.id} voter={voter} />)}
    </div>
  );
}
```

#### `useForm` - For form state management:

```typescript
function CreateElectionForm() {
  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useForm(
      { title: '', description: '', electionDate: '' },
      async (values) => {
        await electionsService.create(values);
      }
    );

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Election Title"
      />
      {errors.title && <span>{errors.title}</span>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### `useAsync` - For any async operation:

```typescript
function Dashboard() {
  const { status, data: stats, error, execute } =
    useAsync(() => dashboardService.getStats(), true);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error}</div>;

  return <div>{stats?.totalVoters}</div>;
}
```

### 4. Component Patterns

#### Page Component Pattern

```typescript
// features/elections/ElectionsPage.tsx
import { ElectionsList } from './components/ElectionsList';
import { CreateElectionButton } from './components/CreateElectionButton';

export function ElectionsPage() {
  return (
    <div>
      <h1>Elections</h1>
      <CreateElectionButton />
      <ElectionsList />
    </div>
  );
}
```

#### Feature Component Pattern

```typescript
// features/elections/components/ElectionsList.tsx
import { usePaginatedList } from '../../../hooks/useData';
import { electionsService } from '../services/electionsService';
import { ElectionTable } from './ElectionTable';

export function ElectionsList() {
  const { data, isLoading, error, goToPage } =
    usePaginatedList((page, limit) => electionsService.list(page, limit));

  if (isLoading) return <div>Loading elections...</div>;
  if (error) return <div>Error: {error}</div>;

  return <ElectionTable elections={data} onPageChange={goToPage} />;
}
```

### 5. Type Safety

Always import types from `types/index.ts`:

```typescript
import { Election, Voter, BiometricProfile } from "../types";

interface ElectionFormProps {
  election?: Election;
  onSave: (election: Election) => Promise<void>;
}

export function ElectionForm({ election, onSave }: ElectionFormProps) {
  // ...
}
```

## Authentication Pattern

The app uses `AuthContext` for auth state management:

```typescript
import { useAuth } from '../contexts/AuthContext';

export function ProtectedComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div>
      Welcome, {user?.fullName}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Mock Data for Development

Use mock data from `mocks/data.ts` for UI development before APIs exist:

```typescript
import { mockElections, mockVoters } from '../mocks/data';

// Use directly in components for testing
function ElectionsList() {
  return (
    <div>
      {mockElections.map(e => <div key={e.id}>{e.title}</div>)}
    </div>
  );
}

// Or mock API responses
export const electionsService = {
  list: async () => ({
    data: mockElections,
    total: mockElections.length,
    page: 1,
    limit: 20,
    hasMore: false,
  }),
};
```

## Environment Configuration

Create a `.env.local` file in the frontend root:

```
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_MOCK_API=false
```

Then use in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const useMockApi = import.meta.env.VITE_ENABLE_MOCK_API === "true";
```

## Adding a New Feature

Follow this process to add a new feature module:

1. **Create directory structure:**

   ```
   features/my-feature/
   ├── components/
   ├── services/
   ├── types/
   └── index.ts
   ```

2. **Define types** in `features/my-feature/types/index.ts`

3. **Create service** in `features/my-feature/services/myFeatureService.ts`

4. **Create components** in `features/my-feature/components/`

5. **Export from feature** in `features/my-feature/index.ts`:

   ```typescript
   export { MyFeaturePage } from "./MyFeaturePage";
   export { MyFeatureService } from "./services";
   export type { MyFeature } from "./types";
   ```

6. **Add page** to `src/pages/MyFeaturePage.tsx`

7. **Add route** to `src/routes/adminRoutes.ts`

## Development Workflow

### Running the Dev Server

```bash
npm run dev
```

Server runs on `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output in `dist/` directory

### Previewing Production Build

```bash
npm run preview
```

## Common Tasks

### Making an API Call

```typescript
import { apiClient } from "../api/client";

async function fetchData() {
  try {
    const data = await apiClient.get("/endpoint");
    // Use data
  } catch (error) {
    console.error("API error:", error);
  }
}
```

### Creating a Paginated List

```typescript
import { usePaginatedList } from '../hooks/useData';

function MyList() {
  const { data, page, goToPage, nextPage, prevPage } =
    usePaginatedList((page, limit) => service.list(page, limit));

  return (
    <div>
      {data.map(item => <Item key={item.id} item={item} />)}
      <button onClick={prevPage}>Prev</button>
      <button onClick={nextPage}>Next</button>
    </div>
  );
}
```

### Handling Form Submission

```typescript
function MyForm() {
  const { values, errors, handleChange, handleSubmit } =
    useForm(
      { name: '' },
      async (values) => {
        await service.create(values);
      }
    );

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={values.name} onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
}
```

## Best Practices

1. **Always use TypeScript types** - Never use `any`
2. **Keep components focused** - One responsibility per component
3. **Use custom hooks** - Extract reusable logic into hooks
4. **Centralize API calls** - Use service layer, don't call API directly in components
5. **Handle errors gracefully** - Always show user-friendly error messages
6. **Use mock data** - Don't wait for backend to build UI
7. **Follow file naming** - Use PascalCase for components, camelCase for utilities
8. **Comment complex logic** - Explain the "why" not the "what"

## Troubleshooting

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

### Runtime Errors

- Check browser console for errors
- Verify API endpoint configuration
- Check mock data imports

### Dev Server Issues

- Kill process on port 5173 and restart
- Check firewall/networking settings
- Verify environment variables in `.env.local`
