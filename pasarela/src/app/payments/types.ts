import type { RoleId } from "@/lib/rbac";

export type PaymentStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Processing"
  | "Completed"
  | "Failed"
  | "Rejected"
  | "Cancelled";

export type PaymentRole = RoleId;

export type PaymentActor = {
  id: string;
  name: string;
  email: string;
  role: PaymentRole;
  roles: PaymentRole[];
};

export type Beneficiary = {
  id: string;
  name: string;
  email: string;
  country: string;
  bank: string;
  accountNumber: string;
  accountType: "Checking" | "Savings";
  swiftIban: string;
};

export type ApprovalRule = {
  id: string;
  amountThresholdMinor: number;
  currency: "USD";
  validatorUserIds: string[];
  lastUpdated: string;
  lastUpdatedByName: string;
};

export type ProcessorId = "tropipay" | "b89" | "ducapp";

export type ProcessorOption = {
  id: ProcessorId;
  name: string;
  estimatedFeeMinor: number;
  estimatedDelivery: string;
  description: string;
};

export type PaymentAttachment = {
  id: string;
  name: string;
  mimeType: string;
  sizeLabel: string;
  uploadedAt: string;
};

export type PaymentTimelineItem = {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  note?: string;
  tone?: "default" | "success" | "warning" | "danger";
};

export type EnterprisePayment = {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  bank: string;
  country: string;
  accountNumber: string;
  accountType: "Checking" | "Savings";
  swiftIban: string;
  amountMinor: number;
  currency: "USD" | "EUR";
  description: string;
  reference: string;
  invoiceNumber: string;
  executionDate: string;
  processor: ProcessorId;
  estimatedFeeMinor: number;
  estimatedDelivery: string;
  attachments: PaymentAttachment[];
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
  timeline: PaymentTimelineItem[];
};

export type PaymentFilters = {
  query: string;
  status: PaymentStatus | "all";
  dateRange: "7d" | "30d" | "90d" | "all";
  minAmount: string;
  maxAmount: string;
  currency: "all" | "USD" | "EUR";
  createdBy: string;
  reviewedBy: string;
};

export type PaymentDraftInput = {
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  country: string;
  bank: string;
  accountNumber: string;
  accountType: "Checking" | "Savings";
  swiftIban: string;
  amountMinor: number;
  currency: "USD" | "EUR";
  description: string;
  reference: string;
  invoiceNumber: string;
  executionDate: string;
  processor: ProcessorId;
  estimatedFeeMinor: number;
  estimatedDelivery: string;
  attachments: PaymentAttachment[];
};

export type PaymentsWorkspace = {
  walletAvailableMinor: number;
  approvalConfigurationEnabled: boolean;
  beneficiaries: Beneficiary[];
  approvalRules: ApprovalRule[];
  payments: EnterprisePayment[];
};
