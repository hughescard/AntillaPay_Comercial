import type {
  ApprovalRule,
  Beneficiary,
  EnterprisePayment,
  PaymentActor,
  PaymentAttachment,
  PaymentDraftInput,
  PaymentFilters,
  PaymentsWorkspace,
  PaymentStatus,
  ProcessorOption,
} from "../types";
import {
  appendAccountAuditEntry,
  getMockUserById,
  hasPermissionForRole,
  loadMockRbacUsers,
  MOCK_RBAC_USERS,
  type MockRbacUser,
  type Permission,
} from "@/lib/rbac";

const WORKSPACE_KEY = "pasarela_enterprise_payments_v5";
const PROCESSING_SETTLEMENT_DELAY_MS = 5_000;

const nowIso = () => new Date().toISOString();

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const hoursAgo = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

const cents = (value: number) => Math.round(value * 100);
const money = (minor: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);
const usdEquivalentMinor = (valueMinor: number, currency: "USD" | "EUR") =>
  currency === "EUR" ? Math.round(valueMinor * 1.08) : valueMinor;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const makeId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const toPaymentActor = (user: MockRbacUser): PaymentActor => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  roles: user.roles,
});

export const getPaymentActors = (): PaymentActor[] =>
  loadMockRbacUsers().map(toPaymentActor);

export const PROCESSOR_OPTIONS: ProcessorOption[] = [
  {
    id: "tropipay",
    name: "TropiPay",
    estimatedFeeMinor: cents(18.5),
    estimatedDelivery: "Mismo día",
    description: "Mejor cobertura para pagos regionales y validación rápida.",
  },
  {
    id: "b89",
    name: "B89",
    estimatedFeeMinor: cents(24),
    estimatedDelivery: "24 horas",
    description: "Buen balance entre costo, velocidad y trazabilidad bancaria.",
  },
  {
    id: "ducapp",
    name: "DucApp",
    estimatedFeeMinor: cents(9.75),
    estimatedDelivery: "2 a 4 horas",
    description: "Riel optimizado para pagos locales con alta disponibilidad.",
  },
];

const seedBeneficiaries = (): Beneficiary[] => [
  {
    id: "benef-1",
    name: "Mar Azul Hospitality Ltd.",
    email: "treasury@marazul.demo",
    country: "Reino Unido",
    bank: "HSBC",
    accountNumber: "GB33HSBC20201577889911",
    accountType: "Checking",
    swiftIban: "MIDLGB22",
  },
  {
    id: "benef-2",
    name: "Citric Foods Europe SL",
    email: "finance@citricfoods.demo",
    country: "España",
    bank: "Citibank",
    accountNumber: "ES7921000813610123456789",
    accountType: "Checking",
    swiftIban: "CITIESMX",
  },
  {
    id: "benef-3",
    name: "Distribuidora Andina SA",
    email: "pagos@andina.demo",
    country: "México",
    bank: "Santander",
    accountNumber: "MX450140123456789012",
    accountType: "Savings",
    swiftIban: "BMSXMXMM",
  },
];

const makeAttachment = (
  id: string,
  name: string,
  mimeType: string,
  sizeLabel: string,
  uploadedAt: string
): PaymentAttachment => ({
  id,
  name,
  mimeType,
  sizeLabel,
  uploadedAt,
});

const timelineItem = (
  action: string,
  actor: PaymentActor,
  timestamp: string,
  note?: string,
  tone: "default" | "success" | "warning" | "danger" = "default"
) => ({
  id: makeId("timeline"),
  action,
  userId: actor.id,
  userName: actor.name,
  timestamp,
  note,
  tone,
});

const actorById = (id: string): PaymentActor => {
  const user = getMockUserById(id, loadMockRbacUsers());
  if (user?.id === id) {
    return toPaymentActor(user);
  }

  const fallback = loadMockRbacUsers()[0] ?? MOCK_RBAC_USERS[0];
  return fallback ? toPaymentActor(fallback) : SYSTEM_EXECUTOR;
};

const SYSTEM_EXECUTOR: PaymentActor = {
  id: "system-executor",
  name: "Orquestador AntillaPay",
  email: "orchestrator@antillapay.demo",
  role: "operations",
  roles: ["operations"],
};

const buildPayment = (
  input: PaymentDraftInput & {
    id: string;
    status: PaymentStatus;
    requiredApproverIds: string[];
    approvals: string[];
    createdById: string;
    createdByName: string;
    lastUpdated: string;
    lastUpdatedByName: string;
    rejectionReason?: string;
    failureReason?: string;
    submittedAt?: string;
    approvedAt?: string;
    processingStartedAt?: string;
    completedAt?: string;
    timeline: EnterprisePayment["timeline"];
  }
): EnterprisePayment => ({
  ...input,
});

export const getEligibleApprovalActors = () =>
  getPaymentActors().filter((actor) =>
    hasPermissionForRole(actor.roles, "approve_third_party_payment")
  );

export const getSortedApprovalRules = (rules: ApprovalRule[]) =>
  [...rules].sort((left, right) => left.amountThresholdMinor - right.amountThresholdMinor);

const seedPayments = (beneficiaries: Beneficiary[]): EnterprisePayment[] => {
  const maker = actorById("user-maker");
  const checker = actorById("user-checker");
  const operations = actorById("user-operations");

  const baseCreated = hoursAgo(36);
  const secondCreated = daysAgo(3);
  const thirdCreated = daysAgo(5);

  return [
    buildPayment({
      id: "PAY-240325-001",
      beneficiaryId: beneficiaries[0].id,
      beneficiaryName: beneficiaries[0].name,
      beneficiaryEmail: beneficiaries[0].email,
      bank: beneficiaries[0].bank,
      country: beneficiaries[0].country,
      accountNumber: beneficiaries[0].accountNumber,
      accountType: beneficiaries[0].accountType,
      swiftIban: beneficiaries[0].swiftIban,
      amountMinor: cents(2450),
      currency: "USD",
      description: "Liquidación semanal de reservas corporativas.",
      reference: "RESERVAS-MARAZUL-0325",
      invoiceNumber: "INV-88452",
      executionDate: daysFromNow(2),
      processor: "tropipay",
      estimatedFeeMinor: cents(18.5),
      estimatedDelivery: "Mismo día",
      attachments: [
        makeAttachment("att-1", "invoice-marazul.pdf", "application/pdf", "248 KB", baseCreated),
      ],
      status: "Draft",
      requiredApproverIds: [],
      approvals: [],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: hoursAgo(4),
      lastUpdatedByName: maker.name,
      timeline: [
        timelineItem("Pago creado en borrador", maker, baseCreated),
        timelineItem("Datos del pago editados", maker, hoursAgo(4), "Se actualizó la fecha de ejecución y la referencia."),
      ],
    }),
    buildPayment({
      id: "PAY-240325-002",
      beneficiaryId: beneficiaries[1].id,
      beneficiaryName: beneficiaries[1].name,
      beneficiaryEmail: beneficiaries[1].email,
      bank: beneficiaries[1].bank,
      country: beneficiaries[1].country,
      accountNumber: beneficiaries[1].accountNumber,
      accountType: beneficiaries[1].accountType,
      swiftIban: beneficiaries[1].swiftIban,
      amountMinor: cents(12000),
      currency: "EUR",
      description: "Pago de abastecimiento trimestral de inventario.",
      reference: "EU-SUPPLY-Q1-2026",
      invoiceNumber: "INV-12019",
      executionDate: daysFromNow(1),
      processor: "b89",
      estimatedFeeMinor: cents(24),
      estimatedDelivery: "24 horas",
      attachments: [
        makeAttachment("att-2", "supply-contract.pdf", "application/pdf", "620 KB", secondCreated),
        makeAttachment("att-3", "goods-receipt.png", "image/png", "410 KB", secondCreated),
      ],
      status: "Pending Approval",
      requiredApproverIds: [],
      approvals: [],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: hoursAgo(2),
      lastUpdatedByName: maker.name,
      submittedAt: hoursAgo(2),
      timeline: [
        timelineItem("Pago creado en borrador", maker, secondCreated),
        timelineItem("Datos del pago editados", maker, daysAgo(2), "Se actualizaron el importe y el número de factura."),
        timelineItem("Enviado a aprobación", maker, hoursAgo(2), "Enviado a la cola de revisión financiera.", "warning"),
      ],
    }),
    buildPayment({
      id: "PAY-240325-003",
      beneficiaryId: beneficiaries[2].id,
      beneficiaryName: beneficiaries[2].name,
      beneficiaryEmail: beneficiaries[2].email,
      bank: beneficiaries[2].bank,
      country: beneficiaries[2].country,
      accountNumber: beneficiaries[2].accountNumber,
      accountType: beneficiaries[2].accountType,
      swiftIban: beneficiaries[2].swiftIban,
      amountMinor: cents(7250),
      currency: "USD",
      description: "Pago de logística regional con ejecución programada.",
      reference: "LOG-ROUTE-7250",
      invoiceNumber: "INV-99201",
      executionDate: daysFromNow(4),
      processor: "tropipay",
      estimatedFeeMinor: cents(18.5),
      estimatedDelivery: "Mismo día",
      attachments: [
        makeAttachment("att-4", "route-settlement.pdf", "application/pdf", "312 KB", thirdCreated),
      ],
      status: "Approved",
      requiredApproverIds: [],
      approvals: [checker.id],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: daysAgo(1),
      lastUpdatedByName: checker.name,
      submittedAt: daysAgo(2),
      approvedAt: daysAgo(1),
      timeline: [
        timelineItem("Pago creado en borrador", maker, thirdCreated),
        timelineItem("Enviado a aprobación", maker, daysAgo(2), "Requiere liberación el mismo día.", "warning"),
        timelineItem("Aprobado por validador", checker, daysAgo(1), "Aprobación completa. Listo para ejecución en la fecha programada.", "success"),
      ],
    }),
    buildPayment({
      id: "PAY-240325-004",
      beneficiaryId: beneficiaries[0].id,
      beneficiaryName: beneficiaries[0].name,
      beneficiaryEmail: beneficiaries[0].email,
      bank: beneficiaries[0].bank,
      country: beneficiaries[0].country,
      accountNumber: beneficiaries[0].accountNumber,
      accountType: beneficiaries[0].accountType,
      swiftIban: beneficiaries[0].swiftIban,
      amountMinor: cents(1850),
      currency: "USD",
      description: "Payout operativo para reservas liquidadas hoy.",
      reference: "OPS-MARAZUL-1850",
      invoiceNumber: "INV-23018",
      executionDate: new Date().toISOString().split("T")[0],
      processor: "ducapp",
      estimatedFeeMinor: cents(9.75),
      estimatedDelivery: "2 a 4 horas",
      attachments: [],
      status: "Processing",
      requiredApproverIds: [],
      approvals: [checker.id],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: hoursAgo(1),
      lastUpdatedByName: operations.name,
      submittedAt: hoursAgo(8),
      approvedAt: hoursAgo(2),
      processingStartedAt: hoursAgo(1),
      timeline: [
        timelineItem("Pago creado en borrador", maker, hoursAgo(10)),
        timelineItem("Enviado a aprobación", maker, hoursAgo(8), "Programado para ejecución el mismo día.", "warning"),
        timelineItem("Aprobado por validador", checker, hoursAgo(2), "Aprobación completa. Listo para ejecución.", "success"),
        timelineItem("Enviado a ejecución", operations, hoursAgo(1), "Enrutado automáticamente por AntillaPay.", "warning"),
      ],
    }),
    buildPayment({
      id: "PAY-240325-005",
      beneficiaryId: beneficiaries[1].id,
      beneficiaryName: beneficiaries[1].name,
      beneficiaryEmail: beneficiaries[1].email,
      bank: beneficiaries[1].bank,
      country: beneficiaries[1].country,
      accountNumber: beneficiaries[1].accountNumber,
      accountType: beneficiaries[1].accountType,
      swiftIban: beneficiaries[1].swiftIban,
      amountMinor: cents(3400),
      currency: "EUR",
      description: "Pago consolidado de servicios profesionales.",
      reference: "CONS-EU-3400",
      invoiceNumber: "INV-33048",
      executionDate: daysAgo(1).split("T")[0],
      processor: "b89",
      estimatedFeeMinor: cents(24),
      estimatedDelivery: "24 horas",
      attachments: [
        makeAttachment("att-5", "consulting-statement.jpg", "image/jpeg", "180 KB", daysAgo(3)),
      ],
      status: "Completed",
      requiredApproverIds: [],
      approvals: [checker.id],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: hoursAgo(14),
      lastUpdatedByName: operations.name,
      submittedAt: daysAgo(2),
      approvedAt: daysAgo(1),
      completedAt: hoursAgo(14),
      timeline: [
        timelineItem("Pago creado en borrador", maker, daysAgo(3)),
        timelineItem("Enviado a aprobación", maker, daysAgo(2), undefined, "warning"),
        timelineItem("Aprobado por validador", checker, daysAgo(1), "Aprobación completa. Listo para ejecución.", "success"),
        timelineItem("Enviado a ejecución", operations, hoursAgo(18), "Enrutado automáticamente por AntillaPay.", "warning"),
        timelineItem("Completado", operations, hoursAgo(14), "Fondos entregados correctamente.", "success"),
      ],
    }),
    buildPayment({
      id: "PAY-240325-006",
      beneficiaryId: beneficiaries[2].id,
      beneficiaryName: beneficiaries[2].name,
      beneficiaryEmail: beneficiaries[2].email,
      bank: beneficiaries[2].bank,
      country: beneficiaries[2].country,
      accountNumber: beneficiaries[2].accountNumber,
      accountType: beneficiaries[2].accountType,
      swiftIban: beneficiaries[2].swiftIban,
      amountMinor: cents(9650),
      currency: "USD",
      description: "Pago excepcional con validación manual del proveedor.",
      reference: "MANUAL-FAIL-9650",
      invoiceNumber: "INV-77819",
      executionDate: daysAgo(1).split("T")[0],
      processor: "ducapp",
      estimatedFeeMinor: cents(9.75),
      estimatedDelivery: "2 a 4 horas",
      attachments: [],
      status: "Failed",
      requiredApproverIds: [],
      approvals: [checker.id],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: hoursAgo(9),
      lastUpdatedByName: operations.name,
      submittedAt: daysAgo(2),
      approvedAt: hoursAgo(12),
      failureReason: "La ejecución falló por una inconsistencia en la validación del beneficiario.",
      timeline: [
        timelineItem("Pago creado en borrador", maker, daysAgo(4)),
        timelineItem("Enviado a aprobación", maker, daysAgo(2), undefined, "warning"),
        timelineItem("Aprobado por validador", checker, hoursAgo(12), "Aprobación completa. Listo para ejecución.", "success"),
        timelineItem("Enviado a ejecución", operations, hoursAgo(11), "Enrutado automáticamente por AntillaPay.", "warning"),
        timelineItem("Fallido", operations, hoursAgo(9), "Inconsistencia en la validación del beneficiario.", "danger"),
      ],
    }),
    buildPayment({
      id: "PAY-240325-007",
      beneficiaryId: beneficiaries[0].id,
      beneficiaryName: beneficiaries[0].name,
      beneficiaryEmail: beneficiaries[0].email,
      bank: beneficiaries[0].bank,
      country: beneficiaries[0].country,
      accountNumber: beneficiaries[0].accountNumber,
      accountType: beneficiaries[0].accountType,
      swiftIban: beneficiaries[0].swiftIban,
      amountMinor: cents(1450),
      currency: "USD",
      description: "Payout rechazado por documentación incompleta.",
      reference: "REJ-MARAZUL-1450",
      invoiceNumber: "INV-44992",
      executionDate: daysFromNow(1),
      processor: "tropipay",
      estimatedFeeMinor: cents(18.5),
      estimatedDelivery: "Mismo día",
      attachments: [],
      status: "Rejected",
      requiredApproverIds: [],
      approvals: [],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: hoursAgo(6),
      lastUpdatedByName: checker.name,
      submittedAt: hoursAgo(12),
      rejectionReason: "Falta soporte de factura y confirmación del beneficiario.",
      timeline: [
        timelineItem("Pago creado en borrador", maker, hoursAgo(18)),
        timelineItem("Enviado a aprobación", maker, hoursAgo(12), undefined, "warning"),
        timelineItem("Rechazado por validador", checker, hoursAgo(6), "Falta soporte de factura y confirmación del beneficiario.", "danger"),
      ],
    }),
    buildPayment({
      id: "PAY-240325-008",
      beneficiaryId: beneficiaries[1].id,
      beneficiaryName: beneficiaries[1].name,
      beneficiaryEmail: beneficiaries[1].email,
      bank: beneficiaries[1].bank,
      country: beneficiaries[1].country,
      accountNumber: beneficiaries[1].accountNumber,
      accountType: beneficiaries[1].accountType,
      swiftIban: beneficiaries[1].swiftIban,
      amountMinor: cents(810),
      currency: "EUR",
      description: "Pago cancelado por decisión del creador.",
      reference: "CANCEL-EU-0810",
      invoiceNumber: "INV-11027",
      executionDate: daysFromNow(3),
      processor: "b89",
      estimatedFeeMinor: cents(24),
      estimatedDelivery: "24 horas",
      attachments: [],
      status: "Cancelled",
      requiredApproverIds: [],
      approvals: [],
      createdById: maker.id,
      createdByName: maker.name,
      lastUpdated: hoursAgo(20),
      lastUpdatedByName: maker.name,
      timeline: [
        timelineItem("Pago creado en borrador", maker, daysAgo(2)),
        timelineItem("Cancelado por creador", maker, hoursAgo(20), "El pago al proveedor se movió al siguiente ciclo.", "warning"),
      ],
    }),
  ];
};

const seedApprovalRules = (): ApprovalRule[] => [];

const createInitialWorkspace = (): PaymentsWorkspace => {
  const beneficiaries = seedBeneficiaries();
  return {
    walletAvailableMinor: cents(18450),
    approvalConfigurationEnabled: true,
    beneficiaries,
    approvalRules: seedApprovalRules(),
    payments: seedPayments(beneficiaries),
  };
};

export const loadPaymentsWorkspace = (): PaymentsWorkspace => {
  if (typeof window === "undefined") {
    return createInitialWorkspace();
  }

  const raw = window.localStorage.getItem(WORKSPACE_KEY);
  if (!raw) {
    const initial = createInitialWorkspace();
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return { ...createInitialWorkspace(), ...JSON.parse(raw) } as PaymentsWorkspace;
  } catch {
    const initial = createInitialWorkspace();
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(initial));
    return initial;
  }
};

export const savePaymentsWorkspace = (workspace: PaymentsWorkspace) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
};

export const resolveRequiredApproverIds = (
  workspace: PaymentsWorkspace,
  amountMinor: number,
  currency: "USD" | "EUR"
) => {
  if (!workspace.approvalConfigurationEnabled) {
    return [];
  }

  const applicableRules = getSortedApprovalRules(workspace.approvalRules).filter(
    (rule) => usdEquivalentMinor(amountMinor, currency) >= rule.amountThresholdMinor
  );

  return Array.from(
    new Set(
      applicableRules.flatMap((rule) =>
        rule.validatorUserIds.filter((userId) =>
          hasPermissionForRole(actorById(userId).roles, "approve_third_party_payment")
        )
      )
    )
  );
};

export const getPendingApproverIds = (payment: EnterprisePayment) =>
  payment.requiredApproverIds.filter((userId) => !payment.approvals.includes(userId));

const daysForRange = (range: PaymentFilters["dateRange"]) => {
  switch (range) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    default:
      return null;
  }
};

export const filterPayments = (
  payments: EnterprisePayment[],
  filters: PaymentFilters
) => {
  const rangeDays = daysForRange(filters.dateRange);
  const minAmount = filters.minAmount ? Number(filters.minAmount) : null;
  const maxAmount = filters.maxAmount ? Number(filters.maxAmount) : null;

  return payments.filter((payment) => {
    const reviewerIds = payment.timeline
      .filter(
        (item) =>
          item.action === "Aprobado por validador" ||
          item.action === "Rechazado por validador"
      )
      .map((item) => item.userId);

    const text = [
      payment.id,
      payment.beneficiaryName,
      payment.bank,
      payment.country,
      payment.reference,
      payment.invoiceNumber,
      payment.createdByName,
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      !filters.query || text.includes(filters.query.toLowerCase());
    const matchesStatus =
      filters.status === "all" || payment.status === filters.status;
    const matchesCurrency =
      filters.currency === "all" || payment.currency === filters.currency;
    const matchesCreator =
      !filters.createdBy || payment.createdById === filters.createdBy;
    const matchesReviewer =
      !filters.reviewedBy || reviewerIds.includes(filters.reviewedBy);
    const majorAmount = payment.amountMinor / 100;
    const matchesMin = minAmount === null || majorAmount >= minAmount;
    const matchesMax = maxAmount === null || majorAmount <= maxAmount;
    const matchesRange =
      rangeDays === null ||
      new Date(payment.lastUpdated).getTime() >= Date.now() - rangeDays * 24 * 60 * 60 * 1000;

    return (
      matchesQuery &&
      matchesStatus &&
      matchesCurrency &&
      matchesCreator &&
      matchesReviewer &&
      matchesMin &&
      matchesMax &&
      matchesRange
    );
  });
};

export const paginatePayments = (payments: EnterprisePayment[], page: number, limit = 10) => {
  const total = payments.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const normalizedPage = Math.min(Math.max(1, page), pages);
  const start = (normalizedPage - 1) * limit;
  return {
    data: payments.slice(start, start + limit),
    pagination: { total, pages, page: normalizedPage, limit },
  };
};

export const exportPaymentsToCsv = (payments: EnterprisePayment[]) => {
  const header = [
    "payment_id",
    "beneficiary",
    "bank",
    "country",
    "amount",
    "currency",
    "status",
    "created_by",
    "last_updated",
  ];
  const lines = payments.map((payment) =>
    [
      payment.id,
      payment.beneficiaryName,
      payment.bank,
      payment.country,
      (payment.amountMinor / 100).toFixed(2),
      payment.currency,
      payment.status,
      payment.createdByName,
      payment.lastUpdated,
    ].join(",")
  );
  return [header.join(","), ...lines].join("\n");
};

export const getPaymentById = (workspace: PaymentsWorkspace, id: string) =>
  workspace.payments.find((payment) => payment.id === id) ?? null;

export const createBeneficiary = (
  workspace: PaymentsWorkspace,
  input: Omit<Beneficiary, "id">,
  actor: PaymentActor
) => {
  if (
    !hasPermissionForRole(actor.roles, "create_beneficiary") &&
    !hasPermissionForRole(actor.roles, "manage_beneficiaries")
  ) {
    throw new Error("No tienes permiso para crear beneficiarios.");
  }
  const next = clone(workspace);
  const beneficiary: Beneficiary = { ...input, id: makeId("benef") };
  next.beneficiaries.unshift(beneficiary);
  savePaymentsWorkspace(next);
  return beneficiary;
};

export const updateBeneficiary = (
  workspace: PaymentsWorkspace,
  beneficiaryId: string,
  input: Omit<Beneficiary, "id">,
  actor: PaymentActor
) => {
  if (
    !hasPermissionForRole(actor.roles, "update_beneficiary") &&
    !hasPermissionForRole(actor.roles, "manage_beneficiaries")
  ) {
    throw new Error("No tienes permiso para editar beneficiarios.");
  }

  const next = clone(workspace);
  const beneficiary = next.beneficiaries.find((item) => item.id === beneficiaryId);
  if (!beneficiary) {
    throw new Error("El beneficiario no existe.");
  }

  const updatedBeneficiary: Beneficiary = {
    ...beneficiary,
    ...input,
    id: beneficiary.id,
  };

  next.beneficiaries = next.beneficiaries.map((item) =>
    item.id === beneficiaryId ? updatedBeneficiary : item
  );

  savePaymentsWorkspace(next);
  return updatedBeneficiary;
};

export const deleteBeneficiary = (
  workspace: PaymentsWorkspace,
  beneficiaryId: string,
  actor: PaymentActor
) => {
  if (
    !hasPermissionForRole(actor.roles, "delete_beneficiary") &&
    !hasPermissionForRole(actor.roles, "manage_beneficiaries")
  ) {
    throw new Error("No tienes permiso para eliminar beneficiarios.");
  }

  const next = clone(workspace);
  const beneficiary = next.beneficiaries.find((item) => item.id === beneficiaryId);
  if (!beneficiary) {
    throw new Error("El beneficiario no existe.");
  }

  next.beneficiaries = next.beneficiaries.filter((item) => item.id !== beneficiaryId);
  savePaymentsWorkspace(next);
  return beneficiaryId;
};

export const upsertApprovalRule = (
  workspace: PaymentsWorkspace,
  input: { amountThresholdMinor: number; validatorUserIds: string[] },
  actor: PaymentActor,
  ruleId?: string
) => {
  ensurePermission(
    actor,
    "manage_account_configuration",
    "No tienes permiso para configurar validadores."
  );

  if (!Number.isFinite(input.amountThresholdMinor) || input.amountThresholdMinor <= 0) {
    throw new Error("El umbral debe ser mayor que cero.");
  }

  const validatorUserIds = Array.from(new Set(input.validatorUserIds)).filter((userId) =>
    actorById(userId).roles.includes("checker") &&
    hasPermissionForRole(actorById(userId).roles, "approve_third_party_payment")
  );

  if (!validatorUserIds.length) {
    throw new Error("Selecciona al menos un validador con capacidad de aprobación.");
  }

  if (validatorUserIds.length !== 1) {
    throw new Error("Cada regla debe asignar un único checker.");
  }

  const [validatorUserId] = validatorUserIds;
  const duplicateValidatorRule = workspace.approvalRules.find(
    (rule) =>
      rule.id !== ruleId &&
      rule.validatorUserIds.includes(validatorUserId)
  );

  if (duplicateValidatorRule) {
    throw new Error("Ese checker ya está asignado a otra regla.");
  }

  const next = clone(workspace);
  const rule: ApprovalRule = {
    id: ruleId ?? makeId("rule"),
    amountThresholdMinor: input.amountThresholdMinor,
    currency: "USD",
    validatorUserIds: [validatorUserId],
    lastUpdated: nowIso(),
    lastUpdatedByName: actor.name,
  };

  next.approvalRules = ruleId
    ? next.approvalRules.map((item) => (item.id === ruleId ? rule : item))
    : [...next.approvalRules, rule];
  next.approvalRules = getSortedApprovalRules(next.approvalRules);
  savePaymentsWorkspace(next);
  appendAccountAuditEntry({
    action: ruleId ? "approval_rule_updated" : "approval_rule_created",
    actorId: actor.id,
    actorName: actor.name,
    description: `${ruleId ? "Se actualizó" : "Se creó"} una regla desde ${money(rule.amountThresholdMinor)} para ${actorById(validatorUserId).name}.`,
  });
  return rule;
};

export const deleteApprovalRule = (
  workspace: PaymentsWorkspace,
  ruleId: string,
  actor: PaymentActor
) => {
  ensurePermission(
    actor,
    "manage_account_configuration",
    "No tienes permiso para configurar validadores."
  );

  const next = clone(workspace);
  next.approvalRules = next.approvalRules.filter((item) => item.id !== ruleId);
  savePaymentsWorkspace(next);
  appendAccountAuditEntry({
    action: "approval_rule_deleted",
    actorId: actor.id,
    actorName: actor.name,
    description: "Se eliminó una regla de validadores.",
  });
  return next.approvalRules;
};

const ensurePermission = (
  actor: PaymentActor,
  permission: Permission,
  message?: string
) => {
  if (!hasPermissionForRole(actor.roles, permission)) {
    throw new Error(message ?? `Permiso faltante: ${permission}`);
  }
};

export const setApprovalConfigurationEnabled = (
  workspace: PaymentsWorkspace,
  enabled: boolean,
  actor: PaymentActor
) => {
  if (!actor.roles.includes("owner")) {
    throw new Error("Solo el owner puede activar o desactivar este módulo.");
  }

  const next = clone(workspace);
  next.approvalConfigurationEnabled = enabled;
  savePaymentsWorkspace(next);
  appendAccountAuditEntry({
    action: "approval_configuration_toggled",
    actorId: actor.id,
    actorName: actor.name,
    description: enabled
      ? "Se activó el módulo de validadores."
      : "Se desactivó el módulo de validadores.",
  });
  return next.approvalConfigurationEnabled;
};

const canActorActAsValidator = (
  workspace: PaymentsWorkspace,
  payment: EnterprisePayment,
  actor: PaymentActor
) => {
  if (payment.createdById === actor.id) return false;
  if (!hasPermissionForRole(actor.roles, "approve_third_party_payment")) return false;
  if (!workspace.approvalConfigurationEnabled) return true;
  if (payment.requiredApproverIds.length === 0) return true;
  return payment.requiredApproverIds.includes(actor.id);
};

const buildPaymentFromDraft = (
  input: PaymentDraftInput,
  actor: PaymentActor,
  status: PaymentStatus,
  existing?: EnterprisePayment | null
) => {
  const timestamp = nowIso();
  const createdById = existing?.createdById ?? actor.id;
  const createdByName = existing?.createdByName ?? actor.name;
  const paymentId = existing?.id ?? `PAY-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString().slice(2, 5)}`;
  const timeline = existing?.timeline ? [...existing.timeline] : [];

  if (!existing) {
    timeline.unshift(
      timelineItem("Pago creado en borrador", actor, timestamp)
    );
  } else {
    timeline.unshift(
      timelineItem("Datos del pago editados", actor, timestamp, "Se actualizó el borrador del pago.")
    );
  }

  if (status === "Pending Approval") {
    const requiredApproverIds = resolveRequiredApproverIds(
      loadPaymentsWorkspace(),
      input.amountMinor,
      input.currency
    );
    timeline.unshift(
      timelineItem(
        "Enviado a aprobación",
        actor,
        timestamp,
        requiredApproverIds.length
          ? `Validadores requeridos: ${requiredApproverIds.map((id) => actorById(id).name).join(", ")}.`
          : loadPaymentsWorkspace().approvalConfigurationEnabled
            ? "Aprobación simple: cualquier validador autorizado puede aprobar."
            : "Módulo de validadores desactivado: se aplicará aprobación simple.",
        "warning"
      )
    );

    return buildPayment({
      ...input,
      id: paymentId,
      status,
      requiredApproverIds,
      approvals: [],
      createdById,
      createdByName,
      lastUpdated: timestamp,
      lastUpdatedByName: actor.name,
      submittedAt: timestamp,
      timeline,
      rejectionReason: undefined,
      failureReason: undefined,
      approvedAt: undefined,
      processingStartedAt: undefined,
      completedAt: undefined,
    });
  }

  return buildPayment({
    ...input,
    id: paymentId,
    status,
    requiredApproverIds: existing?.requiredApproverIds ?? [],
    approvals: existing?.status === "Rejected" ? [] : existing?.approvals ?? [],
    createdById,
    createdByName,
    lastUpdated: timestamp,
    lastUpdatedByName: actor.name,
    submittedAt: existing?.submittedAt,
    timeline,
    rejectionReason: existing?.rejectionReason,
    failureReason: existing?.failureReason,
    approvedAt: existing?.approvedAt,
    processingStartedAt: undefined,
    completedAt: existing?.completedAt,
  });
};

export const saveDraftPayment = (
  workspace: PaymentsWorkspace,
  input: PaymentDraftInput,
  actor: PaymentActor,
  paymentId?: string
) => {
  const next = clone(workspace);
  const existing = paymentId ? getPaymentById(next, paymentId) : null;
  ensurePermission(
    actor,
    existing ? "update_third_party_payment" : "create_third_party_payment",
    existing
      ? "No tienes permiso para editar pagos a terceros."
      : "No tienes permiso para crear pagos a terceros."
  );
  if (existing) {
    if (existing.createdById !== actor.id) {
      throw new Error("Solo el creador del pago puede editar este borrador.");
    }
    if (!["Draft", "Rejected"].includes(existing.status)) {
      throw new Error("Solo los pagos en borrador o rechazados pueden editarse.");
    }
  }
  const payment = buildPaymentFromDraft(input, actor, "Draft", existing);
  next.payments = existing
    ? next.payments.map((item) => (item.id === payment.id ? payment : item))
    : [payment, ...next.payments];
  savePaymentsWorkspace(next);
  return payment;
};

export const submitPaymentForApproval = (
  workspace: PaymentsWorkspace,
  input: PaymentDraftInput,
  actor: PaymentActor,
  paymentId?: string
) => {
  const next = clone(workspace);
  const existing = paymentId ? getPaymentById(next, paymentId) : null;
  ensurePermission(
    actor,
    existing ? "update_third_party_payment" : "create_third_party_payment",
    existing
      ? "No tienes permiso para actualizar este pago antes de enviarlo."
      : "No tienes permiso para crear este pago."
  );
  ensurePermission(
    actor,
    "submit_third_party_payment",
    "No tienes permiso para enviar pagos a aprobación."
  );
  if (existing) {
    if (existing.createdById !== actor.id) {
      throw new Error("Solo el creador del pago puede reenviarlo a aprobación.");
    }
    if (!["Draft", "Rejected"].includes(existing.status)) {
      throw new Error("Solo los pagos en borrador o rechazados pueden enviarse a aprobación.");
    }
  }
  const payment = buildPaymentFromDraft(input, actor, "Pending Approval", existing);
  next.payments = existing
    ? next.payments.map((item) => (item.id === payment.id ? payment : item))
    : [payment, ...next.payments];
  savePaymentsWorkspace(next);
  return payment;
};

export const approvePayment = (
  workspace: PaymentsWorkspace,
  paymentId: string,
  actor: PaymentActor
) => {
  const next = clone(workspace);
  const payment = getPaymentById(next, paymentId);
  if (!payment) {
    return { success: false, message: "Payment not found." };
  }
  if (!hasPermissionForRole(actor.roles, "approve_third_party_payment")) {
    return { success: false, message: "No tienes permiso para aprobar pagos." };
  }
  if (payment.status !== "Pending Approval") {
    return { success: false, message: "Solo los pagos pendientes de aprobación pueden aprobarse." };
  }
  if (!canActorActAsValidator(workspace, payment, actor)) {
    return { success: false, message: "Este usuario no está autorizado como validador para este pago." };
  }
  if (payment.approvals.includes(actor.id)) {
    return { success: false, message: "Este validador ya aprobó este pago." };
  }

  const now = nowIso();
  const approvals = Array.from(new Set([...payment.approvals, actor.id]));
  const totalRequiredApprovals = workspace.approvalConfigurationEnabled
    ? payment.requiredApproverIds.length || 1
    : 1;
  const approvalsRemaining = Math.max(0, totalRequiredApprovals - approvals.length);
  const fullyApproved = approvalsRemaining === 0;
  const timeline = [...payment.timeline];
  timeline.unshift(
    timelineItem(
      "Aprobado por validador",
      actor,
      now,
      fullyApproved
        ? "Aprobación completa. El pago ya puede pasar a ejecución."
        : `Validación parcial registrada. Falta${approvalsRemaining > 1 ? "n" : ""} ${approvalsRemaining} aprobación${approvalsRemaining > 1 ? "es" : ""}.`,
      "success"
    )
  );

  const updated: EnterprisePayment = {
    ...payment,
    status: fullyApproved ? "Approved" : "Pending Approval",
    approvals,
    approvedAt: fullyApproved ? now : undefined,
    completedAt: undefined,
    failureReason: undefined,
    lastUpdated: now,
    lastUpdatedByName: actor.name,
    timeline,
  };

  next.payments = next.payments.map((item) => (item.id === paymentId ? updated : item));
  savePaymentsWorkspace(next);
  return { success: true, payment: updated };
};

const executeApprovedPaymentInternal = (
  workspace: PaymentsWorkspace,
  paymentId: string,
  actor: PaymentActor
) => {
  const next = clone(workspace);
  const payment = getPaymentById(next, paymentId);
  if (!payment) return { success: false, message: "Payment not found." };
  if (payment.status !== "Approved") {
    return { success: false, message: "Solo los pagos aprobados pueden ejecutarse." };
  }
  if (payment.amountMinor > next.walletAvailableMinor) {
    return { success: false, message: "Insufficient wallet balance to execute this payment." };
  }

  const now = nowIso();
  const updated: EnterprisePayment = {
    ...payment,
    status: "Processing",
    processingStartedAt: now,
    completedAt: undefined,
    failureReason: undefined,
    lastUpdated: now,
    lastUpdatedByName: actor.name,
    timeline: [
      timelineItem("Enviado a ejecución", actor, now, "AntillaPay inició la ejecución operativa del pago.", "warning"),
      ...payment.timeline,
    ],
  };

  next.payments = next.payments.map((item) => (item.id === paymentId ? updated : item));
  savePaymentsWorkspace(next);
  return { success: true, payment: updated };
};

const finalizeProcessingPaymentInternal = (
  workspace: PaymentsWorkspace,
  paymentId: string,
  actor: PaymentActor
) => {
  const next = clone(workspace);
  const payment = getPaymentById(next, paymentId);
  if (!payment) return { success: false, message: "Pago no encontrado." };
  if (payment.status !== "Processing") {
    return { success: false, message: "Solo los pagos en procesamiento pueden finalizarse." };
  }

  const now = nowIso();
  const shouldFail = payment.processor === "ducapp" && payment.amountMinor >= cents(9000);

  const updated: EnterprisePayment = {
    ...payment,
    status: shouldFail ? "Failed" : "Completed",
    processingStartedAt: payment.processingStartedAt,
    completedAt: shouldFail ? undefined : now,
    failureReason: shouldFail
      ? "La ejecución no pudo completarse por una validación bancaria del beneficiario."
      : undefined,
    lastUpdated: now,
    lastUpdatedByName: actor.name,
    timeline: [
      timelineItem(
        shouldFail ? "Fallido" : "Completado",
        actor,
        now,
        shouldFail
          ? "La ejecución se detuvo por una validación bancaria del beneficiario."
          : "Fondos entregados al banco del beneficiario.",
        shouldFail ? "danger" : "success"
      ),
      ...payment.timeline,
    ],
  };

  if (!shouldFail) {
    next.walletAvailableMinor = Math.max(0, next.walletAvailableMinor - payment.amountMinor);
  }

  next.payments = next.payments.map((item) => (item.id === paymentId ? updated : item));
  savePaymentsWorkspace(next);
  return { success: true, payment: updated };
};

export const executePayment = (
  workspace: PaymentsWorkspace,
  paymentId: string,
  actor: PaymentActor
) => {
  if (!hasPermissionForRole(actor.roles, "execute_third_party_payment")) {
    return { success: false, message: "No tienes permiso para ejecutar pagos." };
  }
  return executeApprovedPaymentInternal(workspace, paymentId, actor);
};

export const runScheduledPaymentExecutions = (workspace: PaymentsWorkspace) => {
  const readyForSettlement = workspace.payments.filter((payment) => {
    if (payment.status !== "Processing") return false;
    const startedAt = payment.processingStartedAt ?? payment.lastUpdated;
    return new Date(startedAt).getTime() <= Date.now() - PROCESSING_SETTLEMENT_DELAY_MS;
  });

  if (readyForSettlement.length === 0) {
    return workspace;
  }

  let currentWorkspace = clone(workspace);
  readyForSettlement.forEach((payment) => {
    const result = finalizeProcessingPaymentInternal(currentWorkspace, payment.id, SYSTEM_EXECUTOR);
    if (result.success) {
      currentWorkspace = loadPaymentsWorkspace();
    }
  });

  return loadPaymentsWorkspace();
};

export const isPaymentProcessingSettled = (payment: EnterprisePayment) =>
  payment.status !== "Processing" ||
  new Date(payment.processingStartedAt ?? payment.lastUpdated).getTime() <=
    Date.now() - PROCESSING_SETTLEMENT_DELAY_MS;

export const rejectPayment = (
  workspace: PaymentsWorkspace,
  paymentId: string,
  actor: PaymentActor,
  reason: string
) => {
  const next = clone(workspace);
  const payment = getPaymentById(next, paymentId);
  if (!payment) return { success: false, message: "Payment not found." };
  if (!hasPermissionForRole(actor.roles, "reject_third_party_payment")) {
    return { success: false, message: "No tienes permiso para rechazar pagos." };
  }
  if (payment.status !== "Pending Approval") {
    return { success: false, message: "Solo los pagos pendientes de aprobación pueden rechazarse." };
  }
  if (!canActorActAsValidator(workspace, payment, actor)) {
    return { success: false, message: "Este usuario no está autorizado como validador para este pago." };
  }

  const now = nowIso();
  const updated: EnterprisePayment = {
    ...payment,
    status: "Rejected",
    rejectionReason: reason,
    lastUpdated: now,
    lastUpdatedByName: actor.name,
    timeline: [
      timelineItem("Rechazado por validador", actor, now, reason, "danger"),
      ...payment.timeline,
    ],
  };

  next.payments = next.payments.map((item) => (item.id === paymentId ? updated : item));
  savePaymentsWorkspace(next);
  return { success: true, payment: updated };
};

export const cancelPayment = (
  workspace: PaymentsWorkspace,
  paymentId: string,
  actor: PaymentActor
) => {
  const next = clone(workspace);
  const payment = getPaymentById(next, paymentId);
  if (!payment) return { success: false, message: "Payment not found." };
  if (!hasPermissionForRole(actor.roles, "cancel_third_party_payment")) {
    return { success: false, message: "No tienes permiso para cancelar pagos." };
  }
  if (payment.createdById !== actor.id) {
    return { success: false, message: "Solo el creador puede cancelar este pago." };
  }
  if (!["Draft", "Rejected"].includes(payment.status)) {
    return { success: false, message: "Solo los pagos en borrador o rechazados pueden cancelarse." };
  }

  const now = nowIso();
  const updated: EnterprisePayment = {
    ...payment,
    status: "Cancelled",
    lastUpdated: now,
    lastUpdatedByName: actor.name,
    timeline: [
      timelineItem("Cancelado por creador", actor, now, "Se retiró del ciclo de pagos.", "warning"),
      ...payment.timeline,
    ],
  };
  next.payments = next.payments.map((item) => (item.id === paymentId ? updated : item));
  savePaymentsWorkspace(next);
  return { success: true, payment: updated };
};
