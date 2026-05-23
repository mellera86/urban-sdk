"use client";

import { useId, useState } from "react";
import { Button } from "@components/Button";
import { Label } from "@components/Label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/Command";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@components/Popover";
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
  const labelId = useId();
  const valueDescriptionId = useId();
  const listboxId = useId();
  const [open, setOpen] = useState(false);

  const toggleSubLabel = (subLabel: string) => {
    onValueChange(
      value.includes(subLabel)
        ? value.filter((item) => item !== subLabel)
        : [...value, subLabel],
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label id={labelId}>Filter By:</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              type="button"
              aria-labelledby={`${labelId} ${valueDescriptionId}`}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-expanded={open}
              className="max-w-sm min-w-64 justify-between font-normal text-black aria-expanded:text-black"
            />
          }
        >
          <span id={valueDescriptionId} className="truncate">
            {getTriggerLabel(value)}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-50" aria-hidden />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <PopoverTitle className="sr-only">Filter by source</PopoverTitle>
          <Command>
            <CommandInput
              placeholder="Search sources..."
              aria-label="Search sources"
            />
            <CommandList
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby={labelId}
            >
              <CommandEmpty>No source found.</CommandEmpty>
              <CommandGroup>
                {subLabels.map((subLabel) => {
                  const selected = value.includes(subLabel);
                  return (
                    <CommandItem
                      key={subLabel}
                      value={subLabel}
                      role="option"
                      aria-selected={selected}
                      data-checked={selected ? true : undefined}
                      onSelect={() => toggleSubLabel(subLabel)}
                    >
                      {subLabel}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { MapFilter };
