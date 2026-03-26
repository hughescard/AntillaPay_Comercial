'use client';

import { useParams } from "next/navigation";
import { useInvoicePaymentLink } from "../hooks/useInvoicePaymentLink";
import { AfterPaymentPreview } from "@/app/paymentLink/components/AfterPaymentPreview";

export default function PaymentLinkInvoicePage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { previewData, isLoading, error } = useInvoicePaymentLink(id);

  if (isLoading) {
    return (
      <div className="absolute inset-0 top-0 w-full bg-surface">
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          Loading invoice...
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="absolute inset-0 top-0 w-full bg-surface">
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          {error ?? "Invoice not available."}
        </div>
      </div>
    );
  }

  return (
     <div className="absolute h-screen inset-0 w-full bg-surface animate-enter-step">
      <div className="flex h-full w-full items-stretch justify-center px-6 pb-4 pt-14">
        <div className="h-full w-full max-w-none">
          <AfterPaymentPreview previewData={previewData} />
        </div>
      </div>
    </div>
  );
}
