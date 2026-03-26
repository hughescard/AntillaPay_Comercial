'use client';

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, Loader2, X } from "lucide-react";
import { useModalShortcuts } from "@/common/hooks/useModalShortcuts";

interface NewThirdPartyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number;
  onCreate: (data: {
    beneficiaryName: string;
    beneficiaryEmail: string;
    bankName: string;
    accountNumber: string;
    reference: string;
    amount: number;
  }) => Promise<{ success: boolean; message?: string }>;
}

export const NewThirdPartyPaymentModal = ({
  isOpen,
  onClose,
  availableAmount,
  onCreate,
}: NewThirdPartyPaymentModalProps) => {
  const { t } = useTranslation();
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const parsedAmount = Number(amount);
  const isFormValid = useMemo(
    () =>
      beneficiaryName.trim().length > 0 &&
      emailRegex.test(beneficiaryEmail.trim()) &&
      bankName.trim().length > 0 &&
      accountNumber.trim().length > 0 &&
      reference.trim().length > 0 &&
      Number.isFinite(parsedAmount) &&
      parsedAmount > 0 &&
      parsedAmount <= availableAmount &&
      !loading,
    [
      beneficiaryName,
      beneficiaryEmail,
      bankName,
      accountNumber,
      reference,
      parsedAmount,
      availableAmount,
      loading,
    ]
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setBeneficiaryName("");
      setBeneficiaryEmail("");
      setBankName("");
      setAccountNumber("");
      setReference("");
      setAmount("");
      setError("");
      return;
    }
    setIsVisible(false);
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    setIsVisible(false);
    const timer = setTimeout(() => {
      onClose();
    }, 200);
    return () => clearTimeout(timer);
  };

  const handleCreate = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError("");
    try {
      const response = await onCreate({
        beneficiaryName: beneficiaryName.trim(),
        beneficiaryEmail: beneficiaryEmail.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        reference: reference.trim(),
        amount: parsedAmount,
      });
      if (response.success) {
        handleClose();
        return;
      }
      setError(response.message ?? t("thirdPartyPayments.create.errors.generic"));
    } catch {
      setError(t("thirdPartyPayments.create.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  useModalShortcuts(isOpen, handleClose, handleCreate, isFormValid);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between p-6 pb-2">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t("thirdPartyPayments.create.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("thirdPartyPayments.create.description")}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <Field
            label={t("thirdPartyPayments.create.beneficiaryName")}
            value={beneficiaryName}
            onChange={setBeneficiaryName}
          />
          <Field
            label={t("thirdPartyPayments.create.beneficiaryEmail")}
            value={beneficiaryEmail}
            onChange={setBeneficiaryEmail}
            type="email"
          />
          <Field
            label={t("thirdPartyPayments.create.bankName")}
            value={bankName}
            onChange={setBankName}
          />
          <Field
            label={t("thirdPartyPayments.create.accountNumber")}
            value={accountNumber}
            onChange={setAccountNumber}
          />
          <Field
            label={t("thirdPartyPayments.create.reference")}
            value={reference}
            onChange={setReference}
          />
          <Field
            label={t("thirdPartyPayments.create.amount")}
            value={amount}
            onChange={setAmount}
            type="number"
          />
        </div>

        <div className="space-y-3 px-6 pb-4">
          <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              {t("thirdPartyPayments.create.walletSource")}:{" "}
              {t("thirdPartyPayments.create.walletSourceValue")}
            </p>
            <p className="mt-1">
              {t("modals.withdraw.max_available", {
                amount: availableAmount.toFixed(2),
              })}
            </p>
            <p className="mt-2">{t("thirdPartyPayments.create.helper")}</p>
          </div>

          {error ? (
            <div className="flex items-center gap-2 text-xs text-danger">
              <Info size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-border p-6 pt-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleCreate}
            disabled={!isFormValid}
            className={`flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors ${
              !isFormValid ? "cursor-not-allowed opacity-50" : "hover:bg-accent-hover"
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {t("thirdPartyPayments.create.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "number";
}) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-foreground">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/30"
    />
  </div>
);
