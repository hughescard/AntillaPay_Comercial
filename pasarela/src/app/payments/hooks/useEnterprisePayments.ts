'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  approvePayment,
  cancelPayment,
  createBeneficiary,
  deleteBeneficiary,
  deleteApprovalRule,
  executePayment,
  exportPaymentsToCsv,
  filterPayments,
  getPaymentById,
  getSortedApprovalRules,
  loadPaymentsWorkspace,
  paginatePayments,
  rejectPayment,
  runScheduledPaymentExecutions,
  saveDraftPayment,
  setApprovalConfigurationEnabled,
  submitPaymentForApproval,
  updateBeneficiary,
  upsertApprovalRule,
} from "../lib/paymentsWorkspace";
import type {
  Beneficiary,
  PaymentActor,
  PaymentDraftInput,
  PaymentFilters,
  PaymentsWorkspace,
} from "../types";

export const DEFAULT_PAYMENT_FILTERS: PaymentFilters = {
  query: "",
  status: "all",
  dateRange: "30d",
  minAmount: "",
  maxAmount: "",
  currency: "all",
  createdBy: "",
  reviewedBy: "",
};

export const useEnterprisePayments = () => {
  const [workspace, setWorkspace] = useState<PaymentsWorkspace>(loadPaymentsWorkspace());

  const refresh = useCallback(() => {
    const nextWorkspace = runScheduledPaymentExecutions(loadPaymentsWorkspace());
    setWorkspace(nextWorkspace);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const listPayments = useCallback(
    (filters: PaymentFilters, page = 1) => {
      const filtered = filterPayments(workspace.payments, filters);
      return paginatePayments(filtered, page, 10);
    },
    [workspace.payments]
  );

  const exportPayments = useCallback((filters: PaymentFilters) => {
    const filtered = filterPayments(workspace.payments, filters);
    const csv = exportPaymentsToCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `third-party-payments-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [workspace.payments]);

  const getPayment = useCallback(
    (paymentId: string) => getPaymentById(workspace, paymentId),
    [workspace]
  );

  const addBeneficiary = useCallback((beneficiary: Omit<Beneficiary, "id">, actor: PaymentActor) => {
    const created = createBeneficiary(workspace, beneficiary, actor);
    refresh();
    return created;
  }, [workspace, refresh]);

  const editBeneficiary = useCallback((beneficiaryId: string, beneficiary: Omit<Beneficiary, "id">, actor: PaymentActor) => {
    const updated = updateBeneficiary(workspace, beneficiaryId, beneficiary, actor);
    refresh();
    return updated;
  }, [workspace, refresh]);

  const removeBeneficiary = useCallback((beneficiaryId: string, actor: PaymentActor) => {
    const removedId = deleteBeneficiary(workspace, beneficiaryId, actor);
    refresh();
    return removedId;
  }, [workspace, refresh]);

  const saveApprovalRule = useCallback(
    (
      input: { amountThresholdMinor: number; validatorUserIds: string[] },
      actor: PaymentActor,
      ruleId?: string
    ) => {
      const rule = upsertApprovalRule(workspace, input, actor, ruleId);
      refresh();
      return rule;
    },
    [workspace, refresh]
  );

  const removeApprovalRule = useCallback(
    (ruleId: string, actor: PaymentActor) => {
      const rules = deleteApprovalRule(workspace, ruleId, actor);
      refresh();
      return rules;
    },
    [workspace, refresh]
  );

  const setApprovalConfiguration = useCallback(
    (enabled: boolean, actor: PaymentActor) => {
      const nextState = setApprovalConfigurationEnabled(workspace, enabled, actor);
      refresh();
      return nextState;
    },
    [workspace, refresh]
  );

  const saveDraft = useCallback(
    (input: PaymentDraftInput, actor: PaymentActor, paymentId?: string) => {
      const payment = saveDraftPayment(workspace, input, actor, paymentId);
      refresh();
      return payment;
    },
    [workspace, refresh]
  );

  const submitForApproval = useCallback(
    (input: PaymentDraftInput, actor: PaymentActor, paymentId?: string) => {
      const payment = submitPaymentForApproval(workspace, input, actor, paymentId);
      refresh();
      return payment;
    },
    [workspace, refresh]
  );

  const approve = useCallback(
    (paymentId: string, actor: PaymentActor) => {
      const result = approvePayment(workspace, paymentId, actor);
      refresh();
      return result;
    },
    [workspace, refresh]
  );

  const reject = useCallback(
    (paymentId: string, actor: PaymentActor, reason: string) => {
      const result = rejectPayment(workspace, paymentId, actor, reason);
      refresh();
      return result;
    },
    [workspace, refresh]
  );

  const cancel = useCallback(
    (paymentId: string, actor: PaymentActor) => {
      const result = cancelPayment(workspace, paymentId, actor);
      refresh();
      return result;
    },
    [workspace, refresh]
  );

  const execute = useCallback(
    (paymentId: string, actor: PaymentActor) => {
      const result = executePayment(workspace, paymentId, actor);
      refresh();
      return result;
    },
    [workspace, refresh]
  );

  const summary = useMemo(() => {
    const pendingApproval = workspace.payments.filter(
      (payment) => payment.status === "Pending Approval"
    ).length;
    const processing = workspace.payments.filter(
      (payment) => payment.status === "Processing"
    ).length;
    return {
      walletAvailableMinor: workspace.walletAvailableMinor,
      pendingApproval,
      processing,
      beneficiaries: workspace.beneficiaries.length,
    };
  }, [workspace]);

  return {
    workspace,
    approvalConfigurationEnabled: workspace.approvalConfigurationEnabled,
    beneficiaries: workspace.beneficiaries,
    approvalRules: getSortedApprovalRules(workspace.approvalRules),
    payments: workspace.payments,
    summary,
    listPayments,
    exportPayments,
    getPayment,
    addBeneficiary,
    editBeneficiary,
    removeBeneficiary,
    saveApprovalRule,
    removeApprovalRule,
    setApprovalConfiguration,
    saveDraft,
    submitForApproval,
    approve,
    reject,
    cancel,
    execute,
    refresh,
  };
};
