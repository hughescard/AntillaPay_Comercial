const PASARELA_LOGIN_PATH = "/pasarela/signin";

function normalizeConfiguredUrl(value) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function getLoginRedirectUrl() {
  const configuredUrl = normalizeConfiguredUrl(import.meta.env.VITE_LOGIN_URL);

  if (configuredUrl) {
    return configuredUrl;
  }

  const configuredOrigin = normalizeConfiguredUrl(
    import.meta.env.VITE_PASARELA_ORIGIN
  );

  if (configuredOrigin) {
    return new URL(PASARELA_LOGIN_PATH, configuredOrigin).toString();
  }

  if (typeof window === "undefined") {
    return PASARELA_LOGIN_PATH;
  }

  return PASARELA_LOGIN_PATH;
}

export function redirectToLogin() {
  const loginUrl = getLoginRedirectUrl();

  if (typeof window !== "undefined") {
    window.location.assign(loginUrl);
  }

  return loginUrl;
}
