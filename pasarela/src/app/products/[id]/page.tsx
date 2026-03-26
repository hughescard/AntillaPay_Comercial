import ProductDetailsPage from "./page.client";
import { STATIC_PRODUCT_IDS } from "@/app/staticRouteParams";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_PRODUCT_IDS.map((id) => ({ id }));
}

export default function Page() {
  return <ProductDetailsPage />;
}
