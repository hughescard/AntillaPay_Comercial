'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, CheckCircle2, Pencil, ShieldAlert, XCircle } from 'lucide-react';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { PrincipalModal } from '@/common/components/ui/PrincipalModal';
import { useEnterprisePayments } from '../hooks/useEnterprisePayments';
import { usePaymentActor } from '../hooks/usePaymentActor';
import { PaymentStatusBadge } from '../_components/PaymentStatusBadge';

const money = (minor: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);

export default function PaymentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { actor, actors, hasPermission } = usePaymentActor();
  const { getPayment, approve, reject, cancel, execute } = useEnterprisePayments();
  const paymentId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const payment = paymentId ? getPayment(paymentId) : null;

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState('');
  const canViewDetails = hasPermission('view_third_party_payment_details');
  const canViewAudit = hasPermission('view_third_party_payment_audit');
  const canApprovePermission = hasPermission('approve_third_party_payment');
  const canRejectPermission = hasPermission('reject_third_party_payment');
  const canCancelPermission = hasPermission('cancel_third_party_payment');
  const canUpdatePermission = hasPermission('update_third_party_payment');
  const canExecutePermission = hasPermission('execute_third_party_payment');
  const requiredApproverActors = payment
    ? payment.requiredApproverIds.map((userId) => actors.find((actorItem) => actorItem.id === userId)).filter(Boolean)
    : [];
  const approvedActors = payment
    ? payment.approvals.map((userId) => actors.find((actorItem) => actorItem.id === userId)).filter(Boolean)
    : [];
  const pendingApproverActors = payment
    ? payment.requiredApproverIds
        .filter((userId) => !payment.approvals.includes(userId))
        .map((userId) => actors.find((actorItem) => actorItem.id === userId))
        .filter(Boolean)
    : [];
  const isAssignedValidator =
    payment &&
    (payment.requiredApproverIds.length === 0 || payment.requiredApproverIds.includes(actor.id));

  const canCheckerApprove =
    payment &&
    payment.status === 'Pending Approval' &&
    canApprovePermission &&
    actor.id !== payment.createdById &&
    isAssignedValidator &&
    !payment.approvals.includes(actor.id);

  const isSelfApprovalAttempt =
    payment &&
    payment.status === 'Pending Approval' &&
      canApprovePermission &&
      actor.id === payment.createdById;
  const isApprovalBlockedByAssignment =
    payment &&
    payment.status === 'Pending Approval' &&
    canApprovePermission &&
    actor.id !== payment.createdById &&
    !isAssignedValidator &&
    payment.requiredApproverIds.length > 0;

  const canMakerEdit =
    payment &&
    canUpdatePermission &&
    actor.id === payment.createdById &&
    (payment.status === 'Draft' || payment.status === 'Rejected');
  const canExecutePayment =
    payment &&
    payment.status === 'Approved' &&
    canExecutePermission;
  const paymentStatus = payment?.status ?? '';
  const showProcessingCard =
    canExecutePermission || ['Approved', 'Processing', 'Completed', 'Failed'].includes(paymentStatus);

  if (!payment) {
    return (
      <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
        <Navbar />
        <div className="w-full min-w-0 min-h-0 flex flex-col">
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            <SurfaceCard className="mx-auto max-w-3xl p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">Pago no encontrado</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                El pago solicitado no existe o fue removido del workspace local.
              </p>
              <Link
                href="/payments"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                <ArrowLeft size={16} />
                Volver a pagos
              </Link>
            </SurfaceCard>
          </div>
        </div>
      </div>
    );
  }

  if (!canViewDetails) {
    return (
      <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
        <Navbar />
        <div className="w-full min-w-0 min-h-0 flex flex-col">
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            <SurfaceCard className="mx-auto max-w-3xl p-8 text-center">
              <ShieldAlert className="mx-auto mb-4 text-amber-600" size={28} />
              <h1 className="text-2xl font-bold text-foreground">Acceso restringido</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Tu perfil no tiene permiso para ver el detalle de pagos a terceros.
              </p>
              <Link
                href="/payments"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                <ArrowLeft size={16} />
                Volver a pagos
              </Link>
            </SurfaceCard>
          </div>
        </div>
      </div>
    );
  }

  const onApprove = () => {
    const result = approve(payment.id, actor);
    if (!result.success) {
      setActionError(result.message ?? 'No pudimos aprobar el pago.');
      setApproveOpen(false);
      return;
    }
    setApproveOpen(false);
    router.refresh();
  };

  const onReject = () => {
    const result = reject(payment.id, actor, rejectReason.trim() || 'Rechazado por revisor.');
    if (!result.success) {
      setActionError(result.message ?? 'No pudimos rechazar el pago.');
      setRejectOpen(false);
      return;
    }
    setRejectOpen(false);
    setRejectReason('');
    router.refresh();
  };

  const onCancel = () => {
    const result = cancel(payment.id, actor);
    if (!result.success) {
      setActionError(result.message ?? 'No pudimos cancelar el pago.');
      setCancelOpen(false);
      return;
    }
    setCancelOpen(false);
    router.refresh();
  };

  const onExecute = () => {
    const result = execute(payment.id, actor);
    if (!result.success) {
      setActionError(result.message ?? 'No pudimos ejecutar el pago.');
      return;
    }
    router.refresh();
  };

  return (
    <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
      <Navbar />
      <div className="w-full min-w-0 min-h-0 flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <Link
                  href="/payments"
                  className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft size={16} />
                  Volver a pagos
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{payment.id}</h1>
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {payment.description || 'Pago corporativo con control de creador y revisor, y trazabilidad completa.'}
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-3 lg:min-w-[340px]">
                <div className="flex flex-wrap gap-2">
                  {canMakerEdit ? (
                    <>
                      <Link
                        href={`/payments/create?paymentId=${payment.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
                      >
                        <Pencil size={16} />
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setCancelOpen(true)}
                        disabled={!canCancelPermission}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-danger"
                      >
                        <XCircle size={16} />
                        Cancelar
                      </button>
                      <Link
                        href={`/payments/create?paymentId=${payment.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                      >
                        <CheckCircle2 size={16} />
                        Editar y reenviar
                      </Link>
                    </>
                  ) : null}

                </div>
              </div>
            </div>

            {actionError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {actionError}
              </div>
            ) : null}

            {isSelfApprovalAttempt ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                El creador no puede aprobar su propio pago. Cambia a un perfil revisor para continuar la simulación.
              </div>
            ) : null}

            {payment.failureReason ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Incidencia de ejecución: {payment.failureReason}
              </div>
            ) : null}

            {isApprovalBlockedByAssignment ? (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                Este pago requiere validación de {pendingApproverActors.map((item) => item?.name).join(', ')}.
              </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
              <div className="space-y-6">
                <SurfaceCard className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Importe del pago
                  </p>
                  <div className="mt-3 flex flex-wrap items-end gap-4">
                    <p className="text-4xl font-bold text-foreground">
                      {money(payment.amountMinor, payment.currency)}
                    </p>
                    <div className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      Comisión {money(payment.estimatedFeeMinor, payment.currency)}
                    </div>
                  </div>
                </SurfaceCard>

                <div className="grid gap-6 lg:grid-cols-2">
                  <SectionCard
                    title="Beneficiario"
                    rows={[
                      ['Nombre', payment.beneficiaryName],
                      ['Correo', payment.beneficiaryEmail],
                      ['País', payment.country],
                    ]}
                  />
                  <SectionCard
                    title="Datos bancarios"
                    rows={[
                      ['Banco', payment.bank],
                      ['Número de cuenta', `****${payment.accountNumber.slice(-4)}`],
                      ['Tipo de cuenta', payment.accountType === 'Checking' ? 'Corriente' : 'Ahorro'],
                      ['SWIFT / IBAN', payment.swiftIban],
                    ]}
                  />
                  <SectionCard
                    title="Detalles del pago"
                    rows={[
                      ['Referencia', payment.reference],
                      ['Número de factura', payment.invoiceNumber || '—'],
                      ['Fecha de ejecución', payment.executionDate],
                      ['Creado por', payment.createdByName],
                      ['Última actualización', new Date(payment.lastUpdated).toLocaleString('es-ES')],
                    ]}
                  />
                  <SurfaceCard className="p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-foreground">Adjuntos</h2>
                      <span className="text-sm text-muted-foreground">
                        {payment.attachments.length} archivos
                      </span>
                    </div>
                    {payment.attachments.length ? (
                      <div className="mt-4 space-y-3">
                        {payment.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                          >
                            <div>
                              <p className="font-medium text-foreground">{attachment.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {attachment.mimeType} · {attachment.sizeLabel}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(attachment.uploadedAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                        No se subieron adjuntos para este pago.
                      </div>
                    )}
                  </SurfaceCard>
                  {showProcessingCard ? (
                    <SectionCard
                      title="Procesamiento"
                      rows={[
                        ['Enrutamiento', 'Automático por AntillaPay'],
                        ['Comisión estimada', money(payment.estimatedFeeMinor, payment.currency)],
                        ['Tiempo estimado', payment.estimatedDelivery],
                      ]}
                    />
                  ) : null}
                </div>
              </div>

              <div className="space-y-6">
                <SurfaceCard className="p-5">
                  <h2 className="text-base font-semibold text-foreground">Validadores y aprobaciones</h2>
                  {payment.requiredApproverIds.length ? (
                    <>
                      <div className="mt-4 space-y-3">
                        {requiredApproverActors.map((validator) => (
                          <div key={validator?.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
                            <div>
                              <p className="font-medium text-foreground">{validator?.name}</p>
                              <p className="text-xs text-muted-foreground">{validator?.email}</p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                payment.approvals.includes(String(validator?.id))
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {payment.approvals.includes(String(validator?.id)) ? 'Aprobó' : 'Pendiente'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        {pendingApproverActors.length
                          ? `Falta${pendingApproverActors.length > 1 ? 'n' : ''} ${pendingApproverActors.length} aprobación${pendingApproverActors.length > 1 ? 'es' : ''}.`
                          : 'Todas las aprobaciones requeridas se completaron.'}
                      </p>
                    </>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
                      Configuración sin reglas activas. Este pago sigue el fallback de aprobación simple por cualquier validador autorizado.
                    </div>
                  )}
                </SurfaceCard>

                {canViewAudit ? (
                  <SurfaceCard className="p-5">
                    <h2 className="text-base font-semibold text-foreground">Trazabilidad</h2>
                    <div className="mt-5 space-y-4">
                      {payment.timeline.map((item, index) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span
                              className={`h-3 w-3 rounded-full ${
                                item.tone === 'success'
                                  ? 'bg-green-500'
                                  : item.tone === 'warning'
                                    ? 'bg-amber-500'
                                    : item.tone === 'danger'
                                      ? 'bg-red-500'
                                      : 'bg-slate-400'
                              }`}
                            />
                            {index !== payment.timeline.length - 1 ? (
                              <span className="mt-1 h-full w-px bg-border" />
                            ) : null}
                          </div>
                          <div className="pb-4">
                            <p className="font-medium text-foreground">{item.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.userName} · {new Date(item.timestamp).toLocaleString('es-ES')}
                            </p>
                            {item.note ? (
                              <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SurfaceCard>
                ) : null}
              </div>
            </div>

            {payment.status === 'Pending Approval' ? (
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setRejectOpen(true)}
                  disabled={!canCheckerApprove || !canRejectPermission}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                    canCheckerApprove && canRejectPermission
                      ? 'bg-red-600 text-white'
                      : 'cursor-not-allowed border border-border bg-surface-muted text-muted-foreground'
                  }`}
                >
                  <XCircle size={16} />
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => setApproveOpen(true)}
                  disabled={!canCheckerApprove}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                    canCheckerApprove
                      ? 'bg-green-600 text-white'
                      : 'cursor-not-allowed border border-border bg-surface-muted text-muted-foreground'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  Aprobar
                </button>
              </div>
            ) : null}

            {canExecutePayment ? (
              <div className="flex justify-start border-t border-border pt-4">
                <button
                  type="button"
                  onClick={onExecute}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                <CheckCircle2 size={16} />
                  Ejecutar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={approveOpen}
        onClose={() => setApproveOpen(false)}
        title="Aprobar pago"
        body={
          payment.requiredApproverIds.length
            ? `Solo un validador asignado puede aprobar este pago. Tras esta acción ${pendingApproverActors.length > 1 ? 'seguirán faltando validaciones' : 'quedará aprobado por completo o pasará a la siguiente validación pendiente'}.`
            : 'Este pago está en modo de aprobación simple. Cualquier validador autorizado puede aprobarlo.'
        }
        confirmLabel="Aprobar"
        confirmTone="success"
        onConfirm={onApprove}
      />

      <PrincipalModal isOpen={rejectOpen} onClose={() => setRejectOpen(false)} className="w-full max-w-xl">
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground">Rechazar pago</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Los pagos rechazados pueden ser editados o cancelados por el creador. Añade un motivo para la trazabilidad.
          </p>
          <textarea
            rows={5}
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none"
            placeholder="Explica por qué se está rechazando este pago..."
          />
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setRejectOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={onReject}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Rechazar
            </button>
          </div>
        </div>
      </PrincipalModal>

      <ConfirmModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancelar pago"
        body="Esto cancelará la solicitud de pago y quedará registrada como cancelada en la trazabilidad."
        confirmLabel="Cancelar pago"
        confirmTone="danger"
        onConfirm={onCancel}
      />
    </div>
  );
}

const SectionCard = ({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) => (
  <SurfaceCard className="p-5">
    <h2 className="text-base font-semibold text-foreground">{title}</h2>
    <div className="mt-4 space-y-3">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-4">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-right text-sm font-medium text-foreground">{value}</span>
        </div>
      ))}
    </div>
  </SurfaceCard>
);

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel,
  confirmTone,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  confirmLabel: string;
  confirmTone: 'success' | 'danger';
  onConfirm: () => void;
}) => (
  <PrincipalModal isOpen={isOpen} onClose={onClose} className="w-full max-w-xl">
    <div className="p-6">
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
            confirmTone === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </PrincipalModal>
);
