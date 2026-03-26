'use client';
import { useTranslation } from 'react-i18next';
import { InputCustom } from '@/common/components/ui/InputCustom'; 
import { User } from '@/common/types/userTypes'; 
import { COMPANY_STRUCTURES } from '@/lib/profileConstants';

interface FiscalDataFormProps {
  data: User;
  onChange: (field: keyof User, value: string) => void;
  errors?: Record<string, string>;
}

export const FiscalDataForm = ({ data, onChange, errors = {} }: FiscalDataFormProps) => {
  const { t } = useTranslation();

  const structureOptions = COMPANY_STRUCTURES.map((item) => ({
    value: item.value,
    label: t(item.label)
  }));

  const handleNitChange = (value: string | number) => {
    const cleanValue = value.toString().replace(/\D/g, '');

    if (cleanValue.length > 9) return;

    let formattedValue = cleanValue;
    if (cleanValue.length > 2) {
      formattedValue = `${cleanValue.slice(0, 2)}-${cleanValue.slice(2)}`;
    }

    onChange('documentationId', formattedValue);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {t('profile.fiscalDataTitle')}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t('profile.fiscalDataDesc')}
        </p>
      </div>

      <div className="space-y-6">

        <div className="space-y-1">
            <InputCustom
                id="name"
                type="text"
                label={`${t('profile.name')} *`}
                placeholder={''}
                value={data.name || ''}
                action={(val) => onChange('name', val as string)}
                options={structureOptions}
                error={errors.name}
                tabIndex={1}
            />
        </div>
        
        {/* Select Estructura de la empresa */}
        <div className="space-y-1">
            <InputCustom
                id="businessType"
                type="select"
                label={`${t('profile.structureLabel')} *`}
                placeholder={t('profile.structurePlaceholder')}
                value={data.businessType || ''}
                action={(val) => onChange('businessType', val as string)}
                options={structureOptions}
                error={errors.businessType}
                tabIndex={2}
            />
        </div>

        {/* Input NIT */}
        <div className="space-y-1">
            <InputCustom
                id="documentationId"
                type="text"
                label={`${t('userInfo.fields.nit')} *`}
                placeholder="00-0000000"
                value={data.documentationId || ''}
                action={handleNitChange}
                error={errors.documentationId}
                tabIndex={3}
            />
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                {t('profile.nitHelp')}
            </p>
        </div>

      </div>
    </div>
  );
};