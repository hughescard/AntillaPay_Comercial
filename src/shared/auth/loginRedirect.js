const FALLBACK_LOGIN_URL = "/";

export function getLoginRedirectUrl() {
  const configuredUrl = import.meta.env.VITE_LOGIN_URL;

  if (typeof configuredUrl === "string" && configuredUrl.trim().length > 0) {
    return configuredUrl.trim();
  }

  return FALLBACK_LOGIN_URL;
}

export function redirectToLogin() {
  const loginUrl = getLoginRedirectUrl();

  if (typeof window !== "undefined") {
    window.location.assign(loginUrl);
  }

  return loginUrl;
}

