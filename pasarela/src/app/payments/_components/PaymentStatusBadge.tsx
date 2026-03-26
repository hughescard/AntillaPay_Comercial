'use client';

import type { PaymentStatus } from "../types";

const statusStyles: Record<PaymentStatus, string> = {
  "Draft": "border-slate-300 bg-slate-50 text-slate-700",
  "Pending Approval": "border-amber-300 bg-amber-50 text-amber-700",
  "Approved": "border-sky-300 bg-sky-50 text-sky-700",
  "Processing": "border-indigo-300 bg-indigo-50 text-indigo-700",
  "Completed": "border-green-300 bg-green-50 text-green-700",
  "Failed": "border-rose-300 bg-rose-50 text-rose-700",
  "Rejected": "border-red-300 bg-red-50 text-red-700",
  "Cancelled": "border-zinc-300 bg-zinc-50 text-zinc-700",
};

const statusLabels: Record<PaymentStatus, string> = {
  "Draft": "Borrador",
  "Pending Approval": "Pendiente",
  "Approved": "Aprobado",
  "Processing": "Procesando",
  "Completed": "Completado",
  "Failed": "Fallido",
  "Rejected": "Rechazado",
  "Cancelled": "Cancelado",
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => (
  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
    {statusLabels[status]}
  </span>
);
