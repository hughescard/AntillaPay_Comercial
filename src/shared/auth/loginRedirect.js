const LOGIN_PATH = "/pasarela/signin";

export function getLoginRedirectUrl() {
  return LOGIN_PATH;
}

export function redirectToLogin() {
  const loginUrl = getLoginRedirectUrl();

  if (typeof window !== "undefined") {
    window.location.assign(loginUrl);
  }

  return loginUrl;
}
