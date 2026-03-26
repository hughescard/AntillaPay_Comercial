'use client';
import { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FieldConfig, PossibleUserFields } from '@/common/types/userInfoTypes';
import { User } from '@/common/types/userTypes';

interface InfoAccordionProps {
  title: string;
  icon: LucideIcon;
  fields: FieldConfig[];
  data: User;
  defaultOpen?: boolean;
}

export const InfoAccordion = ({ title, icon: Icon, fields, data, defaultOpen = false}: InfoAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { t } = useTranslation();

  const getValue = (key:string)=>{
    switch(key){
      case 'country':
      case 'representativeCountry':
      case 'supportCountry':
        return data[key];

      case 'businessType':
        if(data[key]){
          return t(`profile.structures.${data[key] as 'state_company'}`);
        }else{
          return null
        }

      case 'state':
      case 'representativeState':
      case 'supportState':
        return data[key];

      case 'city':
      case 'representativeCity':
      case 'supportCity':
        return data[key];
      default:
        return data[key]
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden mb-4 transition-all hover:drop-shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-soft rounded-lg text-accent">
             <Icon size={20} />
          </div>
          <h3 className="font-bold text-foreground text-lg">{title}</h3>
        </div>
        <ChevronDown 
          className={`text-muted-foreground transition-transform duration-400 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0 border-t border-transparent"> 
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            {fields.map((field) => {
              const value:string = getValue(field.key) as string;
              const FieldIcon = field.icon;
              
              return (
                <div key={field.key} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FieldIcon size={14} />
                    <span className="text-xs font-medium uppercase tracking-wide">
                        {t(field.label as PossibleUserFields)}
                    </span>
                  </div>
                
                  
                  {typeof value === 'boolean' ? (
                      <div className="flex items-center">
                          <div 
                              className={`
                                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                                  ${value ? 'bg-accent' : 'bg-subtle-foreground'} 
                                  border border-transparent cursor-default
                              `}
                          >
                              <span
                                  className={`
                                      pointer-events-none block h-5 w-5 rounded-full bg-surface shadow-lg ring-0 transition-transform 
                                      ${value ? 'translate-x-5' : 'translate-x-0.5'}
                                  `}
                              />
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">
                              {value ? t('common.yes') : t('common.no')}
                          </span>
                      </div>
                  ) : (
                      <p className={`text-sm font-medium wrap-break-word ${!value ? 'text-muted-foreground/50 italic' : 'text-foreground'}`}>
                          {value || t('userInfo.notProvided')}
                      </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};