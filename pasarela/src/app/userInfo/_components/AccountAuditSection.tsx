'use client';

import { History } from 'lucide-react';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { useRbacSimulation } from '@/common/context';

export const AccountAuditSection = () => {
  const { auditEntries } = useRbacSimulation();

  return (
    <SurfaceCard className="p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-accent/10 p-2 text-accent">
          <History size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Auditoría de cuenta</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Registro de cambios en usuarios, roles y configuración operativa de la cuenta.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {auditEntries.length ? (
          auditEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{entry.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.actorName}
                    {entry.targetName ? ` · ${entry.targetName}` : ''}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface-muted/20 p-6">
            <p className="text-base font-semibold text-foreground">Sin eventos registrados</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cuando se creen usuarios o cambie la configuración de cuenta, aparecerá el historial aquí.
            </p>
          </div>
        )}
      </div>
    </SurfaceCard>
  );
};
