"use client";

import { useEffect } from "react";
import { aeoConfig } from "../../aeo.config.mjs";

export function AeoWidget() {
  useEffect(() => {
    import("aeo.js/widget").then(({ AeoWidget }) => {
      new AeoWidget({
        config: {
          ...aeoConfig,
          widget: { enabled: true, position: "bottom-right" },
        },
      });
    });
  }, []);

  return null;
}
