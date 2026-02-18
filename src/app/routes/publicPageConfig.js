const PUBLIC_PAGE_DEFINITIONS = [
  { key: "Home", slug: "" },
  { key: "Products", slug: "products" },
  { key: "Developers", slug: "developers" },
  { key: "Solutions", slug: "solutions" },
  { key: "SolutionPymes", slug: "soluciones/pymes" },
  { key: "SolutionRetail", slug: "soluciones/retail" },
  { key: "SolutionTransporte", slug: "soluciones/transporte" },
  { key: "SolutionHosteleriaOcio", slug: "soluciones/hosteleria-ocio" },
  { key: "SolutionVending", slug: "soluciones/vending" },
  { key: "SolutionEnergia", slug: "soluciones/energia" },
  { key: "SolutionServiciosHogar", slug: "soluciones/servicios-del-hogar" },
  { key: "SolutionBancos", slug: "soluciones/bancos" },
  { key: "Company", slug: "company" },
  { key: "Contact", slug: "contact" },
  { key: "PaymentLinks", slug: "payment-links" },
  { key: "Companies", slug: "companies" },
  { key: "GlobalPayouts", slug: "global-payouts" },
  { key: "FinancialAccounts", slug: "financial-accounts" },
  { key: "Payments", slug: "payments" },
  { key: "OperationsTraceability", slug: "trazabilidad-operaciones" },
  { key: "BalanceManagement", slug: "gestiona-tu-saldo" },
  { key: "NationalPayouts", slug: "payouts-nacionales" },
  { key: "CustomerTraceability", slug: "trazabilidad-por-cliente" },
];

const toPath = (slug) => (slug ? `/${slug}` : "/");

const buildLegacyPaths = (key, canonicalPath) => {
  const legacyPaths = new Set();

  if (key === "Home") {
    legacyPaths.add("/home");
    legacyPaths.add("/Home");
  } else {
    legacyPaths.add(`/${key}`);
    legacyPaths.add(`/${key.toLowerCase()}`);
  }

  return Array.from(legacyPaths).filter((path) => path !== canonicalPath);
};

export const PUBLIC_PAGE_ROUTES = Object.freeze(
  PUBLIC_PAGE_DEFINITIONS.map(({ key, slug }) => {
    const path = toPath(slug);
    return {
      key,
      path,
      legacyPaths: buildLegacyPaths(key, path),
    };
  }),
);

export const PUBLIC_PAGE_PATHS_BY_KEY = Object.freeze(
  PUBLIC_PAGE_ROUTES.reduce((acc, route) => {
    acc[route.key] = route.path;
    return acc;
  }, {}),
);

const normalizePageName = (pageName) => String(pageName || "").trim();

const fallbackPagePath = (pageName) => {
  const normalizedName = normalizePageName(pageName);
  if (!normalizedName) {
    return "/";
  }

  const normalizedSlug = normalizedName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();

  return normalizedSlug ? `/${normalizedSlug}` : "/";
};

export const getPublicPathByName = (pageName) => {
  const normalizedName = normalizePageName(pageName);
  return PUBLIC_PAGE_PATHS_BY_KEY[normalizedName] || fallbackPagePath(normalizedName);
};
