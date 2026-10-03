import { Switch } from "@godui/components";

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode" className="font-medium text-sm">
        Airplane Mode
      </label>
    </div>
  );
}
