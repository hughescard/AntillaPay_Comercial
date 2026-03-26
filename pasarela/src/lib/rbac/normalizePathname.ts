const BASE_PATH_PREFIX = "/pasarela";

export const normalizeAppPathname = (pathname: string | null | undefined) => {
  if (!pathname) {
    return "";
  }

  if (pathname === BASE_PATH_PREFIX) {
    return "/";
  }

  const withoutBasePath = pathname.startsWith(`${BASE_PATH_PREFIX}/`)
    ? pathname.slice(BASE_PATH_PREFIX.length)
    : pathname;

  if (!withoutBasePath || withoutBasePath === "/") {
    return "/";
  }

  return withoutBasePath.replace(/\/+$/, "") || "/";
};
