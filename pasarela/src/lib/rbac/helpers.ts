import { ROLE_DEFINITIONS, type RoleId } from "./roles";
import type { Permission } from "./permissions";

export const getPermissionsForRoles = (roleIds: RoleId[]): Permission[] =>
  Array.from(
    new Set(
      roleIds.flatMap((roleId) => ROLE_DEFINITIONS[roleId].permissions as Permission[])
    )
  );

export const getPermissionsForRole = (
  roleId: RoleId,
  roleIds?: RoleId[]
): Permission[] =>
  roleIds?.length ? getPermissionsForRoles(roleIds) : [...ROLE_DEFINITIONS[roleId].permissions];

export const hasPermissionForRole = (
  roleId: RoleId | RoleId[],
  permission: Permission
) =>
  Array.isArray(roleId)
    ? getPermissionsForRoles(roleId).includes(permission)
    : (ROLE_DEFINITIONS[roleId].permissions as Permission[]).includes(permission);

export const hasAnyPermissionForRole = (
  roleId: RoleId | RoleId[],
  permissions: Permission[]
) => permissions.some((permission) => hasPermissionForRole(roleId, permission));

export const hasAllPermissionsForRole = (
  roleId: RoleId | RoleId[],
  permissions: Permission[]
) => permissions.every((permission) => hasPermissionForRole(roleId, permission));

export const hasPermission = (
  permissions: Permission[],
  permission: Permission
) => permissions.includes(permission);

export const hasAnyPermission = (
  permissions: Permission[],
  required: Permission[]
) => required.some((permission) => permissions.includes(permission));

export const hasAllPermissions = (
  permissions: Permission[],
  required: Permission[]
) => required.every((permission) => permissions.includes(permission));
