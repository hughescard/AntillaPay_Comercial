const SIGNIN_FALLBACK_PATH = "/signin";
const LOCAL_PASARELA_SIGNIN_PATH = "/pasarela/signin";

function normalizeConfiguredUrl(value) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function getConfiguredLoginUrl() {
  const configuredUrl = normalizeConfiguredUrl(import.meta.env.VITE_LOGIN_URL);

  if (configuredUrl) {
    return configuredUrl;
  }

  const configuredOrigin = normalizeConfiguredUrl(
    import.meta.env.VITE_PASARELA_ORIGIN
  );

  if (configuredOrigin) {
    return new URL(SIGNIN_FALLBACK_PATH, configuredOrigin).toString();
  }

  return null;
}

export function getLoginRedirectUrl() {
  const configuredLoginUrl = getConfiguredLoginUrl();

  if (configuredLoginUrl) {
    return configuredLoginUrl;
  }

  if (import.meta.env.DEV) {
    return LOCAL_PASARELA_SIGNIN_PATH;
  }

  return SIGNIN_FALLBACK_PATH;
}

export function redirectToLogin() {
  const loginUrl = getLoginRedirectUrl();

  if (typeof window !== "undefined") {
    window.location.assign(loginUrl);
  }

  return loginUrl;
}
