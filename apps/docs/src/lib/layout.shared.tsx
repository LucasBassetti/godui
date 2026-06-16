import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "GoDUI",
    },
    themeSwitch: {
      enabled: true,
      mode: "light-dark-system",
    },
  };
}
