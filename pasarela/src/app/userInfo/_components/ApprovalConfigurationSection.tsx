'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Pencil, Plus, Trash2 } from 'lucide-react';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { useEnterprisePayments } from '@/app/payments/hooks/useEnterprisePayments';
import { usePaymentActor } from '@/app/payments/hooks/usePaymentActor';
import { CustomSelect } from '@/common/components/ui/CustomSelect';

const money = (minor: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100);

export const ApprovalConfigurationSection = () => {
  const { actor, actors, hasPermission } = usePaymentActor();
  const {
    approvalConfigurationEnabled,
    approvalRules,
    saveApprovalRule,
    removeApprovalRule,
    setApprovalConfiguration,
  } = useEnterprisePayments();
  const canManage = hasPermission('manage_account_configuration');
  const canToggleModule = actor.roles.includes('owner');
  const [draftThreshold, setDraftThreshold] = useState('');
  const [draftValidatorId, setDraftValidatorId] = useState('');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const checkerActors = useMemo(
    () => actors.filter((item) => item.roles.includes('checker')),
    [actors]
  );

  const usedValidatorIds = useMemo(
    () =>
      new Set(
        approvalRules
          .filter((rule) => rule.id !== editingRuleId)
          .flatMap((rule) => rule.validatorUserIds)
      ),
    [approvalRules, editingRuleId]
  );

  const validatorOptions = useMemo(
    () =>
      checkerActors.filter(
        (item) => item.roles.includes('checker') && !usedValidatorIds.has(item.id)
      ),
    [checkerActors, usedValidatorIds]
  );

  const resetForm = () => {
    setDraftThreshold('');
    setDraftValidatorId('');
    setEditingRuleId(null);
  };

  const startEditing = (ruleId: string) => {
    const rule = approvalRules.find((item) => item.id === ruleId);
    if (!rule) return;
    setEditingRuleId(rule.id);
    setDraftThreshold(String(rule.amountThresholdMinor / 100));
    setDraftValidatorId(rule.validatorUserIds[0] ?? '');
    setError('');
    setSuccess('');
  };

  const submitRule = () => {
    try {
      const amountThresholdMinor = Math.round(Number(draftThreshold || 0) * 100);
      saveApprovalRule(
        {
          amountThresholdMinor,
          validatorUserIds: draftValidatorId ? [draftValidatorId] : [],
        },
        actor,
        editingRuleId ?? undefined
      );
      setSuccess(editingRuleId ? 'Regla actualizada.' : 'Regla creada.');
      setError('');
      resetForm();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'No pudimos guardar la regla.'
      );
      setSuccess('');
    }
  };

  const onDelete = (ruleId: string) => {
    try {
      removeApprovalRule(ruleId, actor);
      setSuccess('Regla eliminada.');
      setError('');
      if (editingRuleId === ruleId) {
        resetForm();
      }
    } catch (deletionError) {
      setError(
        deletionError instanceof Error
          ? deletionError.message
          : 'No pudimos eliminar la regla.'
      );
      setSuccess('');
    }
  };

  const onToggleModule = (enabled: boolean) => {
    try {
      setApprovalConfiguration(enabled, actor);
      setSuccess(enabled ? 'Módulo de validadores activado.' : 'Módulo de validadores desactivado.');
      setError('');
      if (!enabled) {
        resetForm();
      }
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'No pudimos actualizar el estado del módulo.'
      );
      setSuccess('');
    }
  };

  return (
    <SurfaceCard className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-accent/10 p-2 text-accent">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Configuración de validadores</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Define qué validadores deben aprobar un pago según su umbral equivalente en USD.
            </p>
          </div>
        </div>
        {canToggleModule ? (
          <label className="flex items-center gap-3 rounded-full border border-border bg-surface-muted px-3 py-2 text-xs font-medium text-foreground">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={approvalConfigurationEnabled}
              onChange={(event) => onToggleModule(event.target.checked)}
            />
            <div className="relative h-5 w-9 rounded-full bg-surface-strong transition-colors after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-4" />
            <span>{approvalConfigurationEnabled ? 'Módulo activo' : 'Módulo desactivado'}</span>
          </label>
        ) : null}
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

      <div className={`mt-6 grid gap-6 ${canManage && approvalConfigurationEnabled ? 'xl:grid-cols-[minmax(0,1.2fr)_360px]' : ''}`}>
        <div className="space-y-4">
          {!approvalConfigurationEnabled ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface-muted/20 p-6">
              <p className="text-base font-semibold text-foreground">Módulo desactivado</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Se aplicará aprobación simple y las reglas configuradas quedarán en pausa hasta que el owner vuelva a activar este módulo.
              </p>
            </div>
          ) : null}

          {approvalRules.length ? (
            approvalRules.map((rule) => {
              const validatorNames = rule.validatorUserIds
                .map((userId) => checkerActors.find((actorItem) => actorItem.id === userId)?.name ?? userId)
                .join(', ');

              return (
                <div
                  key={rule.id}
                  className="rounded-2xl border border-border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Pagos superiores a {money(rule.amountThresholdMinor)} requieren aprobación de {validatorNames}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Regla acumulativa. Si un pago supera varios umbrales, debe completar todas las aprobaciones requeridas.
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Última actualización: {new Date(rule.lastUpdated).toLocaleString('es-ES')} · {rule.lastUpdatedByName}
                      </p>
                    </div>
                    {canManage && approvalConfigurationEnabled ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(rule.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(rule.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface-muted/20 p-6">
              <p className="text-base font-semibold text-foreground">Sin reglas configuradas</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Se aplicará aprobación simple: cualquier validador autorizado podrá aprobar el pago.
              </p>
            </div>
          )}
        </div>

        {canManage && approvalConfigurationEnabled ? (
          <SurfaceCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent/10 p-2 text-accent">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {editingRuleId ? 'Editar regla' : 'Nueva regla'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cada límite asigna un único revisor con rol checker.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Umbral en USD</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftThreshold}
                  onChange={(event) => setDraftThreshold(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  placeholder="100.00"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Checker asignado</p>
              <CustomSelect
                value={draftValidatorId}
                onChange={(value) => setDraftValidatorId(String(value))}
                options={[
                  { value: '', label: 'Selecciona un checker' },
                    ...validatorOptions.map((validator) => ({
                      value: validator.id,
                      label: `${validator.name} · ${validator.email}`,
                    })),
                ]}
                className="rounded-lg"
              />
              <p className="text-xs text-muted-foreground">
                Solo los usuarios con rol checker pueden configurarse como validadores y cada checker
                solo puede estar asignado a una regla.
              </p>
            </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={submitRule}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  <Plus size={16} />
                  {editingRuleId ? 'Guardar cambios' : 'Agregar regla'}
                </button>
                {editingRuleId ? (
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
