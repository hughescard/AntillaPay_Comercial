import "@/common/styles/globals.css";
import { Providers } from "@/common/context";
import { SandboxHeader } from "@/common/components/layout/SandboxHeader";
import { RouteChangeListener } from "@/common/components/layout/RouteChangeListener";
import { RbacRouteGate } from "@/common/components/layout/RbacRouteGate";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans h-screen overflow-hidden flex-col flex antialiased`}
      >
        <Providers>
          <Suspense>
            <RouteChangeListener/>
          </Suspense>
          <SandboxHeader/>
          <div className="flex-1 min-h-0 overflow-hidden">
            <RbacRouteGate>
              {children}
            </RbacRouteGate>
          </div>
        </Providers>
      </body>
    </html>
  );
}
