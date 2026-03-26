'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string; 
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: (string | SelectOption)[]; 
  placeholder?: string;
  multiselect?: boolean;
  className?: string; 
}

export const CustomSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder, 
  multiselect,
  className
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalizar opciones
  const formattedOptions: SelectOption[] = useMemo(() => {
    if (!options) return [];
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return opt;
    });
  }, [options]);

  // Calcular Label a mostrar
  const getDisplayLabel = () => {
    if (multiselect && Array.isArray(value)) {
      if (value.length === 0) return placeholder || "Seleccionar";
      const selectedLabels = value.map(val => {
        const found = formattedOptions.find(opt => opt.value === val);
        return found ? found.label : val; 
      });
      return selectedLabels.join(', ');
    }
    const found = formattedOptions.find(opt => opt.value === value);
    return found ? found.label : (placeholder || "Seleccionar");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (multiselect) {
      const currentValues = Array.isArray(value) ? [...value] : (value ? [value as string] : []);
      const exists = currentValues.includes(val);
      const newValues = exists ? currentValues.filter((item) => item !== val) : [...currentValues, val];
      onChange(newValues);
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative block w-full min-w-0" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-1 ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border shadow-sm
          focus:outline-none focus:ring-2 focus:ring-accent/20 
          bg-surface text-foreground border-border hover:bg-surface-muted
          ${isOpen ? 'border-accent ring-2 ring-accent/20' : ''}
          ${className || 'rounded-md'} 
        `}
      >
        <span className="block min-w-0 truncate mr-2">
          {getDisplayLabel()}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute z-50 w-full max-w-[calc(100vw-1rem)] mt-2 rounded-xl shadow-xl border border-border bg-surface
          origin-top transition-all duration-200 ease-out overflow-hidden
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}
        `}
        style={{ right: 0 }} 
      >
        <ul className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
          {formattedOptions.map((opt, index) => {
            const isSelected = multiselect && Array.isArray(value)
              ? value.includes(opt.value)
              : value === opt.value;

            return (
              <li
                key={`${opt.value}-${index}`}
                onClick={() => handleSelect(opt.value)}
                className={`
                  cursor-pointer px-4 py-2 text-sm flex items-center justify-between transition-colors
                  hover:bg-surface-muted
                  ${isSelected ? 'text-accent font-semibold bg-accent/5' : 'text-foreground'}
                `}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-accent" />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
