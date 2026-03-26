import PaymentLinkPage from "./page.client";
import { STATIC_PAYMENT_LINK_IDS } from "@/app/staticRouteParams";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_PAYMENT_LINK_IDS.map((id) => ({ id }));
}

export default function Page() {
  return <PaymentLinkPage />;
}
