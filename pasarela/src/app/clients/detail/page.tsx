import { Suspense } from "react";
import ClientDetailPage from "../[id]/page.client";

export default function Page() {
  return (
    <Suspense>
      <ClientDetailPage />
    </Suspense>
  );
}
