import type { Preview } from "@storybook/react";
import "../src/tailwind.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const bg = context.globals?.backgrounds;
      const isDark =
        bg?.value === "#333333" || bg?.value === "dark" || bg?.name === "dark";

      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.classList.toggle("light", !isDark);
      }

      return Story();
    },
  ],
};

export default preview;
