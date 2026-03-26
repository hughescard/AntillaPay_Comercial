import { useCallback, useEffect, useState } from "react";
import API from "@/lib/api";
import { currency, type PaymentPreviewData, type SelectedProduct } from "../create/types";

type PaymentLinkPayload = {
  id?: string;
  title?: string;
  description?: string;
  currency?: string;
  amount?: number;
  products?: SelectedProduct[];
  additionalInfo?: string;
  afterPaymentMessage?: string;
  paymentMethods?: {
    transfer?: boolean;
    balance?: boolean;
  };
  showConfirmation?: boolean;
  successURL?: string;
  errorURL?: string;
  generatePDF?: boolean;
  status?: string;
};

type PaymentLinkResponse = PaymentLinkPayload | { data: PaymentLinkPayload } | null;

const normalizePayload = (
  payload: PaymentLinkResponse
): PaymentLinkPayload | null => {
  if (!payload) return null;
  if ((payload as { data?: PaymentLinkPayload }).data) {
    return (payload as { data: PaymentLinkPayload }).data;
  }
  return payload as PaymentLinkPayload;
};

const toPreviewData = (payload: PaymentLinkPayload): PaymentPreviewData => ({
  title: payload.title ?? "",
  description: payload.description ?? "",
  currency: payload.currency ?? currency[0]?.value ?? "USD",
  amount: Number.isFinite(Number(payload.amount)) ? Number(payload.amount) / 100 : 0,
  products: payload.products ?? [],
  additionalInfoEnabled: Boolean(payload.additionalInfo),
  additionalInfo: payload.additionalInfo ?? "",
  paymentMethods: (() => {
    const fallback = { transfer: true, balance: true };
    const methods = payload.paymentMethods ?? fallback;
    const resolved = {
      transfer: methods.transfer ?? fallback.transfer,
      balance: methods.balance ?? fallback.balance,
    };
    if (!resolved.transfer && !resolved.balance) {
      return fallback;
    }
    return resolved;
  })(),
  replaceMessageEnabled: Boolean(payload.afterPaymentMessage),
  replaceMessage: payload.afterPaymentMessage ?? "",
  generatePDF: Boolean(payload.generatePDF),
  successURL: payload.successURL ?? "",
  errorURL: payload.errorURL ?? "",
});

export const usePaymentLink = (id?: string) => {
  const [previewData, setPreviewData] = useState<PaymentPreviewData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentLink = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.get<PaymentLinkResponse>(`/payment-links/${id}`);
      const payload = normalizePayload(response.data);
      if (!payload) {
        setPreviewData(null);
        setShowConfirmation(true);
        setStatus(null);
        setError("Failed to load payment link.");
        return;
      }
      setPreviewData(toPreviewData(payload));
      setShowConfirmation(payload.showConfirmation ?? true);
      setStatus(payload.status ?? null);
    } catch (err) {
      setError("Failed to load payment link.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPaymentLink();
  }, [fetchPaymentLink]);

  return {
    previewData,
    showConfirmation,
    status,
    isLoading,
    error,
    refetch: fetchPaymentLink,
  };
};

export const usePayPaymentLink = () => {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = useCallback(async (id: string) => {
    setIsPaying(true);
    setError(null);
    try {
      const response = await API.post(`/payment-links/${id}`);
      return response.data;
    } catch (err) {
      setError("Failed to process payment.");
      throw err;
    } finally {
      setIsPaying(false);
    }
  }, []);

  return { pay, isPaying, error };
};
