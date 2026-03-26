'use client';
import { useTranslation } from 'react-i18next';
import { InputCustom } from '@/common/components/ui/InputCustom'; 
import { User } from '@/common/types/userTypes';
import { sanitizeTextInput } from '@/lib/profileValidations';
import { useLocationSelector } from '@/common/hooks/useLocationSelector';

interface CompanyDataFormProps {
  data: User;
  onChange: (field: keyof User, value: string ) => void;
  errors?: Record<string, string>;
}

export const CompanyDataForm = ({ data, onChange, errors = {} }: CompanyDataFormProps) => {
  const { t } = useTranslation();
  const { 
    countryCode, stateCode, 
    countryOptions, stateOptions, cityOptions,   
    setCountry, setState, setCity,               
    hasCountry, hasState                         
  } = useLocationSelector({
    initialCountryName: data.country, 
    initialStateName: data.state,     
    initialCity: data.city,
    onLocationChange: (data) => {
      onChange('country',data.countryName);
      onChange('state',data.stateName);
      onChange('city',data.cityName);

    }
  });

  const handleTextChange = (field: keyof User, value: string) => {
    const cleanValue = sanitizeTextInput(value);
    onChange(field, cleanValue);
  };

  const handlePostalCodeChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    onChange('postalCode', numbersOnly);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {t('profile.companyDataTitle')}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t('profile.companyDataDesc')}
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Nombre Comercial (DBA) - Opcional en lógica, sin label "Opcional" */}
        <div className="space-y-1">
            <InputCustom
                id="dba-input"
                type="text"
                label={`${t('userInfo.fields.dba')} *`}
                placeholder=""
                value={data.commercialName || ''}
                action={(val) => handleTextChange('commercialName', val as string)}
                error={errors.commercialName}
                tabIndex={1}
            />
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                {t('profile.companyNameHelp')}
            </p>
        </div>

        {/* País - Select */}
        <InputCustom
            id="country-select"
            type="select"
            label={`${t('userInfo.fields.country')} *`}
            placeholder={t('userInfo.fields.selectCountry')}
            value={countryCode || ''}
            action={(val) => setCountry(val as string)}
            options={countryOptions}
            error={errors.country}
            tabIndex={2}
        />

        {/* Provincia - Select */}
        <InputCustom
            id="province-select"
            type="select"
            label={`${t('userInfo.fields.province')} *`}
            placeholder={t('userInfo.fields.selectProvince')}
            value={stateCode|| ''}
            action={(val) => setState(val as string)}
            options={stateOptions}
            error={errors.state}
            tabIndex={3}
            disabled={!hasCountry}
            disabledText={t('common.dependencies.state_select_hint')}
        />

        {/* Municipio - Select */}
        <InputCustom
            id="municipality-select"
            type="select"
            label={`${t('userInfo.fields.municipality')} *`}
            placeholder={t('userInfo.fields.selectMunicipality')}
            value={data.city || ''}
            action={(val) => setCity(val as string)}
            options={cityOptions}
            error={errors.city}
            tabIndex={4}
            disabled={!hasState}
            disabledText={t('common.dependencies.city_select_hint')}
        />

        {/* Dirección - Input */}
        <div className="space-y-1">
            <InputCustom
                id="address-input"
                type="text"
                label={`${t('userInfo.fields.address')} *`}
                placeholder=""
                value={data.address || ''}
                action={(val) => handleTextChange('address', val as string)}
                error={errors.address}
                tabIndex={5}
            />
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                {t('profile.addressHelp')}
            </p>
        </div>

        {/* Código Postal - Input Numérico */}
        <InputCustom
            id="postal-input"
            type="text"
            label={`${t('userInfo.fields.postalCode')} *`}
            placeholder=""
            value={data.postalCode || ''}
            action={(val) => handlePostalCodeChange(val as string)}
            error={errors.postalCode}
            tabIndex={6}
            maxLength={10} 
        />

        {/* Sitio Web - Input (Validación de punto) */}
        <InputCustom
            id="website-input"
            type="text"
            label={t('userInfo.fields.website')}
            placeholder="ejemplo.com"
            value={data.website || ''}
            action={(val) => onChange('website', val as string)}
            error={errors.website}
            tabIndex={7}
        />

      </div>
    </div>
  );
};