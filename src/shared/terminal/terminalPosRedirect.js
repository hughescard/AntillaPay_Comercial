const FALLBACK_TERMINAL_POS_URL = "https://antillapos.vercel.app";

export function getTerminalPosUrl() {
  const configuredUrl = import.meta.env.VITE_TERMINAL_POS_URL;

  if (typeof configuredUrl === "string" && configuredUrl.trim().length > 0) {
    return configuredUrl.trim();
  }

  return FALLBACK_TERMINAL_POS_URL;
}

export function redirectToTerminalPos() {
  const terminalPosUrl = getTerminalPosUrl();

  if (typeof window !== "undefined") {
    window.location.assign(terminalPosUrl);
  }

  return terminalPosUrl;
}
