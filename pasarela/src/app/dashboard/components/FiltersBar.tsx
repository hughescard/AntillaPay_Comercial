'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import type { DashboardFilters } from "../types";

type FiltersBarProps = {
  filters: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
  labels: {
    range: string;
    last7Days: string;
    last30Days: string;
    daily: string;
    weekly: string;
    compare: string;
    previousPeriod: string;
  };
};

type DropdownOption = {
  label: string;
  value: string;
};

const pillBaseClass =
  "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition";

const DropdownPill = ({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value]
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${pillBaseClass} w-full justify-between border-[var(--accent)] text-[var(--accent)] sm:w-auto sm:min-w-[168px]`}
      >
        <span className="truncate">
          {label ? `${label}: ` : ""}{currentOption?.label}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute left-0 top-full z-20 mt-2 w-[min(20rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl transition-all ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-2">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span>{option.label}</span>
                {isSelected ? <Check size={14} /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TogglePill = ({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`${pillBaseClass} w-full justify-center sm:w-auto ${
      active
        ? "border-[var(--accent)] text-[var(--accent)]"
        : "border-[var(--border)] text-[var(--muted-foreground)]"
    }`}
  >
    {active ? <X size={12} /> : null}
    {label}
  </button>
);

export const FiltersBar = ({ filters, onChange, labels }: FiltersBarProps) => {
  const rangeOptions: DropdownOption[] = [
    { value: "last7Days", label: labels.last7Days },
    { value: "last30Days", label: labels.last30Days },
  ];

  const granularityOptions: DropdownOption[] = [
    { value: "daily", label: labels.daily },
    { value: "weekly", label: labels.weekly },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownPill
        label={labels.range}
        value={filters.range}
        options={rangeOptions}
        onSelect={(value) =>
          onChange({
            ...filters,
            range: value as DashboardFilters["range"],
          })
        }
      />

      <DropdownPill
        label=""
        value={filters.granularity}
        options={granularityOptions}
        onSelect={(value) =>
          onChange({
            ...filters,
            granularity: value as DashboardFilters["granularity"],
          })
        }
      />

      <TogglePill
        label={labels.compare}
        active={filters.compare}
        onToggle={() => onChange({ ...filters, compare: !filters.compare })}
      />

      <TogglePill
        label={labels.previousPeriod}
        active={filters.previousPeriod}
        onToggle={() =>
          onChange({
            ...filters,
            previousPeriod: !filters.previousPeriod,
          })
        }
      />
    </div>
  );
};
