/** Header/footer brand mark: dark background → white logo, light → black. */
export function getBrandLogoSrc(
  resolvedTheme: string | undefined,
  mounted: boolean,
): string {
  if (!mounted || resolvedTheme == null) {
    return "/logo2.svg";
  }
  return resolvedTheme === "dark" ? "/logo.svg" : "/logo2.svg";
}
