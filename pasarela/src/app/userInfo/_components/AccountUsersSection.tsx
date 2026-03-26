'use client';

import { useMemo, useState } from 'react';
import { Pencil, Trash2, UserCircle2, UserPlus, Users } from 'lucide-react';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { CustomSelect } from '@/common/components/ui/CustomSelect';
import { ROLE_DEFINITIONS, type RoleId } from '@/lib/rbac';
import { useRbacSimulation } from '@/common/context';

export const AccountUsersSection = () => {
  const {
    users,
    currentUser,
    hasPermission,
    createUser,
    updateUser,
    deleteUser,
  } = useRbacSimulation();

  const canViewUsers = hasPermission('view_users');
  const canCreateUsers = hasPermission('create_user');
  const canUpdateUsers = hasPermission('update_user');
  const canDeleteUsers = hasPermission('delete_user');
  const canAssignRoles = hasPermission('assign_roles');
  const canManageUsers = canCreateUsers || canUpdateUsers || canDeleteUsers || canAssignRoles;

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftRoles, setDraftRoles] = useState<RoleId[]>([]);
  const [draftStatus, setDraftStatus] = useState<'active' | 'inactive'>('active');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roleOptions = useMemo(
    () => [
      { value: '', label: 'Selecciona un rol' },
      ...Object.values(ROLE_DEFINITIONS)
        .filter((role) => role.id !== 'owner')
        .map((role) => ({
          value: role.id,
          label: role.name,
        })),
    ],
    []
  );

  if (!canViewUsers) {
    return null;
  }

  const resetForm = () => {
    setEditingUserId(null);
    setDraftName('');
    setDraftEmail('');
    setDraftRoles([]);
    setDraftStatus('active');
  };

  const startEditing = (userId: string) => {
    const user = users.find((item) => item.id === userId);
    if (!user) return;
    setEditingUserId(user.id);
    setDraftName(user.name);
    setDraftEmail(user.email);
    setDraftRoles(user.roles.includes('owner') ? [] : user.roles);
    setDraftStatus(user.status);
    setError('');
    setSuccess('');
  };

  const submit = () => {
    try {
      if (!draftName.trim() || !draftEmail.trim() || draftRoles.length === 0) {
        throw new Error('Completa nombre, correo y al menos un rol.');
      }

      if (editingUserId) {
        updateUser(editingUserId, {
          name: draftName,
          email: draftEmail,
          roles: draftRoles,
          status: draftStatus,
        });
        setSuccess('Usuario actualizado.');
      } else {
        createUser({
          name: draftName,
          email: draftEmail,
          roles: draftRoles,
          status: draftStatus,
        });
        setSuccess('Usuario creado.');
      }

      setError('');
      resetForm();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'No pudimos guardar el usuario.'
      );
      setSuccess('');
    }
  };

  const remove = (userId: string) => {
    try {
      deleteUser(userId);
      setSuccess('Usuario eliminado.');
      setError('');
      if (editingUserId === userId) {
        resetForm();
      }
    } catch (deletionError) {
      setError(
        deletionError instanceof Error
          ? deletionError.message
          : 'No pudimos eliminar el usuario.'
      );
      setSuccess('');
    }
  };

  return (
    <SurfaceCard className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-accent/10 p-2 text-accent">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Usuarios de la cuenta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Owner y administrador pueden crear, editar y eliminar usuarios de esta cuenta.
            </p>
          </div>
        </div>
        <div className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-foreground">
          {canManageUsers ? 'Gestión habilitada' : 'Modo solo lectura'}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <div className={`mt-6 grid gap-6 ${canManageUsers ? 'xl:grid-cols-[minmax(0,1.2fr)_360px]' : ''}`}>
        <div className="space-y-4">
          {users.map((user) => {
            const isOwner = user.roles.includes('owner');
            const roleLabel = user.roles.map((role) => ROLE_DEFINITIONS[role].name).join(' · ');

            return (
              <div
                key={user.id}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent/10 p-2 text-accent">
                      <UserCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full border border-border bg-surface-muted px-2.5 py-1 font-medium text-foreground">
                          {roleLabel}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 font-medium ${user.status === 'active' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-amber-200 bg-amber-50 text-amber-700'}`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                        {user.id === currentUser.id ? (
                          <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-medium text-accent">
                            Usuario activo
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {canManageUsers && !isOwner ? (
                    <div className="flex items-center gap-2">
                      {canUpdateUsers ? (
                        <button
                          type="button"
                          onClick={() => startEditing(user.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                      ) : null}
                      {canDeleteUsers ? (
                        <button
                          type="button"
                          onClick={() => remove(user.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {canManageUsers ? (
          <SurfaceCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent/10 p-2 text-accent">
                <UserPlus size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {editingUserId ? 'Editar usuario' : 'Nuevo usuario'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Define el perfil del usuario dentro de la cuenta.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nombre</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Correo</label>
                <input
                  type="email"
                  value={draftEmail}
                  onChange={(event) => setDraftEmail(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  placeholder="usuario@antillapay.demo"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Rol</p>
                <CustomSelect
                  value={draftRoles}
                  onChange={(value) => setDraftRoles(value as RoleId[])}
                  options={roleOptions.filter((option) => option.value !== '')}
                  multiselect
                  className="rounded-lg"
                />
                {!canAssignRoles ? (
                  <p className="text-xs text-muted-foreground">
                    Tu perfil puede editar datos básicos, pero no reasignar roles.
                  </p>
                ) : null}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Estado</p>
                <CustomSelect
                  value={draftStatus}
                  onChange={(value) => setDraftStatus(value as 'active' | 'inactive')}
                  options={[
                    { value: 'active', label: 'Activo' },
                    { value: 'inactive', label: 'Inactivo' },
                  ]}
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={submit}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  <UserPlus size={16} />
                  {editingUserId ? 'Guardar cambios' : 'Agregar usuario'}
                </button>
                {editingUserId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
                  >
                    Cancelar edición
                  </button>
                ) : null}
              </div>
            </div>
          </SurfaceCard>
        ) : null}
      </div>
    </SurfaceCard>
  );
};
