export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  message?: string;
};

type MockAuthUser = {
  id: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
  phoneNumber?: string;
  createdAt: number;
  lastLoginAt: number | null;
};

type SignUpPayload = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

const MOCK_AUTH_USERS_KEY = "ondo-vote-mock-admin-users";

const DEFAULT_ADMIN: MockAuthUser = {
  id: "demo-super-admin",
  email: "admin@demo.local",
  fullName: "Demo Admin",
  password: "Password123",
  role: "SUPER_ADMIN",
  phoneNumber: "08000000000",
  createdAt: Date.now(),
  lastLoginAt: null,
};

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function clearStorageOnFirstLoad() {
  // Clear preloaded mock admin user on first load
  const hasCleared = window.localStorage.getItem('ondo-vote-cleared-auth-preload');
  if (!hasCleared) {
    window.localStorage.removeItem(MOCK_AUTH_USERS_KEY);
    window.localStorage.setItem('ondo-vote-cleared-auth-preload', 'true');
  }
}

function parseUsers(): MockAuthUser[] {
  try {
    const raw = window.localStorage.getItem(MOCK_AUTH_USERS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as MockAuthUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: MockAuthUser[]) {
  window.localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(users));
}

function ensureSeedUser() {
  return parseUsers();
}

function createAccessToken(user: MockAuthUser) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    issuedAt: Date.now(),
  };

  return window.btoa(JSON.stringify(payload));
}

function toAuthResponse(user: MockAuthUser): AuthResponse {
  return {
    accessToken: createAccessToken(user),
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

export async function mockAdminSignUp(payload: SignUpPayload): Promise<AuthResponse> {
  clearStorageOnFirstLoad();
  await delay(350);

  const email = normalizeEmail(payload.email);
  const fullName = payload.fullName.trim();
  const password = payload.password;

  if (!email || !fullName || !password) {
    throw new Error("email, password, and fullName are required.");
  }

  const users = parseUsers();
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("An admin account already exists for this email.");
  }

  const newUser: MockAuthUser = {
    id: `demo-admin-${Date.now()}`,
    email,
    fullName,
    password,
    role: "SUPER_ADMIN",
    phoneNumber: payload.phoneNumber?.trim() || undefined,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  };

  const nextUsers = [...users, newUser];
  saveUsers(nextUsers);

  return toAuthResponse(newUser);
}

export async function mockAdminSignIn(payload: SignInPayload): Promise<AuthResponse> {
  clearStorageOnFirstLoad();
  await delay(300);

  const email = normalizeEmail(payload.email);
  const password = payload.password;

  if (!email || !password) {
    throw new Error("email and password are required.");
  }

  const users = parseUsers();
  const user = users.find((entry) => entry.email === email);

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const updatedUser: MockAuthUser = {
    ...user,
    lastLoginAt: Date.now(),
  };

  const nextUsers = users.map((entry) => (entry.id === updatedUser.id ? updatedUser : entry));
  saveUsers(nextUsers);

  return toAuthResponse(updatedUser);
}