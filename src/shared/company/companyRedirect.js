const FALLBACK_COMPANY_URL = "/";

export function getCompanyRedirectUrl() {
  const configuredUrl = import.meta.env.VITE_COMPANY_URL;

  if (typeof configuredUrl === "string" && configuredUrl.trim().length > 0) {
    return configuredUrl.trim();
  }

  return FALLBACK_COMPANY_URL;
}

export function redirectToCompany() {
  const companyUrl = getCompanyRedirectUrl();

  if (typeof window !== "undefined") {
    window.location.assign(companyUrl);
  }

  return companyUrl;
}
