import { NavigationMenuDemo } from "./navigation-menu-demo";

/** Each content opens under its own trigger instead of in the shared viewport. */
export function NavigationMenuNoViewportDemo() {
  return <NavigationMenuDemo viewport={false} />;
}
