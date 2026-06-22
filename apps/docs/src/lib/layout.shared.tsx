import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "GodUI",
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
