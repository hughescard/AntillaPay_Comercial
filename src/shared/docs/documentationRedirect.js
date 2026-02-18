const FALLBACK_DOCUMENTATION_URL = "/";

export function getDocumentationUrl() {
  const configuredUrl = import.meta.env.VITE_DOCS_URL;

  if (typeof configuredUrl === "string" && configuredUrl.trim().length > 0) {
    return configuredUrl.trim();
  }

  return FALLBACK_DOCUMENTATION_URL;
}

export function redirectToDocumentation() {
  const docsUrl = getDocumentationUrl();

  if (typeof window !== "undefined") {
    window.location.assign(docsUrl);
  }

  return docsUrl;
}
