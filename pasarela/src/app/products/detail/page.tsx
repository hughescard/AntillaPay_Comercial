import { Suspense } from "react";
import ProductDetailsPage from "../[id]/page.client";

export default function Page() {
  return (
    <Suspense>
      <ProductDetailsPage />
    </Suspense>
  );
}
