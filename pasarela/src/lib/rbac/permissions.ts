export const PERMISSIONS_BY_MODULE = {
  dashboard: [
    "view_dashboard",
  ],
  wallet: [
    "view_balance",
    "view_payouts",
    "view_bank_accounts",
    "manage_bank_accounts",
    "withdraw_funds",
  ],
  payments: [
    "view_payments",
    "export_payments",
    "view_incoming_transfers",
    "export_incoming_transfers",
  ],
  payment_links: [
    "view_payment_links",
    "view_payment_link_details",
    "create_payment_link",
    "update_payment_link",
    "delete_payment_link",
    "export_payment_links",
  ],
  internal_transfers: [
    "view_internal_transfers",
    "view_internal_transfer_details",
    "create_internal_transfer",
    "export_internal_transfers",
  ],
  third_party_payments: [
    "view_third_party_payments",
    "view_third_party_payment_details",
    "view_third_party_payment_audit",
    "create_third_party_payment",
    "update_third_party_payment",
    "submit_third_party_payment",
    "attach_payment_documents",
    "approve_third_party_payment",
    "reject_third_party_payment",
    "cancel_third_party_payment",
    "execute_third_party_payment",
    "export_third_party_payments",
  ],
  beneficiaries: [
    "view_beneficiaries",
    "manage_beneficiaries",
    "create_beneficiary",
    "update_beneficiary",
    "delete_beneficiary",
  ],
  customers: [
    "view_customers",
    "view_customer_details",
    "view_customer_history",
    "export_customers",
    "export_customer_history",
  ],
  products: [
    "view_products",
    "view_product_details",
    "create_product",
    "update_product",
    "update_product_status",
    "delete_product",
    "export_products",
  ],
  developers: [
    "view_developer_docs",
    "view_api_keys",
    "manage_api_keys",
    "view_webhooks",
    "manage_webhooks",
    "view_webhook_logs",
  ],
  settings: [
    "view_account_information",
    "view_account_configuration",
    "view_account_verification_status",
    "manage_account_configuration",
    "submit_account_verification",
    "switch_operating_environment",
  ],
  users: [
    "view_users",
    "create_user",
    "update_user",
    "delete_user",
    "assign_roles",
    "manage_role_permissions",
  ],
} as const;

export type PermissionModule = keyof typeof PERMISSIONS_BY_MODULE;

type GroupValues<T> = T[keyof T];
type PermissionArray = GroupValues<typeof PERMISSIONS_BY_MODULE>;

export type Permission = PermissionArray[number];

export type PermissionDefinition = {
  code: Permission;
  module: PermissionModule;
  description: string;
};

const permissionDescriptions: Record<Permission, string> = {
  view_dashboard: "Access the dashboard overview and KPIs.",
  view_balance: "View wallet balances and summary values.",
  view_payouts: "View wallet payout history.",
  view_bank_accounts: "View registered bank accounts for withdrawals.",
  manage_bank_accounts: "Create and manage bank accounts used for withdrawals.",
  withdraw_funds: "Initiate withdrawals from the wallet.",
  view_payments: "View collections and incoming payment activity.",
  export_payments: "Export collections and payment reports.",
  view_incoming_transfers: "View inbound wallet transfers tied to collections.",
  export_incoming_transfers: "Export inbound transfer data.",
  view_payment_links: "View payment links list.",
  view_payment_link_details: "View payment link detail pages.",
  create_payment_link: "Create payment links.",
  update_payment_link: "Update existing payment links.",
  delete_payment_link: "Delete payment links.",
  export_payment_links: "Export payment links data.",
  view_internal_transfers: "View internal wallet-to-wallet transfers.",
  view_internal_transfer_details: "View internal transfer details.",
  create_internal_transfer: "Create internal wallet transfers.",
  export_internal_transfers: "Export internal transfer data.",
  view_third_party_payments: "View third party payouts.",
  view_third_party_payment_details: "View third party payout details.",
  view_third_party_payment_audit: "View third party payout audit timeline and approval trail.",
  create_third_party_payment: "Create third party payouts.",
  update_third_party_payment: "Update draft or rejected third party payouts.",
  submit_third_party_payment: "Submit third party payouts for approval.",
  attach_payment_documents: "Attach or remove supporting documents from third party payouts.",
  approve_third_party_payment: "Approve third party payouts in checker workflow.",
  reject_third_party_payment: "Reject third party payouts in checker workflow.",
  cancel_third_party_payment: "Cancel third party payout requests.",
  execute_third_party_payment: "Execute approved third party payouts.",
  export_third_party_payments: "Export third party payout data.",
  view_beneficiaries: "View payout beneficiaries.",
  manage_beneficiaries: "Manage payout beneficiaries lifecycle.",
  create_beneficiary: "Create payout beneficiaries.",
  update_beneficiary: "Update payout beneficiaries.",
  delete_beneficiary: "Delete payout beneficiaries.",
  view_customers: "View customers list.",
  view_customer_details: "View customer profiles.",
  view_customer_history: "View customer transaction history.",
  export_customers: "Export customer lists.",
  export_customer_history: "Export customer history.",
  view_products: "View product catalog.",
  view_product_details: "View product detail pages.",
  create_product: "Create products.",
  update_product: "Update products.",
  update_product_status: "Change product status.",
  delete_product: "Delete products.",
  export_products: "Export products data.",
  view_developer_docs: "View developer documentation.",
  view_api_keys: "View API keys pages and metadata.",
  manage_api_keys: "Reveal or regenerate API keys.",
  view_webhooks: "View webhooks configuration.",
  manage_webhooks: "Create and update webhook configuration.",
  view_webhook_logs: "View webhook delivery logs.",
  view_account_information: "View account information and profile data.",
  view_account_configuration: "View configurable account settings.",
  view_account_verification_status: "View account verification and onboarding status.",
  manage_account_configuration: "Update account configuration and onboarding data.",
  submit_account_verification: "Submit account verification for review.",
  switch_operating_environment: "Switch between sandbox and production environments.",
  view_users: "View account users and memberships.",
  create_user: "Create users under the account.",
  update_user: "Update users under the account.",
  delete_user: "Delete or deactivate account users.",
  assign_roles: "Assign roles to users.",
  manage_role_permissions: "Manage the permissions attached to roles.",
};

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = (
  Object.entries(PERMISSIONS_BY_MODULE) as [PermissionModule, readonly Permission[]][]
).flatMap(([module, permissions]) =>
  permissions.map((code) => ({
    code,
    module,
    description: permissionDescriptions[code],
  }))
);

export const ALL_PERMISSIONS = PERMISSION_DEFINITIONS.map(
  (permission) => permission.code
) as Permission[];

export const RBAC_PERMISSION_GROUPS = Object.entries(PERMISSIONS_BY_MODULE).map(
  ([module, permissions]) => ({
    module: module as PermissionModule,
    permissions: [...permissions],
  })
);
