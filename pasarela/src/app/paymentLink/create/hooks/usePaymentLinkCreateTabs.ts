import { useState } from "react";

export type PaymentLinkCreateTab = "payment" | "after";

export const usePaymentLinkCreateTabs = () => {
  const [activeTab, setActiveTab] = useState<PaymentLinkCreateTab>("payment");

  return { activeTab, setActiveTab };
};
