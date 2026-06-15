export type ThemeMode = "light" | "dark";

export const THEME_BACKGROUNDS = {
  light: "#fafafa",
  dark: "#09090b",
} as const;

export function getThemeFromGlobals(
  globals: Record<string, unknown>,
): ThemeMode {
  if (globals.theme === "dark") return "dark";
  if (globals.theme === "light") return "light";

  const backgrounds = globals.backgrounds;
  const name =
    typeof backgrounds === "string"
      ? backgrounds
      : (backgrounds as { name?: string } | undefined)?.name;

  return name === "dark" ? "dark" : "light";
}
