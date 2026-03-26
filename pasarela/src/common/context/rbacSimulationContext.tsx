'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  appendAccountAuditEntry,
  getMockUserById,
  getMockUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  MOCK_ACCOUNT,
  MOCK_RBAC_USERS,
  ROLE_DEFINITIONS,
  saveMockRbacUsers,
  type MockRbacUser,
  type Permission,
  type RoleId,
  type UserStatus,
} from "@/lib/rbac";
import { loadAccountAuditEntries, type AccountAuditEntry } from "@/lib/rbac/accountAudit";

const RBAC_USER_KEY = "pasarela_rbac_mock_user_v1";

type RbacSimulationContextType = {
  account: typeof MOCK_ACCOUNT;
  users: MockRbacUser[];
  currentUser: MockRbacUser;
  permissions: Permission[];
  switchUser: (userId: string) => void;
  auditEntries: AccountAuditEntry[];
  createUser: (input: { name: string; email: string; roles: RoleId[]; status: UserStatus }) => void;
  updateUser: (userId: string, input: { name: string; email: string; roles: RoleId[]; status: UserStatus }) => void;
  deleteUser: (userId: string) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (required: Permission[]) => boolean;
  hasAllPermissions: (required: Permission[]) => boolean;
};

const RbacSimulationContext = createContext<RbacSimulationContextType | undefined>(undefined);

export const RbacSimulationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<MockRbacUser[]>(() => [...MOCK_RBAC_USERS]);
  const [auditEntries, setAuditEntries] = useState<AccountAuditEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>(() => MOCK_RBAC_USERS[0]?.id ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUsers = window.localStorage.getItem("pasarela_rbac_account_users_v1");
    let parsedUsers: MockRbacUser[] = [...MOCK_RBAC_USERS];

    if (storedUsers) {
      try {
        parsedUsers = JSON.parse(storedUsers) as MockRbacUser[];
        setUsers(parsedUsers);
      } catch {
        parsedUsers = [...MOCK_RBAC_USERS];
        setUsers([...MOCK_RBAC_USERS]);
      }
    } else {
      setUsers([...MOCK_RBAC_USERS]);
    }
    const stored = window.localStorage.getItem(RBAC_USER_KEY);
    if (!stored) return;
    setCurrentUserId(getMockUserById(stored, parsedUsers).id);
    setAuditEntries(loadAccountAuditEntries());
  }, []);

  const switchUser = (userId: string) => {
    const next = getMockUserById(userId, users);
    setCurrentUserId(next.id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RBAC_USER_KEY, next.id);
    }
  };

  const createUser = (input: { name: string; email: string; roles: RoleId[]; status: UserStatus }) => {
    if (!hasPermission(getMockUserPermissions(getMockUserById(currentUserId, users)), "create_user")) {
      throw new Error("No tienes permiso para crear usuarios.");
    }

    if (!hasPermission(getMockUserPermissions(getMockUserById(currentUserId, users)), "assign_roles")) {
      throw new Error("No tienes permiso para asignar roles.");
    }

    if (!input.roles.length) {
      throw new Error("Selecciona al menos un rol.");
    }

    const trimmedEmail = input.email.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
      throw new Error("Ya existe un usuario con ese correo.");
    }

    const nextUsers: MockRbacUser[] = [
      ...users,
      {
        id: `user-${Math.random().toString(36).slice(2, 8)}`,
        label: `${ROLE_DEFINITIONS[input.roles[0]].name} User`,
        name: input.name.trim(),
        email: trimmedEmail,
        role: input.roles[0],
        roles: input.roles,
        status: input.status,
        accountId: MOCK_ACCOUNT.id,
        accountName: MOCK_ACCOUNT.name,
      },
    ];

    setUsers(nextUsers);
    saveMockRbacUsers(nextUsers);
    setAuditEntries(
      appendAccountAuditEntry({
        action: "user_created",
        actorId: getMockUserById(currentUserId, users).id,
        actorName: getMockUserById(currentUserId, users).name,
        targetName: input.name.trim(),
        description: `Se creó el usuario ${input.name.trim()} con roles ${input.roles.join(", ")}.`,
      })
    );
  };

  const updateUser = (
    userId: string,
    input: { name: string; email: string; roles: RoleId[]; status: UserStatus }
  ) => {
    if (!hasPermission(getMockUserPermissions(getMockUserById(currentUserId, users)), "update_user")) {
      throw new Error("No tienes permiso para editar usuarios.");
    }

    const target = getMockUserById(userId, users);
    if (!target) {
      throw new Error("Usuario no encontrado.");
    }

    if (target.roles.includes("owner")) {
      throw new Error("El usuario owner no puede modificarse desde esta vista.");
    }

    if (
      input.roles.join("|") !== target.roles.join("|") &&
      !hasPermission(getMockUserPermissions(getMockUserById(currentUserId, users)), "assign_roles")
    ) {
      throw new Error("No tienes permiso para reasignar roles.");
    }

    if (!input.roles.length) {
      throw new Error("Selecciona al menos un rol.");
    }

    if (currentUserId === userId && input.status !== "active") {
      throw new Error("No puedes desactivar el usuario que está usando la sesión actual.");
    }

    const trimmedEmail = input.email.trim().toLowerCase();
    if (users.some((user) => user.id !== userId && user.email.toLowerCase() === trimmedEmail)) {
      throw new Error("Ya existe un usuario con ese correo.");
    }

    const nextUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            label: `${ROLE_DEFINITIONS[input.roles[0]].name} User`,
            name: input.name.trim(),
            email: trimmedEmail,
            role: input.roles[0],
            roles: input.roles,
            status: input.status,
          }
        : user
    );

    setUsers(nextUsers);
    saveMockRbacUsers(nextUsers);
    setAuditEntries(
      appendAccountAuditEntry({
        action: "user_updated",
        actorId: getMockUserById(currentUserId, users).id,
        actorName: getMockUserById(currentUserId, users).name,
        targetName: input.name.trim(),
        description: `Se actualizó el usuario ${input.name.trim()} con roles ${input.roles.join(", ")} y estado ${input.status}.`,
      })
    );
  };

  const deleteUser = (userId: string) => {
    if (!hasPermission(getMockUserPermissions(getMockUserById(currentUserId, users)), "delete_user")) {
      throw new Error("No tienes permiso para eliminar usuarios.");
    }

    const target = getMockUserById(userId, users);
    if (!target) {
      throw new Error("Usuario no encontrado.");
    }

    if (target.roles.includes("owner")) {
      throw new Error("El usuario owner no puede eliminarse.");
    }

    if (currentUserId === userId) {
      throw new Error("No puedes eliminar tu propio usuario mientras está activo.");
    }

    const nextUsers = users.filter((user) => user.id !== userId);
    setUsers(nextUsers);
    saveMockRbacUsers(nextUsers);
    setAuditEntries(
      appendAccountAuditEntry({
        action: "user_deleted",
        actorId: getMockUserById(currentUserId, users).id,
        actorName: getMockUserById(currentUserId, users).name,
        targetName: target.name,
        description: `Se eliminó el usuario ${target.name}.`,
      })
    );
  };

  const currentUser = useMemo(
    () => getMockUserById(currentUserId, users),
    [currentUserId, users]
  );

  const permissions = useMemo(
    () => getMockUserPermissions(currentUser),
    [currentUser]
  );

  const value = useMemo<RbacSimulationContextType>(
    () => ({
      account: MOCK_ACCOUNT,
      users,
      currentUser,
      permissions,
      auditEntries,
      switchUser,
      createUser,
      updateUser,
      deleteUser,
      hasPermission: (permission: Permission) => hasPermission(permissions, permission),
      hasAnyPermission: (required: Permission[]) => hasAnyPermission(permissions, required),
      hasAllPermissions: (required: Permission[]) => hasAllPermissions(permissions, required),
    }),
    [auditEntries, currentUser, permissions, users]
  );

  return (
    <RbacSimulationContext.Provider value={value}>
      {children}
    </RbacSimulationContext.Provider>
  );
};

export const useRbacSimulation = () => {
  const context = useContext(RbacSimulationContext);

  if (!context) {
    throw new Error("useRbacSimulation must be used inside RbacSimulationProvider");
  }

  return context;
};

export const useCurrentRoleLabel = () => {
  const { currentUser } = useRbacSimulation();
  return currentUser.roles.map((role) => ROLE_DEFINITIONS[role].name).join(" · ");
};
