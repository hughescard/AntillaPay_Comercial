import { Home, Wallet, Banknote, ArrowRightLeft, Users, Package, Grid2x2, HandCoins } from 'lucide-react';

export const navItems = [
  { label: 'nav.home', href: '/', icon: Home, permission: 'view_dashboard' },
  { label: 'nav.balances', href: '/balances', icon: Banknote, permission: 'view_balance' },
  { label: 'nav.payments', href: '/payments', icon: HandCoins, permission: 'view_third_party_payments' },
  { label: 'nav.transactions', href: '/transactions', icon: ArrowRightLeft, permission: 'view_payments' },
  { label: 'nav.customers', href: '/clients', icon: Users, permission: 'view_customers' },
  { label: 'nav.products', href: '/products', icon: Package, permission: 'view_products' },
] as const;

export const collectionsSubItems = [
  { label: 'nav.paymentLink', href: '/paymentLink', icon: null, permission: 'view_payment_links' },
] as const;

export const transfersSubItems = [
  { label: 'nav.balanceTransfer', href: '/transactionsOut', icon: null, permission: 'view_internal_transfers' },
] as const;

export const paymentsSubItems = [
  { label: 'nav.thirdPartyPayment', href: '/payments/create', icon: null, permission: 'create_third_party_payment' },
] as const;

export const productsMenus = [
  { label: 'nav.payments', icon: HandCoins, subItems: paymentsSubItems },
  { label: 'nav.collections', icon: ArrowRightLeft, subItems: collectionsSubItems },
  { label: 'nav.transfersMenu', icon: Wallet, subItems: transfersSubItems },
] as const;

export const legacyPaySubItems = [
  { label: 'nav.transactionsOut', href: '/transactionsOut', icon: null, permission: 'view_internal_transfers' },
] as const ;

export const developersSubItems = [
  { label: 'nav.webhooks', href: '/dashboard/developers/webhooks', icon: null, permission: 'view_webhooks' },
  { label: 'nav.logs', href: '/dashboard/developers/logs', icon: null, permission: 'view_webhook_logs' },
  { label: 'nav.docs', href: '/dashboard/developers/docs', icon: null, permission: 'view_developer_docs' },
  { label: 'nav.apiKeys', href: '/dashboard/developers/keys', icon: null, permission: 'view_api_keys' },
] as const;

export const developersMenus = [
  { label: 'nav.developers', icon: Grid2x2, subItems: developersSubItems },
] as const;
