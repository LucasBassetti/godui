import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "GoDUI",
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
