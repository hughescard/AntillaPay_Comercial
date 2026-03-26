import { useState } from "react";

export type PaymentLinkCreateType = "products" | "custom";

export const usePaymentLinkCreateType = () => {
  const [linkType, setLinkType] = useState<PaymentLinkCreateType>("products");

  return { linkType, setLinkType };
};
