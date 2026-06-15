import type { Decorator } from "@storybook/react";
import { getThemeFromGlobals } from "./theme";

/** Scopes light/dark tokens to the story tree without sizing the preview. */
export const withThemeScope: Decorator = (Story, context) => {
  const theme = getThemeFromGlobals(context.globals ?? {});

  return (
    <div className={theme === "dark" ? "dark" : "light"}>
      <Story />
    </div>
  );
};
