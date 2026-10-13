
"use client";

import { Category } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { KeyboardEvent } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
}

const CategorySelector = ({ categories }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const searchValue = e.currentTarget.value.toLowerCase().trim();

    const selectedCategory = categories.find((category) =>
      category.title?.toLowerCase().includes(searchValue)
    );

    if (selectedCategory?._id && selectedCategory.slug?.current) {
      setValue(selectedCategory._id);
      router.push(`/categories/${selectedCategory.slug.current}`);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((category) => category?._id === value)?.title
            : "Filter by Category"}

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search category..."
            className="h-9"
            onKeyDown={handleKeyDown}
          />

          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>

            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category.title ?? ""}
                  onSelect={() => {
                    if (!category._id || !category.slug?.current) return;

                    setValue(value === category._id ? "" : category._id);

                    if (value === category._id) {
                      router.push("/categories");
                    } else {
                      router.push(`/categories/${category.slug.current}`);
                    }

                    setOpen(false);
                  }}
                >
                  {category.title}

                  <Check
                    className={cn(
                      "ml-auto",
                      value === category._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
