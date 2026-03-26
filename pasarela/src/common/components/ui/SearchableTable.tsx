'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
  value: string | number;
  label: string;
  flag?: string; 
}

interface SearchableSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  id?: string;
  tabIndex?: number;
}

export const SearchableSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Seleccionar",
  searchPlaceholder = "Buscar...",
  id,
  tabIndex
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {t} = useTranslation();

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={tabIndex}
        className={`cursor-pointer
          w-full h-10 px-3 rounded-md border bg-background text-left flex items-center justify-between shadow-sm
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all
          ${isOpen ? 'border-accent ring-2 ring-accent' : 'border-border'}
        `}
      >
        <span className={`block truncate ${!selectedOption ? 'text-muted-foreground/50' : 'text-foreground'}`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.flag && <span>{selectedOption.flag}</span>}
              {selectedOption.label}
            </span>
          ) : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* DROPDOWN MENU */}
      <div
        className={`
          absolute z-50 mt-1 w-full rounded-md shadow-lg bg-surface border border-border overflow-hidden
          origin-top transition-all duration-200 ease-out
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="p-2 border-b border-divider bg-surface-muted">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
          {filteredOptions.length === 0 && (
            <li className="px-4 py-2 text-sm text-muted-foreground text-center italic">
                {t('common.resultsNotFound')}
            </li>
          )}

          {filteredOptions.map((opt,index) => (
            <li
              key={index}
              onClick={() => handleSelect(opt.value)}
              className={`
                px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-surface-muted transition-colors
                ${value === opt.value ? 'bg-accent/10 text-accent font-medium' : 'text-foreground'}
              `}
            >
              <span className="flex items-center gap-2">
                {opt.flag && <span>{opt.flag}</span>}
                {opt.label}
              </span>
              {value === opt.value && <Check className="w-4 h-4" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};