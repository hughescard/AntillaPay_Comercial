/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PaymentPreview } from "../components/PaymentPreview";
import { usePaymentLink, usePayPaymentLink } from "../hooks/usePaymentLink";
import { useOperation } from "@/common/hooks/useOperation";
import { validateFormsFields } from "@/lib/validateFormsFields";
import type {
  Errors,
  PaymentPreviewPayParams,
} from "../components/paymentPreview.types";

export default function PaymentLinkPage() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {postPayinOfPaymentLink, postTransferOfPaymentLink, getPaymentLinkPdf} = useOperation();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { previewData, showConfirmation, status, isLoading, error } = usePaymentLink(id);
  const { isPaying } = usePayPaymentLink();
  const [isPaid, setIsPaid] = useState(false);
  const [paymentError, setPaymentError] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Errors>({});
  const [operationIframeLink, setOperationIframeLink] = useState<string | null>(null);

  const shouldRedirectOnSuccess = useMemo(
    () => showConfirmation === true && Boolean(previewData?.successURL),
    [showConfirmation, previewData?.successURL]
  );

  useEffect(() => {
    if (status === "paid") {
      setIsPaid(true);
    }
  }, [status]);

  useEffect(() => {
    if (!isPaid || !previewData) return;
    if (shouldRedirectOnSuccess && previewData.successURL) {
      router.replace(previewData.successURL);
    }
  }, [isPaid, previewData, router, shouldRedirectOnSuccess]);

  const handlePay = async (params: PaymentPreviewPayParams = {}) => {
  if (!id) return;
  setPaymentError(false);
  setOperationIframeLink(null);

  
  const { selectedMethod, accountMode, contactEmail, contactName } = params;

  if (selectedMethod === "bank") {
    const validationErrors = validateFormsFields({
      name: contactName,
      email: contactEmail,
    });

    if (validationErrors.name || validationErrors.email) {
      setFormErrors({
        contactName: validationErrors.name,
        contactEmail: validationErrors.email,
      });
      return;
    }
    setFormErrors({});
  } else {
    setFormErrors({});
  }

  if(selectedMethod === 'bank'){
    const result = await postPayinOfPaymentLink({paymentId:id,
      accountMode: accountMode as 'cuba' | 'foreing',
      contactEmail: contactEmail as string,
      contactName: contactName as string
    });
    if (result.success) {
      if (result.url && result.url.trim() !== "") {
        setOperationIframeLink(result.url);
      } else {
        setFormErrors({ general: { id: "errors.unknown_error" } });
      }
      return;
    }
    setFormErrors({ general: { id: "errors.unknown_error" } });
    return;

  }else{
    const result = await postTransferOfPaymentLink(id);
    if (result.success) {
      if(previewData?.generatePDF){
        await getPaymentLinkPdf("transfer", result.transferId);
      }
      if (result.url && result.url.trim() !== "") {
        router.push(result.url);
      } else {
        router.push(`/invoice/${id}/`);
      }
      return;
    }else{
      if (result.url && result.url.trim() !== "") {
        router.push(result.url);
      } else {
        setPaymentError(true);
      }
      return;
    }
  }
};

  if (isLoading) {
    return (
      <div className="absolute top-0 w-full bg-surface">
          <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
            {t("paymentLinks.loadingLink")}
          </div>
      </div>
     
    );
  }

  if (error || !previewData) {
    return (
      <div className="absolute top-0 w-full bg-surface">
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          {error ?? "Payment link not available."}
        </div>
      </div>
    );
  }

  if (isPaid) {
    if (showConfirmation === true && previewData.successURL) {
      router.push(previewData.successURL);
      return null;
    }
    router.push(`/invoice/${id}/`);
    return null;
  }

  return (
    <div className="absolute h-screen inset-0 w-full bg-surface animate-enter-step">
      <div className="flex h-full w-full items-stretch justify-center px-6 pb-4 pt-14">
        <div className="h-full w-full max-w-none">
          
          <PaymentPreview
            previewData={previewData}
            isPaying={isPaying}
            errors={formErrors}
            iframeUrl={operationIframeLink}
            onPay={(params) => handlePay(params)}
            paymentError={paymentError}
            onRetry={()=>setPaymentError(false)}
          />

        </div>
      </div>
    </div>
  );
}
