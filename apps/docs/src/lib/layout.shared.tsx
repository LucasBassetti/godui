import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "GoDUI",
    },
    links: [
      {
        text: "Storybook",
        url: "/design-system",
      },
    ],
    themeSwitch: {
      enabled: true,
      mode: "light-dark-system",
    },
  };
}
