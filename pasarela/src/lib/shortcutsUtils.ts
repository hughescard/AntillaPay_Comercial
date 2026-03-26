
export interface ShortcutItem {
  label:
    | 'nav.home'
    | 'nav.balances'
    | 'nav.customers'
    | 'nav.transactions'
    | 'nav.products'
    | 'nav.paymentLink'
    | 'nav.payments'
    | 'nav.test_env'
    | 'nav.new_business'
    | 'nav.exit_test_env'
    | 'nav.transactionsOut'
    | 'nav.developers'
    | 'nav.webhooks'
    | 'nav.logs'
    | 'nav.docs'
    | 'nav.apiKeys';
  href: string;
}

export const SHORTCUTS_EVENTS = {
  UPDATED: 'shortcuts_updated',
};

export const addToRecentLinks = (item: ShortcutItem) => {
  if (typeof window === 'undefined') return;

  const currentSession = sessionStorage.getItem('recentLinks');
  let items: ShortcutItem[] = currentSession ? JSON.parse(currentSession) : [];

  items = items.filter((i) => i.href !== item.href);
  items.unshift(item);

  if (items.length > 10) items = items.slice(0, 10);

  sessionStorage.setItem('recentLinks', JSON.stringify(items));
  
  window.dispatchEvent(new Event(SHORTCUTS_EVENTS.UPDATED));
};