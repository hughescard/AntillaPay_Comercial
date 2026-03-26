'use client';

import { Building2 } from 'lucide-react';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { useRbacSimulation } from '@/common/context';

const capabilityLabels: Record<string, string> = {
  multi_user: 'Multiusuario',
  approval_policies: 'Políticas de aprobación',
  third_party_payments: 'Pagos a terceros',
  api_access: 'Acceso API',
};

const accountTypeLabels: Record<string, string> = {
  individual: 'Individual',
  enterprise: 'Enterprise',
  bank: 'Bank',
};

const statusLabels: Record<string, string> = {
  sandbox: 'Sandbox',
  live: 'Live',
};

export const AccountSummarySection = () => {
  const { account } = useRbacSimulation();

  return (
    <SurfaceCard className="p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-accent/10 p-2 text-accent">
          <Building2 size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Cuenta</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen del tipo de cuenta, entorno y capacidades habilitadas.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nombre</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{account.name}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo de cuenta</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{accountTypeLabels[account.accountType]}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{statusLabels[account.status]}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Creada</p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {new Date(account.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Capacidades</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {account.capabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-foreground"
            >
              {capabilityLabels[capability] ?? capability}
            </span>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
};
