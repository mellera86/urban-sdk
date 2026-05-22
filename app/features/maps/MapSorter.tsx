"use client";

import { useId, useState } from "react";
import { Button } from "@components/Button";
import { Label } from "@components/Label";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@components/Popover";
import { ChevronDownIcon } from "lucide-react";
import {
  getSortOptionLabel,
  MAP_SORT_OPTIONS,
  type MapSortOption,
} from "./map-sort";

type MapSorterProps = {
  value: MapSortOption;
  onValueChange: (sort: MapSortOption) => void;
};

const MapSorter = ({ value, onValueChange }: MapSorterProps) => {
  const labelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Label id={labelId}>Sort By:</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-labelledby={labelId}
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="max-w-sm min-w-64 justify-between font-normal"
            />
          }
        >
          <span className="truncate">{getSortOptionLabel(value)}</span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command shouldFilter={false} value={getSortOptionLabel(value)}>
            <CommandInput visuallyHidden aria-labelledby={labelId} />
            <CommandList>
              <CommandGroup>
                {MAP_SORT_OPTIONS.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={value === option.value}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { MapSorter };
