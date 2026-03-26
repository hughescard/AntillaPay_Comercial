import { Suspense } from "react";
import PaymentDetailsPage from "../[id]/page.client";

export default function Page() {
  return (
    <Suspense>
      <PaymentDetailsPage />
    </Suspense>
  );
}
