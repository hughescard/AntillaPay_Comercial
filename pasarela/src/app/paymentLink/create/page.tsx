'use client'
import { useCallback, useState } from "react";
import { CreateHeader } from "./components/CreateHeader";
import { CreateSidebar } from "./components/CreateSidebar";
import { PreviewPanel } from "./components/PreviewPanel";
import { currency, type PaymentPreviewData } from "./types";
import { useCreatePaymentLink } from "./hooks/useCreatePaymentLink";
import { usePaymentLinkCreateTabs } from "./hooks/usePaymentLinkCreateTabs";
import { validateUrlNative } from "@/lib/validateUrlNative";
import { useRouter } from "next/navigation";

export default function Home() {
  const { activeTab, setActiveTab } = usePaymentLinkCreateTabs();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [error,setError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [urlErrors,setUrlErrors] = useState({successUrl:false,errorUrl:false});
  const [previewData, setPreviewData] = useState<PaymentPreviewData>({
    title: "",
    description: "",
    currency: currency[0].value,
    amount: 0,
    products: [],
    additionalInfoEnabled: false,
    additionalInfo: "",
    paymentMethods: {
      transfer: true,
      balance: true,
    },
    replaceMessageEnabled: false,
    replaceMessage: "",
    generatePDF: false,
    successURL: "",
    errorURL: ""
  });

  const setSelectedProducts = useCallback(    
    (products: PaymentPreviewData["products"]) => {
      setPreviewData(prev => {
        const nextCurrency = products[0]?.prices?.[0]?.currency || prev.currency;
        const nextAmount =
          products.length > 0
            ? products.reduce((sum, product) => {
                const priceList = Array.isArray(product.prices) ? product.prices : [];
                const priceMatch =
                  priceList.find((price) => price.currency === nextCurrency) ??
                  priceList[0];
                const unitValue = Number(priceMatch?.value);
                const quantity =
                  Number.isFinite(Number(product.quantity)) && Number(product.quantity) > 0
                    ? Number(product.quantity)
                    : 1;

                if (!Number.isFinite(unitValue)) return sum;
                return sum + unitValue / 100 * quantity;
              }, 0)
            : prev.amount;

        return {
          ...prev,
          currency: nextCurrency,
          amount: nextAmount,
          products,
        };
      });
    },
    []
  );

  const { createPaymentLink, isLoading: isCreatingPaymentLink } =
    useCreatePaymentLink();

  const handlePreviewChange = useCallback((nextData: PaymentPreviewData) => {
    setPreviewData(nextData);
    if (nextData.title.trim()) {
      setTitleError(false);
    }
    const normalizedAmount = Number(nextData.amount);
    const hasValidAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0;
    if (hasValidAmount || nextData.products.length > 0) {
      setAmountError(false);
    }
  }, []);

  const handleCreatePaymentLink = async () => {
    const products = previewData.products.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));
    setUrlErrors({successUrl:false,errorUrl:false});
    setError(false);
    setTitleError(false);
    setAmountError(false);

    const normalizedAmount = Number(previewData.amount);
    const amount = Number.isFinite(normalizedAmount) ? normalizedAmount : 0;
    const title = previewData.title.trim();
    const description = previewData.description.trim();
    const additionalInfo = previewData.additionalInfoEnabled
      ? previewData.additionalInfo.trim()
      : "";
    const afterPaymentMessage = previewData.replaceMessageEnabled
      ? previewData.replaceMessage.trim()
      : "";
    const successURL =
      showConfirmation && previewData.successURL.trim()
        ? previewData.successURL.trim()
        : undefined;
    const errorURL =
      showConfirmation && previewData.errorURL.trim()
        ? previewData.errorURL.trim()
        : undefined;

    if (!title) {
      setTitleError(true);
      return;
    }

    if (products.length === 0 && amount <= 0) {
      setAmountError(true);
      return;
    }

    if(showConfirmation){
      if( previewData.successURL.trim()){
        if(!validateUrlNative(successURL as string)){
          setUrlErrors({ successUrl: true, errorUrl: false });
          return
        }
      }else{
          setUrlErrors({ successUrl: true, errorUrl: false });
          return
      }

       if( previewData.errorURL.trim()){
        if(!validateUrlNative(errorURL as string)){
          setUrlErrors({ successUrl: true, errorUrl: false });
          return
        }
      }

    }

    const payload = {
      title,
      description,
      currency: previewData.currency,
      amount: Math.round(amount * 100),
      products: products.length == 0 ? undefined : products,
      paymentMethods: previewData.paymentMethods,
      additionalInfo: additionalInfo ? additionalInfo : undefined,
      afterPaymentMessage: afterPaymentMessage ? afterPaymentMessage : undefined,
      generatePDF: previewData.generatePDF ? true : undefined,
      showConfirmation,
      successURL,
      errorURL,
    };

    try {
      await createPaymentLink(payload);
      router.push('/paymentLink')
    } catch {
      setError(true);
      return;
    }
  };

  return (
    <div className="bg-background flex flex-col flex-1 text-foreground animate-enter-step overflow-x-hidden">
      <div className="flex flex-col flex-1 lg:flex-row overflow-x-hidden">
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <CreateHeader
            onCreatePaymentLink={handleCreatePaymentLink}
            isCreating={isCreatingPaymentLink}
            isDisabled={false}
            error={error}
            titleError={titleError}
            amountError={amountError}
            urlErrors={urlErrors}
          />
          <div className="flex-1 grid gap-8 lg:grid-cols-[25vw_minmax(0,1fr)] overflow-x-hidden">
            <CreateSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSelectedProductsChange={setSelectedProducts}
              onPreviewChange={handlePreviewChange}
              previewData={previewData}
              showConfirmation={showConfirmation}
              onShowConfirmationChange={setShowConfirmation}
              urlErrors={urlErrors}
              titleError={titleError}
              amountError={amountError}
            />
              <PreviewPanel
                activeTab={activeTab}
                previewData={previewData}
                showConfirmation={showConfirmation}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
