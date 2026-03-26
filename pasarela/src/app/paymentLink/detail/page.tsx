import { Suspense } from "react";
import PaymentLinkPage from "../[id]/page.client";

export default function Page() {
  return (
    <Suspense>
      <PaymentLinkPage />
    </Suspense>
  );
}
