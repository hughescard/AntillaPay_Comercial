export type AccountAuditAction =
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "approval_configuration_toggled"
  | "approval_rule_created"
  | "approval_rule_updated"
  | "approval_rule_deleted";

export type AccountAuditEntry = {
  id: string;
  action: AccountAuditAction;
  actorName: string;
  actorId: string;
  targetName?: string;
  description: string;
  timestamp: string;
};

const ACCOUNT_AUDIT_KEY = "pasarela_account_audit_v1";

const makeId = () => `audit-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

export const loadAccountAuditEntries = (): AccountAuditEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(ACCOUNT_AUDIT_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as AccountAuditEntry[];
  } catch {
    return [];
  }
};

export const saveAccountAuditEntries = (entries: AccountAuditEntry[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_AUDIT_KEY, JSON.stringify(entries));
};

export const appendAccountAuditEntry = (
  entry: Omit<AccountAuditEntry, "id" | "timestamp">
) => {
  const nextEntries = [
    {
      ...entry,
      id: makeId(),
      timestamp: new Date().toISOString(),
    },
    ...loadAccountAuditEntries(),
  ];

  saveAccountAuditEntries(nextEntries);
  return nextEntries;
};
