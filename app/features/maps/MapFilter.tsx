"use client";

import { useState } from "react";
import { Button } from "@components/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/Popover";
import { ChevronDownIcon } from "lucide-react";

type MapFilterProps = {
  subLabels: string[];
  value: string[];
  onValueChange: (subLabels: string[]) => void;
};

function getTriggerLabel(selected: string[]) {
  if (selected.length === 0) return "All sources";
  if (selected.length === 1) return selected[0];
  return `${selected.length} sources selected`;
}

const MapFilter = ({ subLabels, value, onValueChange }: MapFilterProps) => {
  const [open, setOpen] = useState(false);

  const toggleSubLabel = (subLabel: string) => {
    onValueChange(
      value.includes(subLabel)
        ? value.filter((item) => item !== subLabel)
        : [...value, subLabel],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="max-w-sm min-w-64 justify-between font-normal mx-auto"
          />
        }
      >
        <span className="truncate">{getTriggerLabel(value)}</span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search sources..." />
          <CommandList>
            <CommandEmpty>No source found.</CommandEmpty>
            <CommandGroup heading="Sources">
              {subLabels.map((subLabel) => (
                <CommandItem
                  key={subLabel}
                  value={subLabel}
                  data-checked={value.includes(subLabel)}
                  onSelect={() => toggleSubLabel(subLabel)}
                >
                  {subLabel}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { MapFilter };
