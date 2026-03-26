import { PERMISSION_DEFINITIONS, type PermissionModule } from "./permissions";
import { ROLE_LIST, type RoleId } from "./roles";

export type PermissionRecord = {
  id: string;
  code: string;
  module: PermissionModule;
  description: string;
  isSystem: boolean;
};

export type RoleRecord = {
  id: RoleId;
  name: string;
  description: string;
  isSystem: boolean;
};

export type RolePermissionRecord = {
  roleId: RoleId;
  permissionId: string;
};

export type UserRoleRecord = {
  userId: string;
  accountId: string;
  roleId: RoleId;
  assignedByUserId?: string;
};

export const PERMISSION_RECORDS: PermissionRecord[] = PERMISSION_DEFINITIONS.map(
  (permission) => ({
    id: permission.code,
    code: permission.code,
    module: permission.module,
    description: permission.description,
    isSystem: true,
  })
);

export const ROLE_RECORDS: RoleRecord[] = ROLE_LIST.map((role) => ({
  id: role.id,
  name: role.name,
  description: role.description,
  isSystem: true,
}));

export const ROLE_PERMISSION_RECORDS: RolePermissionRecord[] = ROLE_LIST.flatMap(
  (role) =>
    role.permissions.map((permission) => ({
      roleId: role.id,
      permissionId: permission,
    }))
);

export const RBAC_SCHEMA_TABLES = [
  "permissions",
  "roles",
  "role_permissions",
  "user_roles",
] as const;
