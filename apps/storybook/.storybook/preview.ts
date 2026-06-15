import type { Preview } from "@storybook/react";
import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED, UPDATE_GLOBALS } from "storybook/internal/core-events";
import "../src/tailwind.css";
import { withThemeScope } from "./theme-decorator";
import { getThemeFromGlobals, THEME_BACKGROUNDS, type ThemeMode } from "./theme";

function syncThemeGlobals(globals: Record<string, unknown>) {
  const theme = getThemeFromGlobals(globals);

  if (globals.theme === theme && globals.backgrounds === theme) {
    return;
  }

  addons.getChannel().emit(UPDATE_GLOBALS, {
    globals: {
      theme,
      backgrounds: theme,
    },
  });
}

addons.getChannel().on(GLOBALS_UPDATED, ({ globals }) => {
  syncThemeGlobals(globals);
});

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme for the component preview",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light" satisfies ThemeMode,
    backgrounds: "light",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: "Light", value: THEME_BACKGROUNDS.light },
        dark: { name: "Dark", value: THEME_BACKGROUNDS.dark },
      },
      default: "light",
    },
  },
  decorators: [withThemeScope],
};

export default preview;
