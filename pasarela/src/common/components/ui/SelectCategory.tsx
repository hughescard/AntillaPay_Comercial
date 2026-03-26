'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CategoryKeys } from '@/common/types/userTypes';

export interface SelectOption {
  value: string | number;
  label: string;
  flag?: string;
}

export interface CategoryGroup {
  label: string;
  options: SelectOption[];
}

interface SelectCategoryProps {
  value: string | number;
  onChange: (value: string | number) => void;
  groups: CategoryGroup[];
  placeholder?: string;
  searchPlaceholder?: string;
  id?: string;
  tabIndex?: number;
}

export const SelectCategory = ({
  value,
  onChange,
  groups,
  placeholder = "common.select",
  searchPlaceholder = "common.searchPlaceholder",
  id,
  tabIndex
}: SelectCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const selectedOption = useMemo(() => {
    for (const group of groups) {
      const found = group.options.find(opt => opt.value === value);
      if (found) return found;
    }
    return null;
  }, [groups, value]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    
    return groups.map(group => ({
      ...group,
      options: group.options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(group => group.options.length > 0); 
  }, [groups, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      const allExpanded: Record<string, boolean> = {};
      filteredGroups.forEach(g => { allExpanded[g.label] = true; });
      setExpandedCategories(allExpanded);
    } else {
    }
  }, [searchTerm, filteredGroups]);

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

  const toggleCategory = (label: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
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
          {selectedOption ? t(selectedOption.label as CategoryKeys) : t(placeholder as 'common.select')}
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
        {/* Search Bar */}
        <div className="p-2 border-b border-divider bg-surface-muted">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t(searchPlaceholder as 'common.searchPlaceholder')}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
          {filteredGroups.length === 0 && (
            <div className="px-4 py-2 text-sm text-muted-foreground text-center italic">
              {t('common.resultsNotFound')}
            </div>
          )}

          {filteredGroups.map((group) => {
            const isExpanded = expandedCategories[group.label];
            
            return (
              <div key={group.label} className="border-b border-divider last:border-0">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(group.label)}
                  className="w-full px-3 py-2 text-sm font-semibold text-foreground flex items-center justify-between hover:bg-surface-muted transition-colors text-left"
                >
                  <span className="text-muted-foreground/80 font-medium">{t(group.label as CategoryKeys)}</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>

                {/* Options List (Accordion Body) */}
                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <ul className="pb-1">
                    {group.options.map((opt) => (
                      <li
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`
                          pl-6 pr-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-surface-muted transition-colors
                          ${value === opt.value ? 'bg-accent/10 text-accent font-medium' : 'text-foreground'}
                        `}
                      >
                        <span>{t(opt.label as CategoryKeys)}</span>
                        {value === opt.value && <Check className="w-4 h-4" />}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};