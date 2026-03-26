const BASE_PATH_PREFIX = "/pasarela";

export const normalizeAppPathname = (pathname: string | null | undefined) => {
  if (!pathname) {
    return "";
  }

  if (pathname === BASE_PATH_PREFIX) {
    return "/";
  }

  if (pathname.startsWith(`${BASE_PATH_PREFIX}/`)) {
    return pathname.slice(BASE_PATH_PREFIX.length);
  }

  return pathname;
};
