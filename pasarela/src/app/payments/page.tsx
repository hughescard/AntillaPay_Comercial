'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
} from 'lucide-react';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { CustomSelect } from '@/common/components/ui/CustomSelect';
import { useEnterprisePayments, DEFAULT_PAYMENT_FILTERS } from './hooks/useEnterprisePayments';
import { usePaymentActor } from './hooks/usePaymentActor';
import { PaymentStatusBadge } from './_components/PaymentStatusBadge';
import { hasPermissionForRole } from '@/lib/rbac';
import { paymentDetailsHref } from '@/lib/detailRoutes';

const money = (minor: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(minor / 100);

const getNextAction = (status: string, remainingApprovals = 0) => {
  switch (status) {
    case 'Draft':
      return 'Completar y enviar a aprobación';
    case 'Pending Approval':
      return remainingApprovals > 0
        ? `Faltan ${remainingApprovals} validaciones`
        : 'Revisión pendiente del validador';
    case 'Approved':
      return 'Esperando fecha de ejecución';
    case 'Processing':
      return 'Pago en ejecución';
    case 'Completed':
      return 'Liquidado correctamente';
    case 'Failed':
      return 'Revisar incidencia y reenviar';
    case 'Rejected':
      return 'Corregir observaciones';
    case 'Cancelled':
      return 'Sin acción';
    default:
      return 'Sin acción';
  }
};

export default function PaymentsListPage() {
  const { actor, actors, hasPermission } = usePaymentActor();
  const { listPayments, exportPayments, payments, summary } = useEnterprisePayments();
  const canViewPayments = hasPermission('view_third_party_payments');
  const canCreatePayment = hasPermission('create_third_party_payment');
  const canUpdatePayment = hasPermission('update_third_party_payment');
  const canExportPayments = hasPermission('export_third_party_payments');
  const [filters, setFilters] = useState(DEFAULT_PAYMENT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filtersUi, setFiltersUi] = useState({
    showStatus: false,
    showDate: false,
    showAmount: false,
    showCurrency: false,
    showCreatedBy: false,
    showReviewedBy: false,
  });

  const createdByOptions = useMemo(
    () => [
      { value: '', label: 'Todos los creadores' },
      ...actors
        .filter((item) => item.roles.includes('maker'))
        .map((item) => ({ value: item.id, label: item.name })),
    ],
    [actors]
  );

  const reviewedByOptions = useMemo(
    () => [
      { value: '', label: 'Todos los revisores' },
      ...actors
        .filter((item) => hasPermissionForRole(item.roles, 'approve_third_party_payment'))
        .map((item) => ({ value: item.id, label: item.name })),
    ],
    [actors]
  );

  const paymentList = listPayments(filters, page);
  const rows = paymentList.data;
  const readyForExecution = payments.filter(
    (payment) => payment.status === 'Approved' || payment.status === 'Processing'
  ).length;
  const needsAttention = payments.filter(
    (payment) => payment.status === 'Failed' || payment.status === 'Rejected'
  ).length;

  const toggleSelect = (paymentId: string) => {
    setSelectedIds((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const toggleSelectPage = () => {
    if (!rows.length) return;
    const pageIds = rows.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
  };

  if (!canViewPayments) {
    return (
      <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
        <Navbar />
        <div className="min-w-0 flex-1 min-h-0 flex flex-col">
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            <SurfaceCard className="mx-auto max-w-3xl p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">Acceso restringido</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Tu perfil no tiene permiso para consultar pagos a terceros.
              </p>
            </SurfaceCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
      <Navbar />
      <div className="min-w-0 flex-1 min-h-0 flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pagos a terceros</h1>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                  Trazabilidad completa de pagos desde saldo Antilla hacia cuentas bancarias externas, con control de creador y revisor, y ejecución programada.
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-3">
                <Link
                  href="/payments/create"
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
                    canCreatePayment
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'cursor-not-allowed border border-border bg-surface-muted text-muted-foreground pointer-events-none'
                  }`}
                >
                  <Plus size={18} />
                  Nuevo pago
                </Link>
                <div className="text-right text-xs text-muted-foreground">
                  {!canCreatePayment
                    ? 'Tu perfil no puede crear pagos.'
                    : 'Crea borradores o envía a aprobación.'}
                </div>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-3">
              <SurfaceCard className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pendientes de aprobación
                </p>
                <p className="mt-3 text-3xl font-bold text-foreground">{summary.pendingApproval}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pagos esperando acción del revisor.
                </p>
              </SurfaceCard>

              <SurfaceCard className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Listos para ejecución
                </p>
                <p className="mt-3 text-3xl font-bold text-foreground">{readyForExecution}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Pagos aprobados o en curso contra saldo disponible.
                  </p>
              </SurfaceCard>

              <SurfaceCard className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Requieren atención
                </p>
                <p className="mt-3 text-3xl font-bold text-foreground">{needsAttention}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pagos rechazados o con incidencia para corregir o cancelar.
                </p>
              </SurfaceCard>
            </div>

            <div className="max-w-full">
              <div className="flex flex-col gap-4">
                <label className="relative w-full max-w-lg">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={filters.query}
                    onChange={(event) => {
                      setPage(1);
                      setFilters((prev) => ({ ...prev, query: event.target.value }));
                    }}
                    placeholder="Buscar por ID, beneficiario, banco o referencia"
                    className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
                  />
                </label>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFiltersUi((prev) => ({ ...prev, showDate: !prev.showDate }))}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      filtersUi.showDate
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface text-foreground hover:bg-surface-muted'
                    }`}
                  >
                    <Plus size={14} className={`${filtersUi.showDate ? 'rotate-45' : ''} transition-all duration-300`} />
                    Fecha
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersUi((prev) => ({ ...prev, showStatus: !prev.showStatus }))}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      filtersUi.showStatus
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface text-foreground hover:bg-surface-muted'
                    }`}
                  >
                    <Plus size={14} className={`${filtersUi.showStatus ? 'rotate-45' : ''} transition-all duration-300`} />
                    Estado
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersUi((prev) => ({ ...prev, showAmount: !prev.showAmount }))}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      filtersUi.showAmount
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface text-foreground hover:bg-surface-muted'
                    }`}
                  >
                    <Plus size={14} className={`${filtersUi.showAmount ? 'rotate-45' : ''} transition-all duration-300`} />
                    Monto
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersUi((prev) => ({ ...prev, showCurrency: !prev.showCurrency }))}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      filtersUi.showCurrency
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface text-foreground hover:bg-surface-muted'
                    }`}
                  >
                    <Plus size={14} className={`${filtersUi.showCurrency ? 'rotate-45' : ''} transition-all duration-300`} />
                    Moneda
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersUi((prev) => ({ ...prev, showCreatedBy: !prev.showCreatedBy }))}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      filtersUi.showCreatedBy
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface text-foreground hover:bg-surface-muted'
                    }`}
                  >
                    <Plus size={14} className={`${filtersUi.showCreatedBy ? 'rotate-45' : ''} transition-all duration-300`} />
                    Creador
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersUi((prev) => ({ ...prev, showReviewedBy: !prev.showReviewedBy }))}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      filtersUi.showReviewedBy
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface text-foreground hover:bg-surface-muted'
                    }`}
                  >
                    <Plus size={14} className={`${filtersUi.showReviewedBy ? 'rotate-45' : ''} transition-all duration-300`} />
                    Revisor
                  </button>

                  {(filtersUi.showDate ||
                    filtersUi.showStatus ||
                    filtersUi.showAmount ||
                    filtersUi.showCurrency ||
                    filtersUi.showCreatedBy ||
                    filtersUi.showReviewedBy) ? (
                    <div className="mx-2 h-6 w-px bg-border" />
                  ) : null}

                  {filtersUi.showDate ? (
                    <CustomSelect
                      value={filters.dateRange}
                      onChange={(value) => {
                        setPage(1);
                        setFilters((prev) => ({ ...prev, dateRange: value as typeof prev.dateRange }));
                      }}
                      options={[
                        { value: '7d', label: 'Últimos 7 días' },
                        { value: '30d', label: 'Últimos 30 días' },
                        { value: '90d', label: 'Últimos 90 días' },
                        { value: 'all', label: 'Todo el histórico' },
                      ]}
                      className="rounded-full h-8 cursor-pointer py-1 text-xs"
                    />
                  ) : null}

                  {filtersUi.showStatus ? (
                    <CustomSelect
                      value={filters.status}
                      onChange={(value) => {
                        setPage(1);
                        setFilters((prev) => ({ ...prev, status: value as typeof prev.status }));
                      }}
                      options={[
                        { value: 'all', label: 'Todos los estados' },
                        { value: 'Draft', label: 'Borrador' },
                        { value: 'Pending Approval', label: 'Pendiente de aprobación' },
                        { value: 'Approved', label: 'Aprobado' },
                        { value: 'Processing', label: 'Procesando' },
                        { value: 'Completed', label: 'Completado' },
                        { value: 'Failed', label: 'Fallido' },
                        { value: 'Rejected', label: 'Rechazado' },
                        { value: 'Cancelled', label: 'Cancelado' },
                      ]}
                      className="rounded-full h-8 cursor-pointer py-1 text-xs"
                    />
                  ) : null}

                  {filtersUi.showAmount ? (
                    <>
                      <input
                        value={filters.minAmount}
                        onChange={(event) => {
                          setPage(1);
                          setFilters((prev) => ({ ...prev, minAmount: event.target.value }));
                        }}
                        placeholder="Monto mínimo"
                        className="h-8 min-w-[140px] rounded-full border border-border bg-surface px-4 text-xs text-foreground outline-none transition focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground"
                      />
                      <input
                        value={filters.maxAmount}
                        onChange={(event) => {
                          setPage(1);
                          setFilters((prev) => ({ ...prev, maxAmount: event.target.value }));
                        }}
                        placeholder="Monto máximo"
                        className="h-8 min-w-[140px] rounded-full border border-border bg-surface px-4 text-xs text-foreground outline-none transition focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground"
                      />
                    </>
                  ) : null}

                  {filtersUi.showCurrency ? (
                    <CustomSelect
                      value={filters.currency}
                      onChange={(value) => {
                        setPage(1);
                        setFilters((prev) => ({ ...prev, currency: value as typeof prev.currency }));
                      }}
                      options={[
                        { value: 'all', label: 'Todas las monedas' },
                        { value: 'USD', label: 'USD' },
                        { value: 'EUR', label: 'EUR' },
                      ]}
                      className="rounded-full h-8 cursor-pointer py-1 text-xs"
                    />
                  ) : null}

                  {filtersUi.showCreatedBy ? (
                    <CustomSelect
                      value={filters.createdBy}
                      onChange={(value) => {
                        setPage(1);
                        setFilters((prev) => ({ ...prev, createdBy: value as string }));
                      }}
                      options={[
                        { value: '', label: 'Todos los creadores' },
                        ...createdByOptions.filter((option) => option.value !== ''),
                      ]}
                      className="rounded-full h-8 cursor-pointer py-1 text-xs"
                    />
                  ) : null}

                  {filtersUi.showReviewedBy ? (
                    <CustomSelect
                      value={filters.reviewedBy}
                      onChange={(value) => {
                        setPage(1);
                        setFilters((prev) => ({ ...prev, reviewedBy: value as string }));
                      }}
                      options={reviewedByOptions}
                      className="rounded-full h-8 cursor-pointer py-1 text-xs"
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <SurfaceCard className="max-w-full overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Cola operativa de pagos</p>
                  <p className="text-sm text-muted-foreground">
                    Mostrando {paymentList.pagination.total} pagos a terceros. La selección masiva está disponible solo como simulación visual.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedIds.length > 0 ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground">
                      <CheckSquare size={14} />
                      {selectedIds.length} seleccionados · Acciones masivas próximamente
                    </div>
                  ) : null}
                  <button
                    onClick={() => canExportPayments && exportPayments(filters)}
                    disabled={!canExportPayments}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
              </div>

              {!payments.length ? (
                <div className="px-5 py-14 text-center">
                  <p className="text-lg font-semibold text-foreground">No hay pagos creados</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Empieza creando un pago corporativo y envíalo al flujo de creador y revisor.
                  </p>
                  {canCreatePayment ? (
                    <Link
                      href="/payments/create"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Plus size={16} />
                      Crear primer pago
                    </Link>
                  ) : null}
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[1200px] text-left text-sm">
                    <thead className="border-b border-border bg-surface-muted text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">
                          <input
                            type="checkbox"
                            checked={rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))}
                            onChange={toggleSelectPage}
                            className="h-4 w-4 rounded border-border"
                          />
                        </th>
                        <th className="px-5 py-3 font-medium">ID de pago</th>
                        <th className="px-5 py-3 font-medium">Beneficiario</th>
                        <th className="px-5 py-3 font-medium">Destino bancario</th>
                        <th className="px-5 py-3 font-medium">Ejecución</th>
                        <th className="px-5 py-3 font-medium">Importe</th>
                        <th className="px-5 py-3 font-medium">Estado</th>
                        <th className="px-5 py-3 font-medium">Siguiente acción</th>
                        <th className="px-5 py-3 font-medium">Creador</th>
                        <th className="px-5 py-3 font-medium">Última actualización</th>
                        <th className="px-5 py-3 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-white">
                      {rows.map((payment) => {
                        const canEdit =
                          canUpdatePayment &&
                          actor.id === payment.createdById &&
                          (payment.status === 'Draft' || payment.status === 'Rejected');
                        const remainingApprovals = Math.max(
                          0,
                          (payment.requiredApproverIds.length || 1) - payment.approvals.length
                        );

                        return (
                          <tr key={payment.id} className="hover:bg-surface-muted/30 transition-colors">
                            <td className="px-5 py-4">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(payment.id)}
                                onChange={() => toggleSelect(payment.id)}
                                className="h-4 w-4 rounded border-border"
                              />
                            </td>
                            <td className="px-5 py-4 font-semibold text-foreground">{payment.id}</td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{payment.beneficiaryName}</span>
                                <span className="text-muted-foreground">{payment.beneficiaryEmail}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{payment.bank}</span>
                                <span className="text-muted-foreground">{payment.country} · ****{payment.accountNumber.slice(-4)}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{payment.executionDate}</span>
                                <span className="text-muted-foreground">
                                  {payment.status === 'Approved' || payment.status === 'Processing'
                                    ? 'Listo para salida'
                                    : 'Programado'}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-lg font-semibold text-foreground">
                              {money(payment.amountMinor, payment.currency)}
                              <span className="ml-2 text-sm font-medium text-muted-foreground">{payment.currency}</span>
                            </td>
                            <td className="px-5 py-4">
                              <PaymentStatusBadge status={payment.status} />
                            </td>
                            <td className="px-5 py-4">
                              <div className="max-w-[190px]">
                                <p className="font-medium text-foreground">
                                  {getNextAction(payment.status, remainingApprovals)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {payment.status === 'Pending Approval'
                                    ? remainingApprovals > 0
                                      ? `${payment.approvals.length} de ${payment.requiredApproverIds.length || 1} aprobaciones registradas`
                                      : 'Esperando validación del revisor'
                                    : payment.status === 'Rejected'
                                      ? 'El creador debe ajustar y reenviar'
                                      : payment.status === 'Failed'
                                        ? 'Revisar soporte o volver a crear'
                                        : 'Seguimiento desde detalle'}
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="text-foreground">{payment.createdByName}</span>
                                <span className="text-xs uppercase tracking-wide text-muted-foreground">Creador</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-muted-foreground">
                              {new Date(payment.lastUpdated).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={paymentDetailsHref(payment.id)}
                                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted"
                                >
                                  <Eye size={14} />
                                  Ver
                                </Link>
                                {canEdit ? (
                                  <Link
                                    href={`/payments/create?paymentId=${payment.id}`}
                                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted"
                                  >
                                    <Pencil size={14} />
                                    Editar
                                  </Link>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex items-center justify-end gap-4 border-t border-border px-5 py-4">
                <span className="text-sm text-muted-foreground">
                  {paymentList.pagination.page} / {paymentList.pagination.pages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="rounded-md border border-border bg-white p-1.5 text-foreground disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(paymentList.pagination.pages, prev + 1))
                    }
                    disabled={page === paymentList.pagination.pages}
                    className="rounded-md border border-border bg-white p-1.5 text-foreground disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </div>
  );
}
