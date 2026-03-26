'use client';

import { ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRbacSimulation } from "@/common/context";
import { getRoutePermissions, isPublicRbacRoute } from "@/lib/rbac";

export const RbacRouteGate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { currentUser, hasAnyPermission } = useRbacSimulation();

  if (!pathname || isPublicRbacRoute(pathname)) {
    return <>{children}</>;
  }

  const required = getRoutePermissions(pathname);
  if (required && hasAnyPermission(required)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-surface p-6">
      <div className="max-w-xl rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <ShieldAlert className="mx-auto mb-4 text-amber-600" size={28} />
        <h1 className="text-2xl font-bold text-foreground">Acceso restringido</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {currentUser.name} no tiene permisos para acceder a esta sección con el rol actual.
        </p>
      </div>
    </div>
  );
};
