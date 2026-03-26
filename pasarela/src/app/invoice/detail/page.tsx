import { Suspense } from "react";
import PaymentLinkInvoicePage from "../[id]/page.client";

export default function Page() {
  return (
    <Suspense>
      <PaymentLinkInvoicePage />
    </Suspense>
  );
}
