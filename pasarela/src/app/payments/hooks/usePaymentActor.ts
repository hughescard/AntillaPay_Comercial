'use client';

import {
  getPermissionsForRoles,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  ROLE_DEFINITIONS,
  type Permission,
} from "@/lib/rbac";
import type { PaymentActor } from "../types";
import { useRbacSimulation } from "@/common/context";

export const usePaymentActor = () => {
  const { currentUser, users, switchUser } = useRbacSimulation();
  const actor: PaymentActor = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    roles: currentUser.roles,
  };
  const actors: PaymentActor[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    roles: user.roles,
  }));

  const permissions = getPermissionsForRoles(actor.roles);

  return {
    actor,
    actors,
    setActor: switchUser,
    permissions,
    roleDefinition: ROLE_DEFINITIONS[actor.role],
    hasPermission: (permission: Permission) => hasPermission(permissions, permission),
    hasAnyPermission: (required: Permission[]) => hasAnyPermission(permissions, required),
    hasAllPermissions: (required: Permission[]) => hasAllPermissions(permissions, required),
  };
};
