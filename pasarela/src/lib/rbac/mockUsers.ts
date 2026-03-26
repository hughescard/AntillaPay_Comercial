import type { Permission } from "./permissions";
import { getPermissionsForRole } from "./helpers";
import type { RoleId } from "./roles";

export type AccountType = "individual" | "enterprise" | "bank";
export type AccountStatus = "sandbox" | "live";
export type AccountCapability =
  | "multi_user"
  | "approval_policies"
  | "third_party_payments"
  | "api_access";
export type UserStatus = "active" | "inactive";

export const MOCK_ACCOUNT = {
  id: "acct-antillapay-corp",
  name: "AntillaPay Corp",
  accountType: "bank" as AccountType,
  status: "sandbox" as AccountStatus,
  capabilities: [
    "multi_user",
    "approval_policies",
    "third_party_payments",
    "api_access",
  ] as AccountCapability[],
  createdAt: "2026-03-01T10:00:00.000Z",
} as const;

export type MockRbacUser = {
  id: string;
  label: string;
  name: string;
  email: string;
  role: RoleId;
  roles: RoleId[];
  status: UserStatus;
  accountId: string;
  accountName: string;
};

const RBAC_USERS_KEY = "pasarela_rbac_account_users_v1";

const normalizeUser = (user: Partial<MockRbacUser>): MockRbacUser => {
  const primaryRole = user.role ?? user.roles?.[0] ?? "viewer";
  return {
    id: user.id ?? `user-${Math.random().toString(36).slice(2, 8)}`,
    label: user.label ?? `${primaryRole} User`,
    name: user.name ?? "Usuario",
    email: user.email ?? "usuario@antillapay.demo",
    role: primaryRole,
    roles: user.roles?.length ? user.roles : [primaryRole],
    status: user.status ?? "active",
    accountId: user.accountId ?? MOCK_ACCOUNT.id,
    accountName: user.accountName ?? MOCK_ACCOUNT.name,
  };
};

export const MOCK_RBAC_USERS: MockRbacUser[] = [
  {
    id: "user-owner",
    label: "Owner User",
    name: "Maria Perez",
    email: "owner@antillapay.demo",
    role: "owner",
    roles: ["owner"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-admin",
    label: "Admin User",
    name: "Carlos Mendez",
    email: "admin@antillapay.demo",
    role: "admin",
    roles: ["admin"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-developer",
    label: "Developer User",
    name: "Diego Herrera",
    email: "developer@antillapay.demo",
    role: "developer",
    roles: ["developer"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-finance",
    label: "Finance User",
    name: "Sofia Campos",
    email: "finance@antillapay.demo",
    role: "finance",
    roles: ["finance"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-operations",
    label: "Operations User",
    name: "Raul Ortega",
    email: "operations@antillapay.demo",
    role: "operations",
    roles: ["operations"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-viewer",
    label: "Viewer User",
    name: "Elena Ruiz",
    email: "viewer@antillapay.demo",
    role: "viewer",
    roles: ["viewer"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-risk",
    label: "Risk User",
    name: "Marta Leon",
    email: "risk@antillapay.demo",
    role: "risk",
    roles: ["risk"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-maker",
    label: "Maker User",
    name: "Laura Perez",
    email: "maker@antillapay.demo",
    role: "maker",
    roles: ["maker", "finance"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-checker",
    label: "Checker User",
    name: "Daniel Suarez",
    email: "checker@antillapay.demo",
    role: "checker",
    roles: ["checker"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-checker-2",
    label: "Checker User",
    name: "Juan Torres",
    email: "checker.juan@antillapay.demo",
    role: "checker",
    roles: ["checker"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
  {
    id: "user-checker-3",
    label: "Checker User",
    name: "Pedro Acosta",
    email: "checker.pedro@antillapay.demo",
    role: "checker",
    roles: ["checker"],
    status: "active",
    accountId: MOCK_ACCOUNT.id,
    accountName: MOCK_ACCOUNT.name,
  },
] as const;

export const loadMockRbacUsers = (): MockRbacUser[] => {
  if (typeof window === "undefined") {
    return [...MOCK_RBAC_USERS];
  }

  const raw = window.localStorage.getItem(RBAC_USERS_KEY);
  if (!raw) {
    const seeded = [...MOCK_RBAC_USERS];
    window.localStorage.setItem(RBAC_USERS_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return (JSON.parse(raw) as Partial<MockRbacUser>[]).map(normalizeUser);
  } catch {
    const seeded = [...MOCK_RBAC_USERS];
    window.localStorage.setItem(RBAC_USERS_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

export const saveMockRbacUsers = (users: MockRbacUser[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RBAC_USERS_KEY, JSON.stringify(users));
};

export const getMockUserById = (
  userId: string,
  users: MockRbacUser[] = loadMockRbacUsers()
) => users.find((user) => user.id === userId) ?? users[0] ?? MOCK_RBAC_USERS[0];

export const getMockUserPermissions = (user: MockRbacUser): Permission[] =>
  getPermissionsForRole(user.role, user.roles);
