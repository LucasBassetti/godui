import { RadioGroup, RadioGroupItem } from "@godui/components";

const OPTIONS = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      {OPTIONS.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={`r-${option.value}`} />
          <label htmlFor={`r-${option.value}`} className="text-sm">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
}
