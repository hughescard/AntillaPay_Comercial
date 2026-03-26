import ClientDetailPage from "./page.client";
import { STATIC_CLIENT_IDS } from "@/app/staticRouteParams";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_CLIENT_IDS.map((id) => ({ id }));
}

export default function Page() {
  return <ClientDetailPage />;
}
