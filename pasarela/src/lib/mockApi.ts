import type { User } from "@/common/types/userTypes";
import type { ClientData } from "@/common/types/clientsTypes";
import type { Transfer } from "@/common/types/transfer";
import type { Payin, PayinHistory } from "@/common/types/payin";
import type { bankAccount } from "@/common/types/bankAccount";
import type { Operation } from "@/common/types/operation";
import type {
  CatalogProduct,
  CatalogProductCreate,
  PaymentDataCreate,
  SelectedProduct,
  productStatus,
} from "@/app/paymentLink/create/types";
import type { PaymentLinkListItem } from "@/app/paymentLink/hooks/usePaymentLinks";
import type { ThirdPartyPayment } from "@/app/payments/hooks/useThirdPartyPayments";
import type { paymentLinkStatus } from "@/common/types/filtersTypes";
import {
  getMockUserById,
  hasPermissionForRole,
  MOCK_RBAC_USERS,
  type Permission,
} from "@/lib/rbac";

type RequestConfig = {
  params?: Record<string, unknown>;
  responseType?: string;
  headers?: Record<string, string>;
};

type ApiResponse<T = any> = Promise<{ data: T }>;

type AuthPendingState = {
  kind: "login" | "register" | "recovery";
  email: string;
  password: string;
  expiresIn: number;
  otp: string;
  expiresAt: number;
  country?: string;
};

type ApiKeyState = {
  publicKey: { key: string; createdAt: string; lastUseAt: string };
  privateKey: { key: string; createdAt: string; lastUseAt: string };
};

type WebhookConfig = {
  id: string;
  eventId: string;
  endpoint: string;
  method: "POST" | "GET" | "PUT";
  body: Record<string, unknown>;
};

type WebhookEventRecord = {
  id: string;
  name: string;
};

type WebhookLogRecord = {
  id: string;
  eventName: string;
  requestBody: {
    eventId: string;
    webhookId: string;
    method: string;
  };
  responseStatus: number;
  responseMessage: string;
  requestedAt: string;
  createdAt: string;
};

type PaymentLinkRecord = PaymentLinkListItem & {
  currency: string;
  amount: number;
  products: SelectedProduct[];
  additionalInfo?: string;
  afterPaymentMessage?: string;
  paymentMethods: {
    transfer: boolean;
    balance: boolean;
  };
  showConfirmation: boolean;
  successURL?: string;
  errorURL?: string;
  generatePDF?: boolean;
  status: paymentLinkStatus | string;
};

type ThirdPartyPaymentRecord = ThirdPartyPayment;

type MockStore = {
  user: User;
  authToken: string | null;
  pendingAuth: AuthPendingState | null;
  apiKeys: ApiKeyState;
  customers: ClientData[];
  products: CatalogProduct[];
  paymentLinks: PaymentLinkRecord[];
  transfers: Transfer[];
  payins: Payin[];
  thirdPartyPayments: ThirdPartyPaymentRecord[];
  payouts: Array<{
    id: string;
    amount: string;
    currency: string;
    status: "Completed" | "Pending" | "Rejected";
    method: string;
    createdAt: string;
  }>;
  bankAccounts: bankAccount[];
  webhookEvents: WebhookEventRecord[];
  webhooks: WebhookConfig[];
  webhookLogs: WebhookLogRecord[];
  nextId: number;
};

const STORE_KEY = "pasarela_mock_store_v3";
const RBAC_USER_KEY = "pasarela_rbac_mock_user_v1";
const AUTH_TOKEN = "mock-auth-token";
const OTP_CODE = "123456";

let memoryStore: MockStore | null = null;

const nowIso = () => new Date().toISOString();

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const hoursAgo = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

const PRODUCT_PLACEHOLDER_PALETTES = [
  ["#0f172a", "#38bdf8", "#f8fafc"],
  ["#1e293b", "#f59e0b", "#fef3c7"],
  ["#172554", "#22c55e", "#dcfce7"],
  ["#3f0d12", "#fb7185", "#ffe4e6"],
];

const createProductPlaceholder = (label: string, seed: number) => {
  const [background, accent, text] =
    PRODUCT_PLACEHOLDER_PALETTES[seed % PRODUCT_PLACEHOLDER_PALETTES.length];
  const safeLabel = (label || "Producto").slice(0, 18);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="640" height="420" rx="32" fill="url(#g)" />
      <circle cx="520" cy="96" r="72" fill="${text}" fill-opacity="0.12" />
      <circle cx="110" cy="360" r="84" fill="${text}" fill-opacity="0.08" />
      <text x="56" y="212" fill="${text}" font-family="Arial, sans-serif" font-size="42" font-weight="700">
        ${safeLabel}
      </text>
      <text x="56" y="254" fill="${text}" fill-opacity="0.82" font-family="Arial, sans-serif" font-size="18">
        AntillaPay Comercial Demo
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const cents = (value: number) => Math.round(value * 100);

const clone = <T,>(value: T): T => {
  if (value instanceof Blob) return value;
  return JSON.parse(JSON.stringify(value)) as T;
};

const makeId = (prefix: string, store: MockStore) => {
  store.nextId += 1;
  return `${prefix}-${store.nextId}-${Date.now().toString(36)}`;
};

const defaultUser = (): User => ({
  id: "demo-business",
  name: "Laura Pérez",
  documentationId: "12-3456789",
  businessType: "mipyme",
  commercialName: "AntillaPay Comercial",
  country: "CUB",
  state: "La Habana",
  city: "Plaza de la Revolución",
  address: "23 y 12, Vedado",
  postalCode: "10400",
  website: "https://comercial.antillapay.demo",
  representativeName: "Laura Pérez",
  representativeEmail: "laura@antillapay.demo",
  representativePhone: "+53 555 1234",
  representativeBirthDate: "1990-04-12",
  representativeCountry: "CUB",
  representativeState: "La Habana",
  representativeCity: "Plaza de la Revolución",
  representativeAddress: "23 y 12, Vedado",
  representativePostalCode: "10400",
  category: "software_servicios_digitales",
  description: "Demo comercial con flujos de cobro, balances, payout y herramientas para equipos de frontend y producto.",
  supportPhone: "+53 555 1234",
  supportEmail: "operaciones@antillapay.demo",
  supportCountry: "CUB",
  supportState: "La Habana",
  supportCity: "Plaza de la Revolución",
  supportAddress: "23 y 12, Vedado",
  supportPostalCode: "10400",
  showSupportPhone: true,
  grossBalance: cents(12840.55),
  netBalance: cents(14320.25),
  validated: "true",
});

const seedCustomers = (): ClientData[] => [
  {
    id: "cust-1",
    name: "Marcos Ruiz",
    businessName: "Hostal Bahia Azul",
    email: "pagos@hostalbahaiazul.demo",
    createdAt: hoursAgo(36),
    type: "business",
  },
  {
    id: "cust-2",
    name: "Daniela Vega",
    businessName: "Farmacia Vedado",
    email: "tesoreria@farmaciavedado.demo",
    createdAt: daysAgo(4),
    type: "business",
  },
  {
    id: "cust-3",
    name: "Sergio Torres",
    businessName: "Ruta 23 Logistica",
    email: "cobros@ruta23.demo",
    createdAt: daysAgo(9),
    type: "business",
  },
  {
    id: "cust-4",
    name: "Paula Gomez",
    businessName: "Mercado Habana Centro",
    email: "pagos@mercadohabana.demo",
    createdAt: daysAgo(13),
    type: "business",
  },
  {
    id: "cust-5",
    name: "Andres Diaz",
    businessName: "Cliente particular",
    email: "andres@cliente.demo",
    createdAt: hoursAgo(20),
    type: "customer",
  },
  {
    id: "cust-6",
    name: "Lidia Fernandez",
    businessName: "Lidia Shop",
    email: "lidia@shop.demo",
    createdAt: daysAgo(6),
    type: "customer",
  },
];

const seedProducts = (): CatalogProduct[] => [
  {
    id: "prod-1",
    name: "Reserva flexible",
    description: "Cobro de reserva para hostales, alojamientos y experiencias con confirmacion inmediata.",
    image: createProductPlaceholder("Reserva", 0),
    prices: [{ currency: "USD", value: cents(24.99) }],
    createdAt: new Date(daysAgo(2)),
    status: "active",
  },
  {
    id: "prod-2",
    name: "Factura mayorista",
    description: "Cobro unico para operaciones B2B con comprobante y conciliacion.",
    image: createProductPlaceholder("Factura", 1),
    prices: [{ currency: "USD", value: cents(185) }],
    createdAt: new Date(daysAgo(8)),
    status: "active",
  },
  {
    id: "prod-3",
    name: "Recarga operativa",
    description: "Recarga de saldo para combustible, transporte o reposicion operativa.",
    image: createProductPlaceholder("Recarga", 2),
    prices: [{ currency: "USD", value: cents(48.5) }],
    createdAt: new Date(daysAgo(14)),
    status: "inactive",
  },
  {
    id: "prod-4",
    name: "Membresia empresarial",
    description: "Plan recurrente para negocios que operan payment links, saldos y transferencias.",
    image: createProductPlaceholder("Membresia", 3),
    prices: [{ currency: "USD", value: cents(79) }],
    createdAt: new Date(daysAgo(5)),
    status: "active",
  },
];

const seedPaymentLinks = (products: CatalogProduct[]): PaymentLinkRecord[] => {
  const selected = (product: CatalogProduct, quantity = 1): SelectedProduct => ({
    ...product,
    quantity,
    allowCustomerQuantity: false,
  });

  const p1 = selected(products[0], 1);
  const p2 = selected(products[1], 1);
  const p3 = selected(products[3], 2);

  return [
    {
      id: "link-1",
      title: "Reserva web Hostal Bahia Azul",
      description: "Link compartido en web y WhatsApp para confirmar reservas en segundos.",
      currency: "USD",
      amount: cents(24.99),
      totalAmount: cents(24.99),
      products: [p1],
      additionalInfo: "Incluye confirmacion por correo y referencia de reserva.",
      afterPaymentMessage: "Tu reserva quedo confirmada. Revisa tu correo para los detalles.",
      paymentMethods: { transfer: true, balance: true },
      showConfirmation: true,
      successURL: "https://comercial.antillapay.demo/reservas/exito",
      errorURL: "https://comercial.antillapay.demo/reservas/error",
      generatePDF: true,
      status: "active",
      createdAt: hoursAgo(12),
      link: "/pasarela/paymentLink/link-1",
    },
    {
      id: "link-2",
      title: "Factura mayorista marzo",
      description: "Cobro enviado al area financiera para una operacion B2B con monto fijo.",
      currency: "USD",
      amount: cents(185),
      totalAmount: cents(185),
      products: [p2],
      additionalInfo: "Pago asociado a la orden comercial AP-0325.",
      afterPaymentMessage: "Factura conciliada con exito.",
      paymentMethods: { transfer: true, balance: true },
      showConfirmation: true,
      successURL: "",
      errorURL: "",
      generatePDF: false,
      status: "draft",
      createdAt: daysAgo(4),
      link: "/pasarela/paymentLink/link-2",
    },
    {
      id: "link-3",
      title: "Membresia y recarga operativa",
      description: "Cobro compuesto para clientes recurrentes con varios conceptos.",
      currency: "USD",
      amount: cents(158),
      totalAmount: cents(158),
      products: [p3],
      additionalInfo: "Operacion cerrada desde el canal comercial interno.",
      afterPaymentMessage: "Pago completado y reflejado en el dashboard.",
      paymentMethods: { transfer: true, balance: true },
      showConfirmation: true,
      successURL: "",
      errorURL: "",
      generatePDF: true,
      status: "paid",
      createdAt: daysAgo(2),
      link: "/pasarela/paymentLink/link-3",
    },
  ];
};

const seedTransfers = (): Transfer[] => [
  {
    id: "tr-1",
    senderCustomerId: "cust-5",
    senderBusinessId: "cust-5",
    senderBusinessName: "Cliente particular",
    senderEmail: "andres@cliente.demo",
    receiverBusinessId: "demo-business",
    receiverBusinessName: "AntillaPay Comercial",
    receiverEmail: "operaciones@antillapay.demo",
    customerId: "cust-5",
    customerName: "Andres Diaz",
    customerEmail: "andres@cliente.demo",
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
    deletedAt: null,
    amount: String(cents(420.5)),
    currency: "USD",
    status: "Completed",
  },
  {
    id: "tr-2",
    senderCustomerId: "cust-1",
    senderBusinessId: "cust-1",
    senderBusinessName: "Hostal Bahia Azul",
    senderEmail: "pagos@hostalbahaiazul.demo",
    receiverBusinessId: "demo-business",
    receiverBusinessName: "AntillaPay Comercial",
    receiverEmail: "operaciones@antillapay.demo",
    customerId: "cust-1",
    customerName: "Marcos Ruiz",
    customerEmail: "pagos@hostalbahaiazul.demo",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    deletedAt: null,
    amount: String(cents(1265)),
    currency: "USD",
    status: "Completed",
  },
  {
    id: "tr-3",
    senderCustomerId: "cust-2",
    senderBusinessId: "cust-2",
    senderBusinessName: "Farmacia Vedado",
    senderEmail: "tesoreria@farmaciavedado.demo",
    receiverBusinessId: "demo-business",
    receiverBusinessName: "AntillaPay Comercial",
    receiverEmail: "operaciones@antillapay.demo",
    customerId: "cust-2",
    customerName: "Daniela Vega",
    customerEmail: "tesoreria@farmaciavedado.demo",
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    deletedAt: null,
    amount: String(cents(230)),
    currency: "USD",
    status: "Pending",
  },
  {
    id: "tr-4",
    senderCustomerId: undefined,
    senderBusinessId: "demo-business",
    senderBusinessName: "AntillaPay Comercial",
    senderEmail: "operaciones@antillapay.demo",
    receiverBusinessId: "cust-4",
    receiverBusinessName: "Mercado Habana Centro",
    receiverEmail: "pagos@mercadohabana.demo",
    customerId: "cust-4",
    customerName: "Paula Gomez",
    customerEmail: "pagos@mercadohabana.demo",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    deletedAt: null,
    amount: String(cents(120)),
    currency: "USD",
    status: "Completed",
  },
  {
    id: "tr-5",
    senderCustomerId: undefined,
    senderBusinessId: "demo-business",
    senderBusinessName: "AntillaPay Comercial",
    senderEmail: "operaciones@antillapay.demo",
    receiverBusinessId: "cust-3",
    receiverBusinessName: "Ruta 23 Logistica",
    receiverEmail: "cobros@ruta23.demo",
    customerId: "cust-3",
    customerName: "Sergio Torres",
    customerEmail: "cobros@ruta23.demo",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    deletedAt: null,
    amount: String(cents(175)),
    currency: "USD",
    status: "Rejected",
  },
];

const seedPayins = (): Payin[] => [
  {
    id: "pi-1",
    customerId: "cust-1",
    customerEmail: "pagos@hostalbahaiazul.demo",
    customerName: "Marcos Ruiz",
    invoiceId: "INV-240325-01",
    createdAt: hoursAgo(10),
    updatedAt: hoursAgo(10),
    deletedAt: null,
    amount: String(cents(249.9)),
    currency: "USD",
    status: "Completed",
  },
  {
    id: "pi-2",
    customerId: "cust-2",
    customerEmail: "tesoreria@farmaciavedado.demo",
    customerName: "Daniela Vega",
    invoiceId: "INV-240325-02",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    deletedAt: null,
    amount: String(cents(990)),
    currency: "USD",
    status: "Completed",
  },
  {
    id: "pi-3",
    customerId: "cust-5",
    customerEmail: "andres@cliente.demo",
    customerName: "Andres Diaz",
    invoiceId: "INV-240325-03",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    deletedAt: null,
    amount: String(cents(159.9)),
    currency: "USD",
    status: "Pending",
  },
  {
    id: "pi-4",
    customerId: "cust-6",
    customerEmail: "lidia@shop.demo",
    customerName: "Lidia Fernandez",
    invoiceId: "INV-240325-04",
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
    deletedAt: null,
    amount: String(cents(399.9)),
    currency: "USD",
    status: "Rejected",
  },
  {
    id: "pi-5",
    customerId: "cust-3",
    customerEmail: "cobros@ruta23.demo",
    customerName: "Sergio Torres",
    invoiceId: "INV-240325-05",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    deletedAt: null,
    amount: String(cents(799.9)),
    currency: "USD",
    status: "Completed",
  },
];

const seedPayouts = () => [
  {
    id: "po-1",
    amount: String(cents(450)),
    currency: "USD",
    status: "Completed" as const,
    method: "Bank transfer",
    createdAt: daysAgo(1),
  },
  {
    id: "po-2",
    amount: String(cents(120)),
    currency: "USD",
    status: "Pending" as const,
    method: "Bank transfer",
    createdAt: daysAgo(3),
  },
  {
    id: "po-3",
    amount: String(cents(180)),
    currency: "USD",
    status: "Rejected" as const,
    method: "Bank transfer",
    createdAt: daysAgo(6),
  },
];

const seedThirdPartyPayments = (): ThirdPartyPaymentRecord[] => [
  {
    id: "tpp-1",
    beneficiaryName: "Importadora Caribe SRL",
    beneficiaryEmail: "tesoreria@importadoracaribe.demo",
    bankName: "Banco Metropolitano",
    accountNumber: "013245678901",
    reference: "PAGO-PROVEEDOR-240325-01",
    amount: String(cents(320)),
    currency: "USD",
    status: "Completed",
    createdAt: daysAgo(1),
  },
  {
    id: "tpp-2",
    beneficiaryName: "Servicios Logisticos Prado",
    beneficiaryEmail: "pagos@logisticosprado.demo",
    bankName: "BANDEC",
    accountNumber: "401100009988",
    reference: "PAGO-PROVEEDOR-240325-02",
    amount: String(cents(185.5)),
    currency: "USD",
    status: "Pending",
    createdAt: daysAgo(3),
  },
  {
    id: "tpp-3",
    beneficiaryName: "Distribuidora Habana Norte",
    beneficiaryEmail: "finanzas@habananorte.demo",
    bankName: "BFI",
    accountNumber: "503344556677",
    reference: "PAGO-PROVEEDOR-240325-03",
    amount: String(cents(95)),
    currency: "USD",
    status: "Rejected",
    createdAt: daysAgo(6),
  },
];

const seedBankAccounts = (): bankAccount[] => [
  { id: "bank-1", bank: "BFI", accountNumber: "407112345678" },
  { id: "bank-2", bank: "VISA", accountNumber: "013230004431" },
];

const seedWebhookEvents = (): WebhookEventRecord[] => [
  { id: "event-1", name: "payment_link.created" },
  { id: "event-2", name: "payment_link.paid" },
  { id: "event-3", name: "transfer.completed" },
  { id: "event-4", name: "payout.completed" },
];

const seedApiKeys = (): ApiKeyState => ({
  publicKey: {
    key: "pk_test_apc_51f0f3e8",
    createdAt: daysAgo(35),
    lastUseAt: hoursAgo(7),
  },
  privateKey: {
    key: "sk_test_apc_7bc1c4a9",
    createdAt: daysAgo(35),
    lastUseAt: hoursAgo(7),
  },
});

const seedWebhookConfigs = (): WebhookConfig[] => [
  {
    id: "wh-1",
    eventId: "event-2",
    endpoint: "https://ops.antillapay.demo/webhooks/payment-links/paid",
    method: "POST",
    body: { source: "commercial-demo", notify: true, retries: 3 },
  },
];

const seedWebhookLogs = (): WebhookLogRecord[] => [
  {
    id: "log-1",
    eventName: "payment_link.created",
    requestBody: {
      eventId: "event-1",
      webhookId: "wh-0",
      method: "POST",
    },
    responseStatus: 201,
    responseMessage: "Created",
    requestedAt: hoursAgo(18),
    createdAt: hoursAgo(18),
  },
  {
    id: "log-2",
    eventName: "payment_link.paid",
    requestBody: {
      eventId: "event-2",
      webhookId: "wh-1",
      method: "POST",
    },
    responseStatus: 200,
    responseMessage: "OK",
    requestedAt: daysAgo(2),
    createdAt: daysAgo(2),
  },
  {
    id: "log-3",
    eventName: "transfer.completed",
    requestBody: {
      eventId: "event-3",
      webhookId: "wh-2",
      method: "POST",
    },
    responseStatus: 500,
    responseMessage: "Mock downstream failure",
    requestedAt: daysAgo(3),
    createdAt: daysAgo(3),
  },
];

const createInitialStore = (): MockStore => {
  const products = seedProducts();
  return {
    user: defaultUser(),
    authToken: null,
    pendingAuth: null,
    apiKeys: seedApiKeys(),
    customers: seedCustomers(),
    products,
    paymentLinks: seedPaymentLinks(products),
    transfers: seedTransfers(),
    payins: seedPayins(),
    thirdPartyPayments: seedThirdPartyPayments(),
    payouts: seedPayouts(),
    bankAccounts: seedBankAccounts(),
    webhookEvents: seedWebhookEvents(),
    webhooks: seedWebhookConfigs(),
    webhookLogs: seedWebhookLogs(),
    nextId: 100,
  };
};

const getStore = (): MockStore => {
  if (memoryStore) return memoryStore;

  if (typeof window === "undefined") {
    memoryStore = createInitialStore();
    return memoryStore;
  }

  const raw = window.localStorage.getItem(STORE_KEY);
  if (!raw) {
    memoryStore = createInitialStore();
    window.localStorage.setItem(STORE_KEY, JSON.stringify(memoryStore));
    return memoryStore;
  }

  try {
    const parsed = JSON.parse(raw) as MockStore;
    memoryStore = {
      ...createInitialStore(),
      ...parsed,
    };
    return memoryStore;
  } catch {
    memoryStore = createInitialStore();
    window.localStorage.setItem(STORE_KEY, JSON.stringify(memoryStore));
    return memoryStore;
  }
};

const saveStore = () => {
  if (typeof window === "undefined" || !memoryStore) return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(memoryStore));
};

const updateStore = (updater: (store: MockStore) => void) => {
  const store = getStore();
  updater(store);
  memoryStore = store;
  saveStore();
  return store;
};

const isHttpLike = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:");

const parseUrl = (input: string) => {
  const parsed = new URL(input, "https://mock.antilla.local");
  let pathname = parsed.pathname;
  if (pathname.startsWith("/pasarela/")) {
    pathname = pathname.slice("/pasarela".length);
  } else if (pathname === "/pasarela") {
    pathname = "/";
  }
  return {
    pathname: pathname.replace(/\/+$/, "") || "/",
    params: Object.fromEntries(parsed.searchParams.entries()),
  };
};

const getParam = (params: Record<string, unknown>, key: string) => {
  const value = params[key];
  return value === undefined || value === null ? undefined : String(value);
};

const toNumber = (value: unknown) => {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
};

const matchesQuery = (value: string | undefined, query: string | undefined) => {
  if (!query) return true;
  return (value ?? "").toLowerCase().includes(query.toLowerCase());
};

const withinMonths = (dateIso: string, months: number | null | undefined) => {
  if (!months) return true;
  const date = new Date(dateIso).getTime();
  const threshold = new Date();
  threshold.setMonth(threshold.getMonth() - months);
  return date >= threshold.getTime();
};

const withinDays = (dateIso: string, days: number) => {
  const date = new Date(dateIso).getTime();
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return date >= threshold;
};

const paginate = <T,>(items: T[], page = 1, limit = 10) => {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const normalizedPage = Math.min(Math.max(1, page), pages);
  const start = (normalizedPage - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    pagination: { total, pages, page: normalizedPage, limit },
  };
};

const csvEscape = (value: unknown) => {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[,"\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const blobFromText = (text: string, mimeType: string) =>
  new Blob([text], { type: mimeType });

const blobFromCsv = (rows: Record<string, unknown>[], fields: string[], filename: string) => {
  const header = fields.join(",");
  const lines = rows.map((row) => fields.map((field) => csvEscape(row[field])).join(","));
  return {
    blob: blobFromText([header, ...lines].join("\n"), "text/csv"),
    filename,
  };
};

const makePdfBlob = (label: string) => {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [3 0 R] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${label.length + 50} >>
stream
BT /F1 18 Tf 40 100 Td (${label}) Tj ET
endstream
endobj
xref
0 5
0000000000 65535 f 
trailer
<< /Root 1 0 R /Size 5 >>
startxref
0
%%EOF`;
  return blobFromText(content, "application/pdf");
};

const fileToDataUrl = async (file?: File | null) => {
  if (!file) return null;
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

const normalizeStatus = (status?: string | null): paymentLinkStatus => {
  if (!status) return "active";
  const normalized = status.toLowerCase();
  if (normalized === "paid" || normalized === "expired" || normalized === "draft") {
    return normalized;
  }
  return normalized === "inactive" ? "inactive" : "active";
};

const resolvePaymentProducts = (
  store: MockStore,
  payloadProducts?: { id: string; quantity: number }[] | SelectedProduct[] | null
): SelectedProduct[] => {
  if (!payloadProducts) return [];

  return payloadProducts
    .map((item) => {
      const id = "id" in item ? item.id : (item as SelectedProduct).id;
      const product = store.products.find((entry) => entry.id === id);
      if (!product) return null;
      const quantity = "quantity" in item ? Number(item.quantity) || 1 : Number((item as SelectedProduct).quantity) || 1;
      return {
        ...product,
        quantity,
        allowCustomerQuantity: Boolean((item as SelectedProduct).allowCustomerQuantity ?? false),
      };
    })
    .filter((item): item is SelectedProduct => item !== null);
};

const buildOperationFromPayin = (payin: Payin): PayinHistory => ({
  id: payin.id,
  customerId: payin.customerId,
  customerEmail: payin.customerEmail,
  customerName: payin.customerName,
  invoiceId: payin.invoiceId,
  createdAt: payin.createdAt,
  updatedAt: payin.updatedAt,
  deletedAt: payin.deletedAt,
  Operation: {
    id: `${payin.id}-op`,
    businessId: "demo-business",
    amount: payin.amount,
    currency: payin.currency,
    status: payin.status,
    declineReason: payin.status === "Rejected" ? "Mock rejection" : null,
    completedAt: payin.status === "Completed" ? payin.updatedAt : null,
    rejectedAt: payin.status === "Rejected" ? payin.updatedAt : null,
    createdAt: payin.createdAt,
    updatedAt: payin.updatedAt,
    deletedAt: payin.deletedAt,
  },
});

const errorResponse = (status: number, message: string) => {
  const error = new Error(`Request failed with status code ${status}`) as Error & {
    name: string;
    response: { status: number; data: { message: string } };
  };
  error.name = "AxiosError";
  error.response = { status, data: { message } };
  return error;
};

const getAuthenticatedUser = (store: MockStore) => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("authToken") : store.authToken;
  if (token !== AUTH_TOKEN) return null;
  return store.user;
};

const setAuthenticatedUser = (store: MockStore) => {
  store.authToken = AUTH_TOKEN;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("authToken", AUTH_TOKEN);
  }
};

const ensureAuth = (store: MockStore) => {
  const user = getAuthenticatedUser(store);
  if (!user) {
    throw errorResponse(401, "unauthorized");
  }
  return user;
};

const getCurrentRbacUser = () => {
  if (typeof window === "undefined") {
    return MOCK_RBAC_USERS[0];
  }
  const storedUserId = window.localStorage.getItem(RBAC_USER_KEY);
  return getMockUserById(storedUserId ?? MOCK_RBAC_USERS[0].id);
};

const ensureRbacPermission = (
  store: MockStore,
  permission: Permission | Permission[],
  message = "forbidden"
) => {
  ensureAuth(store);
  const currentUser = getCurrentRbacUser();
  const required = Array.isArray(permission) ? permission : [permission];
  const authorized = required.some((item) => hasPermissionForRole(currentUser.roles, item));
  if (!authorized) {
    throw errorResponse(403, message);
  }
  return currentUser;
};

const buildDashboardSnapshot = (store: MockStore, params: Record<string, unknown> = {}) => {
  const range = String(params.range ?? "last7Days");
  const granularity = String(params.granularity ?? "daily");
  const rangeDays = range === "last30Days" ? 30 : 7;
  const bucketSize = granularity === "weekly" ? 7 : 1;
  const bucketCount = Math.max(1, Math.ceil(rangeDays / bucketSize));
  const completedPayins = store.payins.filter(
    (item) => item.status === "Completed" && withinDays(item.createdAt, rangeDays)
  );
  const completedTransfers = store.transfers.filter(
    (item) => item.status === "Completed" && withinDays(item.createdAt, rangeDays)
  );
  const previousPayins = store.payins.filter(
    (item) =>
      item.status === "Completed" &&
      withinDays(item.createdAt, rangeDays * 2) &&
      !withinDays(item.createdAt, rangeDays)
  );
  const previousTransfers = store.transfers.filter(
    (item) =>
      item.status === "Completed" &&
      withinDays(item.createdAt, rangeDays * 2) &&
      !withinDays(item.createdAt, rangeDays)
  );
  const payinTotal = completedPayins.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const transferTotal = completedTransfers.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const previousTotal =
    previousPayins.reduce((sum, item) => sum + toNumber(item.amount), 0) +
    previousTransfers.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const currentTotal = payinTotal + transferTotal;
  const compareEnabled = String(params.compare ?? "true") !== "false";
  const deltaPct = previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : 0;
  const topCustomers = store.customers.slice(0, 3).map((customer, index) => ({
    customerName: customer.name,
    customerBusinessName: customer.businessName,
    totalAmount: [cents(1280), cents(940), cents(620)][index] ?? cents(420),
  }));
  const topProducts = store.products.slice(0, 3).map((product, index) => ({
    name: product.name,
    totalQuantity: [16, 11, 8][index] ?? 1,
    product: {
      prices: product.prices,
    },
  }));
  const chart = Array.from({ length: bucketCount }, (_, index) => ({
    netBalance: cents(10200 + index * 280 + completedPayins.length * 31 - completedTransfers.length * 18),
  }));

  return {
    customers: {
      newCustomers: Math.max(1, store.customers.filter((item) => withinMonths(item.createdAt, 1)).length),
      recurrentCustomers: Math.max(1, completedPayins.length - 1),
      payins: {
        paymentsPerCustomer: Number((completedPayins.length / Math.max(store.customers.length, 1)).toFixed(1)),
        averageVolume: completedPayins.length
          ? Math.round(payinTotal / completedPayins.length)
          : cents(320),
        currency: "USD",
      },
    },
    keys: {
      publicKey: { key: store.apiKeys.publicKey.key },
      privateKey: { key: store.apiKeys.privateKey.key },
    },
    topCustomers: {
      data: topCustomers,
      currency: "USD",
    },
    topProducts: {
      data: topProducts,
      currency: "USD",
    },
    series: {
      from: daysAgo(rangeDays - 1),
      to: nowIso(),
      data: chart,
    },
    balance: {
      grossBalance: store.user.grossBalance,
      netBalance: store.user.netBalance,
    },
    completedOps: {
      total: completedPayins.length + completedTransfers.length,
    },
    meta: {
      deltaPct: compareEnabled ? deltaPct : 0,
      previousTotal,
      currentTotal,
    },
  };
};

const buildApiKeysResponse = (store: MockStore) => ({
  publicKey: store.apiKeys.publicKey,
  privateKey: store.apiKeys.privateKey,
});

const listProducts = (store: MockStore, params: Record<string, unknown>) => {
  const query = getParam(params, "query");
  const status = getParam(params, "status");
  const months = params.months === null || params.months === undefined ? null : Number(params.months);
  const page = Number(params.page ?? 1);

  const filtered = store.products.filter((product) => {
    const matchesStatus = !status || product.status === status;
    const matchesSearch =
      !query ||
      matchesQuery(product.name, query) ||
      matchesQuery(product.description, query);
    const matchesDate = withinMonths(String(product.createdAt), months);
    return matchesStatus && matchesSearch && matchesDate;
  });

  return paginate(filtered, page, 10);
};

const listPaymentLinks = (store: MockStore, params: Record<string, unknown>) => {
  const query = getParam(params, "query");
  const status = getParam(params, "status");
  const months = params.months === null || params.months === undefined ? null : Number(params.months);
  const page = Number(params.page ?? 1);

  const filtered = store.paymentLinks.filter((link) => {
    const matchesStatus = !status || link.status === status;
    const matchesSearch =
      !query ||
      matchesQuery(link.title ?? "", query) ||
      matchesQuery(link.description ?? "", query) ||
      matchesQuery(link.id ?? "", query);
    const matchesDate = withinMonths(link.createdAt ?? "", months);
    return matchesStatus && matchesSearch && matchesDate;
  });

  return paginate(filtered, page, 10);
};

const listCustomers = (store: MockStore, params: Record<string, unknown>) => {
  const query = getParam(params, "query");
  const type = getParam(params, "type");
  const months = params.months === null || params.months === undefined ? null : Number(params.months);
  const page = Number(params.page ?? 1);

  const filtered = store.customers.filter((customer) => {
    const matchesType = !type || customer.type === type;
    const matchesSearch =
      !query ||
      matchesQuery(customer.name, query) ||
      matchesQuery(customer.businessName, query) ||
      matchesQuery(customer.email, query);
    const matchesDate = withinMonths(customer.createdAt, months);
    return matchesType && matchesSearch && matchesDate;
  });

  return paginate(filtered, page, 10);
};

const listTransfers = (store: MockStore, params: Record<string, unknown>, way: "in" | "out") => {
  const query = getParam(params, "query");
  const status = getParam(params, "status");
  const months = params.months === null || params.months === undefined ? null : Number(params.months);
  const page = Number(params.page ?? 1);

  const filtered = store.transfers.filter((transfer) => {
    const directionMatches =
      way === "in"
        ? transfer.receiverBusinessId === "demo-business"
        : transfer.senderBusinessId === "demo-business";
    const matchesStatus = !status || transfer.status === status;
    const matchesSearch =
      !query ||
      matchesQuery(transfer.senderEmail ?? transfer.receiverEmail ?? "", query) ||
      matchesQuery(transfer.receiverEmail ?? transfer.senderEmail ?? "", query) ||
      matchesQuery(transfer.senderBusinessName ?? transfer.receiverBusinessName ?? "", query) ||
      matchesQuery(transfer.receiverBusinessName ?? transfer.senderBusinessName ?? "", query);
    const matchesDate = withinMonths(transfer.createdAt, months);
    return directionMatches && matchesStatus && matchesSearch && matchesDate;
  });

  return paginate(filtered, page, 10);
};

const listPayins = (store: MockStore, params: Record<string, unknown>) => {
  const query = getParam(params, "query");
  const status = getParam(params, "status");
  const months = params.months === null || params.months === undefined ? null : Number(params.months);
  const page = Number(params.page ?? 1);

  const filtered = store.payins.filter((payin) => {
    const matchesStatus = !status || payin.status === status;
    const matchesSearch =
      !query ||
      matchesQuery(payin.customerEmail, query) ||
      matchesQuery(payin.customerName, query) ||
      matchesQuery(payin.invoiceId, query);
    const matchesDate = withinMonths(payin.createdAt, months);
    return matchesStatus && matchesSearch && matchesDate;
  });

  return paginate(filtered, page, 10);
};

const listPayouts = (store: MockStore, params: Record<string, unknown>) => {
  const status = getParam(params, "status");
  const months = params.months === null || params.months === undefined ? null : Number(params.months);
  const page = Number(params.page ?? 1);

  const filtered = store.payouts.filter((item) => {
    const matchesStatus = !status || item.status === status;
    const matchesDate = withinMonths(item.createdAt, months);
    return matchesStatus && matchesDate;
  });

  return paginate(filtered, page, 10);
};

const listThirdPartyPayments = (store: MockStore, params: Record<string, unknown>) => {
  const query = getParam(params, "query");
  const status = getParam(params, "status");
  const months = params.months === null || params.months === undefined ? null : Number(params.months);
  const page = Number(params.page ?? 1);

  const filtered = store.thirdPartyPayments.filter((payment) => {
    const matchesStatus = !status || payment.status === status;
    const matchesSearch =
      !query ||
      matchesQuery(payment.beneficiaryName, query) ||
      matchesQuery(payment.beneficiaryEmail, query) ||
      matchesQuery(payment.bankName, query) ||
      matchesQuery(payment.reference, query);
    const matchesDate = withinMonths(payment.createdAt, months);
    return matchesStatus && matchesSearch && matchesDate;
  });

  return paginate(filtered, page, 10);
};

const listCustomerHistory = (store: MockStore, customerId: string, params: Record<string, unknown>) => {
  const page = Number(params.page ?? 1);
  const histories = store.payins
    .filter((payin) => payin.customerId === customerId)
    .map(buildOperationFromPayin);
  return paginate(histories, page, 10);
};

const exportFromRows = (rows: Record<string, unknown>[], fields: string[], type: string, name: string) => {
  const safeFields = fields.length > 0 ? fields : Object.keys(rows[0] ?? {});
  const csv = blobFromCsv(rows, safeFields, `${name}.${type === "excel" ? "xlsx" : "csv"}`);
  return csv.blob;
};

const normalizeProductPayload = async (data: unknown): Promise<Partial<CatalogProductCreate>> => {
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    const rawPrices = data.get("prices");
    const rawImage = data.get("image");
    return {
      name: String(data.get("name") ?? ""),
      description: String(data.get("description") ?? ""),
      prices: typeof rawPrices === "string" ? (JSON.parse(rawPrices) as CatalogProductCreate["prices"]) : [],
      status: String(data.get("status") ?? "active") as productStatus,
      imageFile: typeof File !== "undefined" && rawImage instanceof File ? rawImage : undefined,
    };
  }

  if (data && typeof data === "object") {
    return data as Partial<CatalogProductCreate>;
  }

  return {};
};

const createProductFromPayload = async (
  store: MockStore,
  payload: Partial<CatalogProductCreate>
): Promise<CatalogProduct> => {
  const productName = String(payload.name ?? "Nuevo producto").trim() || "Nuevo producto";
  const prices =
    Array.isArray(payload.prices) && payload.prices.length > 0
      ? payload.prices
      : [{ currency: "USD", value: cents(1) }];
  const image =
    (payload.imageFile ? await fileToDataUrl(payload.imageFile) : payload.image ?? null) ??
    createProductPlaceholder(productName, store.nextId + 1);
  return {
    id: makeId("prod", store),
    name: productName,
    description: payload.description ?? "",
    image,
    prices,
    createdAt: new Date(),
    status: payload.status ?? "active",
  };
};

const upsertWebhooksLog = (store: MockStore, eventName: string, status: number, message: string) => {
  store.webhookLogs.unshift({
    id: makeId("log", store),
    eventName,
    requestBody: {
      eventId: store.webhookEvents.find((event) => event.name === eventName)?.id ?? "event-unknown",
      webhookId: store.webhooks.find((item) => item.eventId === store.webhookEvents.find((event) => event.name === eventName)?.id)?.id ?? "wh-local",
      method: "POST",
    },
    responseStatus: status,
    responseMessage: message,
    requestedAt: nowIso(),
    createdAt: nowIso(),
  });
};

class MockApi {
  async get<T = any>(url: string, config: RequestConfig = {}): ApiResponse<T> {
    return this.handle<T>("GET", url, undefined, config);
  }

  async post<T = any>(url: string, data?: unknown, config: RequestConfig = {}): ApiResponse<T> {
    return this.handle<T>("POST", url, data, config);
  }

  async put<T = any>(url: string, data?: unknown, config: RequestConfig = {}): ApiResponse<T> {
    return this.handle<T>("PUT", url, data, config);
  }

  async delete<T = any>(url: string, config: RequestConfig = {}): ApiResponse<T> {
    return this.handle<T>("DELETE", url, undefined, config);
  }

  private async handle<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data: unknown,
    config: RequestConfig
  ): ApiResponse<T> {
    const { pathname, params: urlParams } = parseUrl(url);
    const params = { ...urlParams, ...(config.params ?? {}) };
    const store = getStore();

    const response = await this.route<T>(method, pathname, data, params, store, config);
    return { data: clone(response) as T };
  }

  private async route<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    pathname: string,
    data: unknown,
    params: Record<string, unknown>,
    store: MockStore,
    config: RequestConfig
  ): Promise<T> {
    if (pathname === "/auth/me" && method === "GET") {
      const user = ensureAuth(store);
      return user as T;
    }

    if (pathname === "/auth/login" && method === "POST") {
      const payload = data as { email?: string; password?: string };
      const email = String(payload?.email ?? "");
      const password = String(payload?.password ?? "");
      const matchesDemo =
        email.trim().toLowerCase() === "customer@demo.com" &&
        password === "AntillaCapital123!";
      const matchesCurrent = email.trim().toLowerCase() === store.user.representativeEmail.toLowerCase() && password === "AntillaCapital123!";
      if (!matchesDemo && !matchesCurrent) {
        throw errorResponse(401, "invalid_credentials");
      }
      updateStore((next) => {
        next.pendingAuth = {
          kind: "login",
          email,
          password,
          expiresIn: 900,
          otp: OTP_CODE,
          expiresAt: Date.now() + 900_000,
        };
      });
      return { expiresIn: 900, expires_in: 900 } as T;
    }

    if (pathname === "/auth/register" && method === "POST") {
      const payload = data as { email?: string; password?: string; country?: string };
      const email = String(payload?.email ?? "");
      const password = String(payload?.password ?? "");
      const country = String(payload?.country ?? "CUB");
      updateStore((next) => {
        next.pendingAuth = {
          kind: "register",
          email,
          password,
          country,
          expiresIn: 900,
          otp: OTP_CODE,
          expiresAt: Date.now() + 900_000,
        };
      });
      return { expiresIn: 900, expires_in: 900 } as T;
    }

    if (pathname === "/auth/recovery" && method === "POST") {
      const payload = data as { email?: string };
      const email = String(payload?.email ?? "");
      updateStore((next) => {
        next.pendingAuth = {
          kind: "recovery",
          email,
          password: "",
          expiresIn: 900,
          otp: OTP_CODE,
          expiresAt: Date.now() + 900_000,
        };
      });
      return { expiresIn: 900, expires_in: 900 } as T;
    }

    if (pathname === "/auth/verify-2fa" && method === "POST") {
      const payload = data as { email?: string; code?: string };
      const email = String(payload?.email ?? "");
      const code = String(payload?.code ?? "");
      const pending = store.pendingAuth;

      if (!pending || pending.email.toLowerCase() !== email.toLowerCase()) {
        throw errorResponse(400, "invalid_code");
      }

      if (pending.otp !== code) {
        throw errorResponse(400, "invalid_code");
      }

      updateStore((next) => {
        next.pendingAuth = null;
        setAuthenticatedUser(next);
        next.user = {
          ...next.user,
          representativeEmail: pending.email || next.user.representativeEmail,
          validated: next.user.validated === "pending" ? "true" : next.user.validated,
        };
        if (pending.kind === "register") {
          next.user.country = pending.country ?? next.user.country;
          next.user.supportCountry = pending.country ?? next.user.supportCountry;
        }
      });

      return {
        token: AUTH_TOKEN,
      } as T;
    }

    if (pathname === "/auth/reset-password" && method === "PUT") {
      const payload = data as { email?: string; code?: string; newPassword?: string };
      const pending = store.pendingAuth;
      if (!pending || pending.kind !== "recovery") {
        throw errorResponse(400, "invalid_code");
      }
      if (pending.email.toLowerCase() !== String(payload?.email ?? "").toLowerCase() || pending.otp !== String(payload?.code ?? "")) {
        throw errorResponse(400, "invalid_code");
      }
      updateStore((next) => {
        next.pendingAuth = null;
        next.user = {
          ...next.user,
          validated: "true",
        };
        if (payload?.email) {
          next.user.representativeEmail = String(payload.email);
        }
      });
      return { success: true } as T;
    }

    if (pathname === "/businesses/step-1" && method === "PUT") {
      ensureRbacPermission(store, "manage_account_configuration", "forbidden_manage_account_configuration");
      const payload = data as Partial<User>;
      updateStore((next) => {
        next.user = { ...next.user, ...payload };
      });
      return { success: true } as T;
    }
    if (pathname === "/businesses/step-2" && method === "PUT") {
      ensureRbacPermission(store, "manage_account_configuration", "forbidden_manage_account_configuration");
      const payload = data as Partial<User>;
      updateStore((next) => {
        next.user = { ...next.user, ...payload };
      });
      return { success: true } as T;
    }
    if (pathname === "/businesses/step-3" && method === "PUT") {
      ensureRbacPermission(store, "manage_account_configuration", "forbidden_manage_account_configuration");
      const payload = data as Partial<User>;
      updateStore((next) => {
        next.user = { ...next.user, ...payload };
      });
      return { success: true } as T;
    }
    if (pathname === "/businesses/step-4" && method === "PUT") {
      ensureRbacPermission(store, "manage_account_configuration", "forbidden_manage_account_configuration");
      const payload = data as Partial<User>;
      updateStore((next) => {
        next.user = { ...next.user, ...payload };
      });
      return { success: true } as T;
    }
    if (pathname === "/businesses/step-5" && method === "PUT") {
      ensureRbacPermission(store, "manage_account_configuration", "forbidden_manage_account_configuration");
      const payload = data as Partial<User>;
      updateStore((next) => {
        next.user = { ...next.user, ...payload };
      });
      return { success: true } as T;
    }
    if (pathname === "/businesses/validate" && method === "PUT") {
      ensureRbacPermission(store, "submit_account_verification", "forbidden_submit_account_verification");
      updateStore((next) => {
        next.user.validated = "true";
      });
      return { success: true } as T;
    }

    if (pathname === "/businesses/keys" && method === "GET") {
      ensureRbacPermission(store, "view_api_keys", "forbidden_view_api_keys");
      return buildApiKeysResponse(store) as T;
    }
    if (pathname === "/businesses/regenerate-keys" && method === "POST") {
      ensureRbacPermission(store, "manage_api_keys", "forbidden_manage_api_keys");
      updateStore((next) => {
        next.apiKeys = {
          publicKey: {
            key: `pk_test_apc_${makeId("pub", next)}`,
            createdAt: nowIso(),
            lastUseAt: nowIso(),
          },
          privateKey: {
            key: `sk_test_apc_${makeId("sec", next)}`,
            createdAt: nowIso(),
            lastUseAt: nowIso(),
          },
        };
      });
      return buildApiKeysResponse(getStore()) as T;
    }

    if (pathname === "/stats/customers" && method === "GET") {
      return buildDashboardSnapshot(store, params).customers as T;
    }
    if (pathname === "/stats/top-customers" && method === "GET") {
      return buildDashboardSnapshot(store, params).topCustomers as T;
    }
    if (pathname === "/stats/top-products" && method === "GET") {
      return buildDashboardSnapshot(store, params).topProducts as T;
    }
    if (pathname === "/stats/netbalance-series" && method === "GET") {
      return buildDashboardSnapshot(store, params).series as T;
    }
    if (pathname === "/stats/balance" && method === "GET") {
      return buildDashboardSnapshot(store, params).balance as T;
    }
    if (pathname === "/stats/completed-ops" && method === "GET") {
      return buildDashboardSnapshot(store, params).completedOps as T;
    }

    if (pathname === "/bank-accounts/balance" && method === "GET") {
      ensureRbacPermission(store, "view_balance", "forbidden_view_balance");
      return {
        grossBalance: store.user.grossBalance,
        netBalance: store.user.netBalance,
        available: store.user.grossBalance,
        pending: store.user.netBalance - store.user.grossBalance,
        total: store.user.netBalance,
      } as T;
    }

    if (pathname === "/bank-accounts" && method === "GET") {
      ensureRbacPermission(store, "view_bank_accounts", "forbidden_view_bank_accounts");
      return store.bankAccounts as T;
    }
    if (pathname === "/bank-accounts" && method === "POST") {
      ensureRbacPermission(store, "manage_bank_accounts", "forbidden_manage_bank_accounts");
      const payload = data as { bankName?: string; accountNumber?: string };
      updateStore((next) => {
        next.bankAccounts.unshift({
          id: makeId("bank", next),
          bank: (payload?.bankName as bankAccount["bank"]) ?? "BFI",
          accountNumber: String(payload?.accountNumber ?? "0000000000"),
        });
      });
      return { success: true } as T;
    }

    if (pathname === "/payouts" && method === "GET") {
      ensureRbacPermission(store, "view_payouts", "forbidden_view_payouts");
      return listPayouts(store, params) as T;
    }
    if (pathname === "/payouts" && method === "POST") {
      ensureRbacPermission(store, "withdraw_funds", "forbidden_withdraw_funds");
      const payload = data as { amount?: number; bankAccountId?: string };
      const amount = Math.max(0, Number(payload?.amount ?? 0));
      updateStore((next) => {
        next.payouts.unshift({
          id: makeId("po", next),
          amount: String(amount),
          currency: "USD",
          status: "Pending",
          method: "Bank transfer",
          createdAt: nowIso(),
        });
        next.user.grossBalance = Math.max(0, next.user.grossBalance - amount);
        next.user.netBalance = Math.max(0, next.user.netBalance - amount);
      });
      return { success: true } as T;
    }

    if (pathname === "/customers" && method === "GET") {
      return {
        ...listCustomers(store, params),
      } as T;
    }
    if (pathname.startsWith("/customers/export/") && method === "GET") {
      const extension = pathname.split("/").pop() ?? "csv";
      const list = listCustomers(store, params);
      const fields = String(params.fields ?? "").split(",").filter(Boolean);
      const blob = exportFromRows(list.data as unknown as Record<string, unknown>[], fields, extension, "customers");
      return blob as T;
    }
    if (pathname.match(/^\/customers\/[^/]+$/) && method === "GET") {
      const id = pathname.split("/").pop()!;
      const customer = store.customers.find((item) => item.id === id);
      if (!customer) throw errorResponse(404, "not_found");
      return customer as T;
    }
    if (pathname.match(/^\/customers\/[^/]+\/history$/) && method === "GET") {
      const id = pathname.split("/")[2];
      return {
        ...listCustomerHistory(store, id, params),
      } as T;
    }
    if (pathname.match(/^\/customers\/[^/]+\/history\/export\/(csv|excel)$/) && method === "GET") {
      const id = pathname.split("/")[2];
      const history = listCustomerHistory(store, id, params);
      const rows = (history.data as unknown as PayinHistory[]).map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        amount: item.Operation.amount,
        currency: item.Operation.currency,
        status: item.Operation.status,
      }));
      const blob = exportFromRows(rows, ["id", "createdAt", "amount", "currency", "status"], pathname.includes("excel") ? "excel" : "csv", "customer-history");
      return blob as T;
    }

    if (pathname === "/products" && method === "GET") {
      return {
        ...listProducts(store, params),
      } as T;
    }
    if (pathname === "/products" && method === "POST") {
      ensureRbacPermission(store, "create_product", "forbidden_create_product");
      const payload = await normalizeProductPayload(data);
      const created = await createProductFromPayload(store, payload);
      updateStore((next) => {
        next.products.unshift(created);
      });
      return created as T;
    }
    if (pathname.startsWith("/products/export/") && method === "GET") {
      const extension = pathname.split("/").pop() ?? "csv";
      const list = listProducts(store, params);
      const fields = String(params.fields ?? "").split(",").filter(Boolean);
      const blob = exportFromRows(list.data as unknown as Record<string, unknown>[], fields, extension, "products");
      return blob as T;
    }
    if (pathname.match(/^\/products\/[^/]+$/) && method === "GET") {
      const id = pathname.split("/").pop()!;
      const product = store.products.find((item) => item.id === id);
      if (!product) throw errorResponse(404, "not_found");
      return product as T;
    }
    if (pathname.match(/^\/products\/[^/]+$/) && method === "PUT") {
      ensureRbacPermission(store, "update_product", "forbidden_update_product");
      const id = pathname.split("/").pop()!;
      const payload = await normalizeProductPayload(data);
      const product = store.products.find((item) => item.id === id);
      if (!product) throw errorResponse(404, "not_found");
      const nextImage =
        (payload.imageFile ? await fileToDataUrl(payload.imageFile) : payload.image ?? product.image ?? null) ??
        createProductPlaceholder(payload.name ?? product.name, store.nextId + 1);
      updateStore((next) => {
        const index = next.products.findIndex((item) => item.id === id);
        next.products[index] = {
          ...next.products[index],
          name: payload.name ?? next.products[index].name,
          description: payload.description ?? next.products[index].description ?? "",
          prices: payload.prices ?? next.products[index].prices,
          image: nextImage,
          status: payload.status ?? next.products[index].status,
        };
      });
      return getStore().products.find((item) => item.id === id) as T;
    }
    if (pathname.match(/^\/products\/[^/]+$/) && method === "DELETE") {
      ensureRbacPermission(store, "delete_product", "forbidden_delete_product");
      const id = pathname.split("/").pop()!;
      updateStore((next) => {
        next.products = next.products.filter((item) => item.id !== id);
        next.paymentLinks = next.paymentLinks.map((link) => ({
          ...link,
          products: (link.products ?? []).filter((product) => product.id !== id) as SelectedProduct[],
        })) as PaymentLinkRecord[];
      });
      return { success: true } as T;
    }

    if (pathname === "/payment-links" && method === "GET") {
      return {
        ...listPaymentLinks(store, params),
      } as T;
    }
    if (pathname.startsWith("/payment-links/export/") && method === "GET") {
      const extension = pathname.split("/").pop() ?? "csv";
      const list = listPaymentLinks(store, params);
      const fields = String(params.fields ?? "").split(",").filter(Boolean);
      const blob = exportFromRows(list.data as unknown as Record<string, unknown>[], fields, extension, "payment-links");
      return blob as T;
    }
    if (pathname === "/payment-links" && method === "POST") {
      ensureRbacPermission(store, "create_payment_link", "forbidden_create_payment_link");
      const payload = data as PaymentDataCreate;
      const paymentProducts = resolvePaymentProducts(store, payload.products ?? []);
      const amount = Number(payload.amount ?? 0);
      const created = updateStore((next) => {
        const id = makeId("link", next);
        const link: PaymentLinkRecord = {
          id,
          title: payload.title,
          description: payload.description,
          currency: payload.currency,
          amount,
          totalAmount: amount,
          products: paymentProducts,
          additionalInfo: payload.additionalInfo,
          afterPaymentMessage: payload.afterPaymentMessage,
          paymentMethods: payload.paymentMethods,
          showConfirmation: payload.showConfirmation ?? true,
          successURL: payload.successURL ?? "",
          errorURL: payload.errorURL ?? "",
          generatePDF: payload.generatePDF ?? false,
          status: "active",
          createdAt: nowIso(),
          link: `/pasarela/paymentLink/${id}`,
        };
        next.paymentLinks.unshift(link);
        return link;
      });
      return created as T;
    }
    if (pathname.match(/^\/payment-links\/[^/]+$/) && method === "GET") {
      const id = pathname.split("/").pop()!;
      const paymentLink = store.paymentLinks.find((item) => item.id === id);
      if (!paymentLink) throw errorResponse(404, "not_found");
      return paymentLink as T;
    }
    if (pathname.match(/^\/payment-links\/[^/]+$/) && method === "PUT") {
      ensureRbacPermission(store, "update_payment_link", "forbidden_update_payment_link");
      const id = pathname.split("/").pop()!;
      const payload = data as { title?: string };
      updateStore((next) => {
        const index = next.paymentLinks.findIndex((item) => item.id === id);
        if (index === -1) throw errorResponse(404, "not_found");
        next.paymentLinks[index] = {
          ...next.paymentLinks[index],
          title: payload.title ?? next.paymentLinks[index].title,
        };
      });
      return getStore().paymentLinks.find((item) => item.id === id) as T;
    }
    if (pathname.match(/^\/payment-links\/[^/]+$/) && method === "POST") {
      const id = pathname.split("/").pop()!;
      updateStore((next) => {
        const link = next.paymentLinks.find((item) => item.id === id);
        if (link) {
          link.status = "paid";
        }
      });
      return { success: true } as T;
    }

    if (pathname.startsWith("/payment-links/pay/") && pathname.endsWith("/transfer") && method === "POST") {
      const paymentId = pathname.split("/")[3];
      const paymentLink = store.paymentLinks.find((item) => item.id === paymentId);
      if (!paymentLink) throw errorResponse(404, "not_found");
      let transferId = "";
      updateStore((next) => {
        const id = makeId("tr", next);
        transferId = id;
        next.transfers.unshift({
          id,
          senderCustomerId: "cust-5",
          senderBusinessId: "cust-5",
          senderBusinessName: "Cliente particular",
          senderEmail: "andres@cliente.demo",
          receiverBusinessId: "demo-business",
          receiverBusinessName: next.user.commercialName,
          receiverEmail: next.user.supportEmail ?? "operaciones@antillapay.demo",
          customerId: "cust-5",
          customerName: "Andres Diaz",
          customerEmail: "andres@cliente.demo",
          createdAt: nowIso(),
          updatedAt: nowIso(),
          deletedAt: null,
          amount: String(paymentLink.amount),
          currency: paymentLink.currency,
          status: "Completed",
        });
        next.user.grossBalance += paymentLink.amount;
        next.user.netBalance += paymentLink.amount;
        const stored = next.paymentLinks.find((item) => item.id === paymentId);
        if (stored) stored.status = "paid";
        upsertWebhooksLog(next, "payment_link.paid", 200, "Delivered");
      });
      return {
        success: true,
        url: "",
        transferId,
      } as T;
    }

    if (pathname.startsWith("/payment-links/pay/") && pathname.endsWith("/payin") && method === "POST") {
      const paymentId = pathname.split("/")[3];
      const paymentLink = store.paymentLinks.find((item) => item.id === paymentId);
      if (!paymentLink) throw errorResponse(404, "not_found");
      const iframeHtml = `
        <html>
          <body style="font-family: sans-serif; display:flex;align-items:center;justify-content:center;height:100vh;background:#f8fafc;color:#0f172a">
            <div style="text-align:center">
              <h2 style="margin-bottom:8px">Pago bancario simulado</h2>
              <p style="margin:0">Cliente: ${String((data as { contactName?: string })?.contactName ?? "Demo")}</p>
              <p style="margin:8px 0 0">Estado: procesando en sandbox</p>
            </div>
          </body>
        </html>`;
      updateStore((next) => {
        const id = makeId("pi", next);
        next.payins.unshift({
          id,
          customerId: "cust-5",
          customerEmail: String((data as { contactEmail?: string })?.contactEmail ?? "demo@antillapay.demo"),
          customerName: String((data as { contactName?: string })?.contactName ?? "Demo Bank"),
          invoiceId: paymentId,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          deletedAt: null,
          amount: String(paymentLink.amount),
          currency: paymentLink.currency,
          status: "Pending",
        });
      });
      return {
        success: true,
        url: `data:text/html;charset=utf-8,${encodeURIComponent(iframeHtml)}`,
        transferId: store.payins[0]?.id ?? makeId("pi", store),
      } as T;
    }

    if (pathname === "/payment-links/pay" && method === "POST") {
      return { success: true } as T;
    }

    if (pathname.match(/^\/payment-links\/(transfer|pay)\/[^/]+\/pdf$/) && method === "GET") {
      const paymentId = pathname.split("/")[3];
      return makePdfBlob(`Payment link ${paymentId}`) as T;
    }

    if (pathname === "/transfers/in" && method === "GET") {
      ensureRbacPermission(store, "view_incoming_transfers", "forbidden_view_incoming_transfers");
      return {
        ...listTransfers(store, params, "in"),
      } as T;
    }
    if (pathname === "/transfers/out" && method === "GET") {
      ensureRbacPermission(store, "view_internal_transfers", "forbidden_view_internal_transfers");
      return {
        ...listTransfers(store, params, "out"),
      } as T;
    }
    if (pathname.startsWith("/transfers/export/") && method === "GET") {
      const parts = pathname.split("/");
      const extension = parts[3] ?? "csv";
      const way = (parts[4] as "in" | "out") ?? "in";
      const list = listTransfers(store, params, way);
      const fields = String(params.fields ?? "").split(",").filter(Boolean);
      const blob = exportFromRows(list.data as unknown as Record<string, unknown>[], fields, extension, "transfers");
      return blob as T;
    }
    if (pathname === "/transfers" && method === "POST") {
      ensureRbacPermission(store, "create_internal_transfer", "forbidden_create_internal_transfer");
      const payload = data as { businessEmail?: string; amount?: number };
      const amount = Number(payload?.amount ?? 0);
      updateStore((next) => {
        next.transfers.unshift({
          id: makeId("tr", next),
          senderCustomerId: undefined,
          senderBusinessId: "demo-business",
          senderBusinessName: next.user.commercialName,
          senderEmail: next.user.supportEmail,
          receiverBusinessId: "external-business",
          receiverBusinessName: String(payload?.businessEmail ?? "External business"),
          receiverEmail: String(payload?.businessEmail ?? "external@demo.local"),
          customerId: "cust-5",
          customerName: "Andrés Díaz",
          customerEmail: "andres@cliente.demo",
          createdAt: nowIso(),
          updatedAt: nowIso(),
          deletedAt: null,
          amount: String(amount),
          currency: "USD",
          status: "Completed",
        });
        next.user.grossBalance = Math.max(0, next.user.grossBalance - amount);
        next.user.netBalance = Math.max(0, next.user.netBalance - amount);
      });
      return { success: true, data: { ok: true }, pagination: { total: store.transfers.length, pages: 1, page: 1, limit: 10 } } as T;
    }

    if (pathname === "/payins" && method === "GET") {
      return {
        ...listPayins(store, params),
      } as T;
    }
    if (pathname.startsWith("/payins/export/") && method === "GET") {
      const extension = pathname.split("/").pop() ?? "csv";
      const list = listPayins(store, params);
      const fields = String(params.fields ?? "").split(",").filter(Boolean);
      const blob = exportFromRows(list.data as unknown as Record<string, unknown>[], fields, extension, "payins");
      return blob as T;
    }

    if (pathname === "/third-party-payments" && method === "GET") {
      ensureRbacPermission(store, "view_third_party_payments", "forbidden_view_third_party_payments");
      return {
        ...listThirdPartyPayments(store, params),
      } as T;
    }
    if (pathname.startsWith("/third-party-payments/export/") && method === "GET") {
      const extension = pathname.split("/").pop() ?? "csv";
      const list = listThirdPartyPayments(store, params);
      const fields = String(params.fields ?? "").split(",").filter(Boolean);
      const blob = exportFromRows(
        list.data as unknown as Record<string, unknown>[],
        fields,
        extension,
        "third-party-payments"
      );
      return blob as T;
    }
    if (pathname === "/third-party-payments" && method === "POST") {
      ensureRbacPermission(store, "create_third_party_payment", "forbidden_create_third_party_payment");
      const payload = data as {
        beneficiaryName?: string;
        beneficiaryEmail?: string;
        bankName?: string;
        accountNumber?: string;
        reference?: string;
        amount?: number;
      };
      const amount = Number(payload?.amount ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        throw errorResponse(400, "invalid_amount");
      }
      updateStore((next) => {
        next.thirdPartyPayments.unshift({
          id: makeId("tpp", next),
          beneficiaryName: String(payload?.beneficiaryName ?? "Beneficiario externo"),
          beneficiaryEmail: String(payload?.beneficiaryEmail ?? "pagos@externo.demo"),
          bankName: String(payload?.bankName ?? "Banco externo"),
          accountNumber: String(payload?.accountNumber ?? "000000000000"),
          reference: String(payload?.reference ?? makeId("ref", next)),
          amount: String(amount),
          currency: "USD",
          status: "Pending",
          createdAt: nowIso(),
        });
        next.user.grossBalance = Math.max(0, next.user.grossBalance - amount);
        next.user.netBalance = Math.max(0, next.user.netBalance - amount);
      });
      return { success: true } as T;
    }

    if (pathname === "/webhooks" && method === "POST") {
      ensureRbacPermission(store, "manage_webhooks", "forbidden_manage_webhooks");
      const payload = data as { eventId?: string; endpoint?: string; method?: "POST" | "GET" | "PUT"; body?: Record<string, unknown> };
      const eventId = String(payload?.eventId ?? "");
      updateStore((next) => {
        next.webhooks.unshift({
          id: makeId("wh", next),
          eventId,
          endpoint: String(payload?.endpoint ?? ""),
          method: payload?.method ?? "POST",
          body: payload?.body ?? {},
        });
        upsertWebhooksLog(next, next.webhookEvents.find((event) => event.id === eventId)?.name ?? "payment_link.created", 201, "Created");
      });
      return { success: true } as T;
    }
    if (pathname.match(/^\/webhooks\/[^/]+$/) && method === "PUT") {
      ensureRbacPermission(store, "manage_webhooks", "forbidden_manage_webhooks");
      const id = pathname.split("/").pop()!;
      const payload = data as { endpoint?: string; method?: "POST" | "GET" | "PUT"; body?: Record<string, unknown> };
      updateStore((next) => {
        const index = next.webhooks.findIndex((item) => item.id === id);
        if (index !== -1) {
          next.webhooks[index] = {
            ...next.webhooks[index],
            endpoint: payload?.endpoint ?? next.webhooks[index].endpoint,
            method: payload?.method ?? next.webhooks[index].method,
            body: payload?.body ?? next.webhooks[index].body,
          };
        }
      });
      return { success: true } as T;
    }
    if (pathname === "/events" && method === "GET") {
      ensureRbacPermission(store, "view_webhooks", "forbidden_view_webhooks");
      return store.webhookEvents as T;
    }
    if (pathname.match(/^\/events\/[^/]+\/webhooks$/) && method === "GET") {
      ensureRbacPermission(store, "view_webhooks", "forbidden_view_webhooks");
      const eventId = pathname.split("/")[2];
      const webhook = store.webhooks.find((item) => item.eventId === eventId);
      if (!webhook) throw errorResponse(404, "not_found");
      return webhook as T;
    }
    if (pathname === "/events-registers" && method === "GET") {
      ensureRbacPermission(store, "view_webhook_logs", "forbidden_view_webhook_logs");
      const status = getParam(params, "status");
      const eventName = getParam(params, "eventName");
      const filtered = store.webhookLogs.filter((item) => {
        const matchesStatus =
          !status ||
          (status === "success"
            ? item.responseStatus >= 200 && item.responseStatus < 300
            : item.responseStatus >= 400);
        const matchesEvent = !eventName || item.eventName === eventName;
        return matchesStatus && matchesEvent;
      });
      return filtered as T;
    }

    if (pathname === "/payment-links/pay" && method === "POST") {
      return { success: true } as T;
    }

    throw errorResponse(404, `Route not mocked: ${method} ${pathname}`);
  }
}

const API = new MockApi();

export const setAxiosEnvironment = (_environment: "production" | "sandbox") => {
  return undefined;
};

export default API;
