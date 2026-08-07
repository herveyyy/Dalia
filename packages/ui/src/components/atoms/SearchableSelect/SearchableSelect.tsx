"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Plus } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface SearchableSelectProps {
  id?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function SearchableSelect({
  id,
  name,
  defaultValue = "",
  value: controlledValue,
  onChange,
  options,
  placeholder = "Select or search...",
  searchPlaceholder = "Type to search...",
  allowCustom = true,
  className,
  disabled = false,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
    setIsOpen(false);
    setSearch("");
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.value.toLowerCase().includes(search.toLowerCase()) ||
    opt.sublabel?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === selectedValue || opt.label === selectedValue);
  const displayLabel = selectedOption ? selectedOption.label : selectedValue || "";

  const isCustomValue = search.trim() && !options.some((opt) => opt.label.toLowerCase() === search.trim().toLowerCase());

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for HTML form submission */}
      <input type="hidden" id={id} name={name} value={selectedValue} required={required} />

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          !displayLabel && "text-muted-foreground",
          className
        )}
      >
        <span className="truncate">{displayLabel || placeholder}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 max-h-60 w-full overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          {/* Search Box */}
          <div className="relative px-1 py-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md bg-muted/50 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:bg-muted/80"
            />
          </div>

          {/* Options List */}
          <div className="mt-1 max-h-44 overflow-y-auto divide-y divide-border/40 text-xs">
            {filteredOptions.length === 0 && !isCustomValue ? (
              <div className="px-3 py-3 text-center text-muted-foreground">
                No matching options found.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValue === opt.value || selectedValue === opt.label;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors rounded-md hover:bg-muted/60 cursor-pointer",
                      isSelected && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    <div>
                      <div className="font-medium text-foreground">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-[10px] text-muted-foreground">{opt.sublabel}</div>
                      )}
                    </div>
                    {isSelected && <Check className="size-4 text-primary shrink-0" />}
                  </button>
                );
              })
            )}

            {/* Custom option item */}
            {allowCustom && isCustomValue && (
              <button
                type="button"
                onClick={() => handleSelect(search.trim())}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-primary font-medium transition-colors hover:bg-primary/10 rounded-md cursor-pointer"
              >
                <Plus className="size-4 shrink-0" />
                <span>Use custom: "{search.trim()}"</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
