import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MarketingLayout from "@/app/layouts/MarketingLayout";
import RouteLoader from "@/app/router/RouteLoader";
import RouteErrorBoundary from "@/app/router/RouteErrorBoundary";
import { PUBLIC_PAGE_ROUTES } from "@/app/routes/publicPageConfig";

const marketingPageComponents = Object.freeze({
  Home: lazy(() => import("@/pages/Home")),
  Products: lazy(() => import("@/pages/Products")),
  Developers: lazy(() => import("@/pages/Developers")),
  SignInRedirect: lazy(() => import("@/pages/SignInRedirect")),
  Solutions: lazy(() => import("@/pages/Solutions")),
  SolutionPymes: lazy(() => import("@/pages/SolutionPymes")),
  SolutionRetail: lazy(() => import("@/pages/SolutionRetail")),
  SolutionTransporte: lazy(() => import("@/pages/SolutionTransporte")),
  SolutionHosteleriaOcio: lazy(() => import("@/pages/SolutionHosteleriaOcio")),
  SolutionVending: lazy(() => import("@/pages/SolutionVending")),
  SolutionEnergia: lazy(() => import("@/pages/SolutionEnergia")),
  SolutionServiciosHogar: lazy(() => import("@/pages/SolutionServiciosHogar")),
  SolutionBancos: lazy(() => import("@/pages/SolutionBancos")),
  Company: lazy(() => import("@/pages/Company")),
  Contact: lazy(() => import("@/pages/Contact")),
  PaymentLinks: lazy(() => import("@/pages/PaymentLinks")),
  Companies: lazy(() => import("@/pages/Companies")),
  GlobalPayouts: lazy(() => import("@/pages/GlobalPayouts")),
  FinancialAccounts: lazy(() => import("@/pages/FinancialAccounts")),
  Payments: lazy(() => import("@/pages/Payments")),
  OperationsTraceability: lazy(() => import("@/pages/OperationsTraceability")),
  BalanceManagement: lazy(() => import("@/pages/BalanceManagement")),
  NationalPayouts: lazy(() => import("@/pages/NationalPayouts")),
  CustomerTraceability: lazy(() => import("@/pages/CustomerTraceability")),
});

function renderMarketingRoutes() {
  return PUBLIC_PAGE_ROUTES.flatMap(({ key, path, legacyPaths }) => {
    const PageComponent = marketingPageComponents[key];
    if (!PageComponent) {
      return [];
    }

    return [
      <Route
        key={key}
        path={path}
        element={
          <RouteErrorBoundary>
            <MarketingLayout>
              <PageComponent />
            </MarketingLayout>
          </RouteErrorBoundary>
        }
      />,
      ...legacyPaths.map((legacyPath) => (
        <Route
          key={`${key}-${legacyPath}`}
          path={legacyPath}
          element={<Navigate to={path} replace />}
        />
      )),
    ];
  });
}

export default function AppRouter() {
  const SignInRedirectPage = marketingPageComponents.SignInRedirect;

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route
            path="/signin"
            element={
              <RouteErrorBoundary>
                <MarketingLayout>
                  <SignInRedirectPage />
                </MarketingLayout>
              </RouteErrorBoundary>
            }
          />

          {renderMarketingRoutes()}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
