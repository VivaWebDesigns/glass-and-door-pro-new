export function pathRequiresSetupStatus(pathname: string) {
  return pathname === "/setup" || pathname.startsWith("/admin") || pathname.startsWith("/auth");
}

export function shouldRedirectToSetup(pathname: string, needsSetup: boolean) {
  return pathRequiresSetupStatus(pathname) && needsSetup && pathname !== "/setup";
}
