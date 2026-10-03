import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { Fragment } from "react";

const meta = {
  title: "UI/Combobox",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FRAMEWORKS = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export const Default: Story = {
  render: () => (
    <div className="flex min-h-80 items-start justify-center pt-10">
      <Combobox items={FRAMEWORKS}>
        <ComboboxInput placeholder="Select a framework" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};

function MultipleDemo() {
  const anchor = useComboboxAnchor();
  return (
    <div className="flex min-h-80 items-start justify-center pt-10">
      <Combobox
        multiple
        autoHighlight
        items={FRAMEWORKS}
        defaultValue={["Next.js", "Remix", "Astro"]}
      >
        <ComboboxChips ref={anchor} className="w-full max-w-xs">
          <ComboboxValue>
            {(values: string[]) => (
              <Fragment>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput aria-label="Frameworks" />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export const Multiple: Story = { render: () => <MultipleDemo /> };
