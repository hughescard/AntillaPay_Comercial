import { AfterPaymentSettings } from "./AfterPaymentSettings";
import { ProductSubscriptionSettings } from "./ProductSubscriptionSettings";
import { PaymentLinkCreateTab } from "../hooks/usePaymentLinkCreateTabs";
import { useTranslation } from "react-i18next";
import type { PaymentPreviewData, SelectedProduct } from "../types";
import { sanitizeUrl } from "@/lib/sanitizers";

type CreateSidebarProps = {
  activeTab: PaymentLinkCreateTab;
  onTabChange: (tab: PaymentLinkCreateTab) => void;
  onSelectedProductsChange?: (products: SelectedProduct[]) => void;
  onPreviewChange: (data: PaymentPreviewData) => void;
  previewData: PaymentPreviewData;
  showConfirmation: boolean;
  onShowConfirmationChange: (value: boolean) => void;
  urlErrors: {successUrl:boolean,errorUrl:boolean};
  titleError: boolean;
  amountError: boolean;
};

export const CreateSidebar = ({
  activeTab,
  onTabChange,
  onSelectedProductsChange,
  onPreviewChange,
  previewData,
  showConfirmation,
  onShowConfirmationChange,
  urlErrors,
  titleError,
  amountError,
}: CreateSidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside className="space-y-8 px-10 pt-6">
      <div className="flex items-center gap-6 border-b border-border text-sm">
        <button
          type="button"
          onClick={() => onTabChange("payment")}
          className={`pb-3 cursor-pointer transition ${
            activeTab === "payment"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground"
          }`}
        >
          {t("paymentLinkCreate.tabs.paymentPage")}
        </button>
        <button
          type="button"
          onClick={() => onTabChange("after")}
          className={`pb-3 cursor-pointer transition ${
            activeTab === "after"
              ? "border-b-2 border-accent text-accent"
              : "text-muted-foreground"
          }`}
        >
          {t("paymentLinkCreate.tabs.afterPayment")}
        </button>
      </div>

      {activeTab === "payment" ? (
        <ProductSubscriptionSettings
          onSelectedProductsChange={onSelectedProductsChange}
          onPreviewChange={onPreviewChange}
          previewData={previewData}
          titleError={titleError}
          amountError={amountError}
        />
      ) : (
        <AfterPaymentSettings
          showConfirmation={showConfirmation}
          onShowConfirmationChange={onShowConfirmationChange}
          replaceMessageEnabled={previewData.replaceMessageEnabled}
          replaceMessage={previewData.replaceMessage}
          onReplaceMessageEnabledChange={(value) =>
            onPreviewChange({ ...previewData, replaceMessageEnabled: value })
          }
          onReplaceMessageChange={(value) =>
            onPreviewChange({ ...previewData, replaceMessage: value })
          }
          generatePDF={previewData.generatePDF}
          onGeneratePDFChange={(value) =>
            onPreviewChange({ ...previewData, generatePDF: value })
          }
          successURL={previewData.successURL}
          errorURL={previewData.errorURL}
          onSuccessURLChange={(value) =>
            onPreviewChange({ ...previewData, successURL: sanitizeUrl(value) })
          }
          onErrorURLChange={(value) =>
            onPreviewChange({ ...previewData, errorURL: sanitizeUrl(value) })
          }
          urlErrors={urlErrors}
        />
      )}
    </aside>
  );
};
