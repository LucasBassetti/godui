import { postBuild } from "aeo.js/next";
import { aeoConfig } from "../aeo.config.mjs";

await postBuild(aeoConfig);
