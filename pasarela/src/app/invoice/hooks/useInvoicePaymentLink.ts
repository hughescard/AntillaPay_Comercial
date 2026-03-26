import { useCallback, useEffect, useState } from "react";
import API from "@/lib/api";
import { currency, type PaymentPreviewData, type SelectedProduct } from "@/app/paymentLink/create/types";

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
  amount: payload.amount ?? 0,
  products: payload.products ?? [],
  additionalInfoEnabled: Boolean(payload.additionalInfo),
  additionalInfo: payload.additionalInfo ?? "",
  paymentMethods: {
    transfer: payload.paymentMethods?.transfer ?? true,
    balance: payload.paymentMethods?.balance ?? true,
  },
  replaceMessageEnabled: Boolean(payload.afterPaymentMessage),
  replaceMessage: payload.afterPaymentMessage ?? "",
  generatePDF: Boolean(payload.generatePDF),
  successURL: payload.successURL ?? "",
  errorURL: payload.errorURL ?? "",
});

export const useInvoicePaymentLink = (id?: string) => {
  const [previewData, setPreviewData] = useState<PaymentPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoicePaymentLink = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.get<PaymentLinkResponse>(`/payment-links/${id}`);
      const payload = normalizePayload(response.data);

      if (!payload) {
        setPreviewData(null);
        setError("Invoice not available.");
        return;
      }

      setPreviewData(toPreviewData(payload));
    } catch {
      setPreviewData(null);
      setError("Failed to load invoice.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoicePaymentLink();
  }, [fetchInvoicePaymentLink]);

  return {
    previewData,
    isLoading,
    error,
    refetch: fetchInvoicePaymentLink,
  };
};

