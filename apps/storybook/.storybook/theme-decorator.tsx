import type { Decorator } from "@storybook/react";
import { type ReactNode, useEffect } from "react";
import { getThemeFromGlobals, type ThemeMode } from "./theme";

/**
 * Mirrors the theme onto <html> too, so portaled content (dialogs, menus,
 * toasts — rendered into document.body, outside the story wrapper) themes
 * like the story itself.
 */
function ThemeRoot({
  theme,
  children,
}: {
  theme: ThemeMode;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);
  return <>{children}</>;
}

/** Scopes light/dark tokens to the story tree without sizing the preview. */
export const withThemeScope: Decorator = (Story, context) => {
  const theme = getThemeFromGlobals(context.globals ?? {});

  return (
    <ThemeRoot theme={theme}>
      <div className={theme === "dark" ? "dark" : "light"}>
        <Story />
      </div>
    </ThemeRoot>
  );
};
