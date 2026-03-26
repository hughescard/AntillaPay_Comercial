import type { Permission } from "./permissions";
import { normalizeAppPathname } from "./normalizePathname";

type RoutePermissionRule = {
  matcher: RegExp;
  anyOf: Permission[];
};

export const PUBLIC_RBAC_ROUTES = [
  /^\/signin$/,
  /^\/register$/,
  /^\/forgot_password$/,
  /^\/invoice\/.+$/,
  /^\/invoice\/detail$/,
  /^\/paymentLink\/[^/]+$/,
  /^\/paymentLink\/detail$/,
] as const;

export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
  { matcher: /^\/$/, anyOf: ["view_dashboard"] },
  { matcher: /^\/balances$/, anyOf: ["view_balance"] },
  { matcher: /^\/payments$/, anyOf: ["view_third_party_payments"] },
  { matcher: /^\/payments\/create$/, anyOf: ["create_third_party_payment", "update_third_party_payment"] },
  { matcher: /^\/payments\/detail$/, anyOf: ["view_third_party_payment_details"] },
  { matcher: /^\/payments\/[^/]+$/, anyOf: ["view_third_party_payment_details"] },
  { matcher: /^\/paymentLink$/, anyOf: ["view_payment_links"] },
  { matcher: /^\/paymentLink\/create$/, anyOf: ["create_payment_link"] },
  { matcher: /^\/products\/detail$/, anyOf: ["view_product_details"] },
  { matcher: /^\/products$/, anyOf: ["view_products"] },
  { matcher: /^\/products\/[^/]+$/, anyOf: ["view_product_details"] },
  { matcher: /^\/transactions$/, anyOf: ["view_payments", "view_incoming_transfers"] },
  { matcher: /^\/transactionsOut$/, anyOf: ["view_internal_transfers"] },
  { matcher: /^\/clients$/, anyOf: ["view_customers"] },
  { matcher: /^\/clients\/detail$/, anyOf: ["view_customer_details"] },
  { matcher: /^\/clients\/[^/]+$/, anyOf: ["view_customer_details"] },
  { matcher: /^\/dashboard\/developers\/docs$/, anyOf: ["view_developer_docs"] },
  { matcher: /^\/dashboard\/developers\/keys$/, anyOf: ["view_api_keys"] },
  { matcher: /^\/dashboard\/developers\/logs$/, anyOf: ["view_webhook_logs"] },
  { matcher: /^\/dashboard\/developers\/webhooks$/, anyOf: ["view_webhooks"] },
  { matcher: /^\/profile$/, anyOf: ["view_account_configuration", "manage_account_configuration"] },
  { matcher: /^\/userInfo$/, anyOf: ["view_account_information"] },
];

export const isPublicRbacRoute = (pathname: string) =>
  PUBLIC_RBAC_ROUTES.some((rule) => rule.test(normalizeAppPathname(pathname)));

export const getRoutePermissions = (pathname: string) =>
  ROUTE_PERMISSION_RULES.find((rule) => rule.matcher.test(normalizeAppPathname(pathname)))?.anyOf ?? null;
