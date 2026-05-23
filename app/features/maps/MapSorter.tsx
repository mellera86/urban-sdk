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
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@components/Popover";
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
  const valueDescriptionId = useId();
  const listboxId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Label id={labelId}>Sort By:</Label>
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
            {getSortOptionLabel(value)}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-50" aria-hidden />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <PopoverTitle className="sr-only">Sort maps</PopoverTitle>
          <Command shouldFilter={false} value={getSortOptionLabel(value)}>
            <CommandInput visuallyHidden aria-labelledby={labelId} />
            <CommandList
              id={listboxId}
              role="listbox"
              aria-labelledby={labelId}
            >
              <CommandGroup>
                {MAP_SORT_OPTIONS.map((option) => {
                  const selected = value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      role="option"
                      aria-selected={selected}
                      data-checked={selected ? true : undefined}
                      onSelect={() => {
                        onValueChange(option.value);
                        setOpen(false);
                      }}
                    >
                      {option.label}
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

export { MapSorter };
