import { Checkbox } from "@godui/components";

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="font-medium text-sm">
          Accept terms and conditions
        </label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms-2" defaultChecked />
        <div className="grid gap-2">
          <label htmlFor="terms-2" className="font-medium text-sm">
            Accept terms and conditions
          </label>
          <p className="text-muted-foreground text-sm">
            By clicking this checkbox, you agree to the terms and conditions.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="toggle" disabled />
        <label htmlFor="toggle" className="font-medium text-sm opacity-50">
          Enable notifications
        </label>
      </div>
    </div>
  );
}
