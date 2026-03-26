/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InputCustom } from '@/common/components/ui/InputCustom'; 
import { User } from '@/common/types/userTypes';
import { sanitizeTextInput } from '@/lib/profileValidations';
import { useLocationSelector } from '@/common/hooks/useLocationSelector';

interface PublicDataFormProps {
  data: User;
  onChange: (field: keyof User, value: string | boolean) => void;
  errors?: Record<string, string>;
}

export const PublicDataForm = ({ data, onChange, errors = {} }: PublicDataFormProps) => {
  const { t } = useTranslation();

  const [phoneNumber, setPhoneNumber] = useState('');

  const separator = ', Apt ';
  const rawAddress = data.supportAddress || '';
  const hasApt = rawAddress.includes(separator);

   const { 
        countryCode, stateCode, phoneOptions, phonePrefix, phoneCountryCode,cityName,
        countryOptions, stateOptions, cityOptions,   
        setCountry, setState, setCity, setPhoneCountry,          
        hasCountry, hasState                      
      } = useLocationSelector({
        initialCountryName: data.supportCountry, 
        initialStateName: data.supportState,     
        initialCity: data.supportCity,
        initialPhoneCode: data.supportPhone? data.supportPhone.split(' ')[0] : undefined,
        onLocationChange: (data) => {
          onChange('supportCountry',data.countryName);
          onChange('supportState',data.stateName);
          onChange('supportCity',data.cityName);
          onChange('supportPhone', `${data.phoneCode} ${phoneNumber}`);
        }
      });

  const currentStreet = hasApt ? rawAddress.split(separator)[0] : rawAddress;
  const currentApt = hasApt ? rawAddress.split(separator)[1] : '';

  const handleAddressChange = (newStreet: string, newApt: string) => {
    const cleanStreet = sanitizeTextInput(newStreet);
    const cleanApt = sanitizeTextInput(newApt);

    if (cleanApt.trim().length > 0) {
        onChange('supportAddress', `${cleanStreet}${separator}${cleanApt}`);
    } else {
        onChange('supportAddress', cleanStreet);
    }
  };

  useEffect(() => {
    if (data.supportPhone) {
        if (data.supportPhone.includes(' ')) {
             const [code, ...num] = data.supportPhone.split(' ');
             setPhoneNumber(num.join(''));
        } else {
             setPhoneNumber(data.supportPhone);
        }
    }
  }, []);

  const handlePhoneChange = ( number: string) => {
    setPhoneNumber(number);
    onChange('supportPhone', `${phonePrefix} ${number}`);
  };

  

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {t('profile.publicDataTitle')}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t('profile.publicDataDesc')}
        </p>
      </div>

      <div className="space-y-6">
        
        <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-2">{t('profile.supportDataTitle')}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t('profile.supportDataDesc')}</p>

            {/* Teléfono de Soporte */}
            <div className="w-full mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                    {t('userInfo.fields.supportPhone')} *
                </label>
                <div className="flex gap-2">
                    <div className="w-32">
                        <InputCustom
                            id="support-phone-code"
                            type="select"
                            value={phoneCountryCode}
                            action={(val) => setPhoneCountry(val as string)}
                            options={phoneOptions}
                            tabIndex={1}
                        />
                    </div>
                    <div className="flex-1">
                        <InputCustom
                            id="support-phone-number"
                            type="text"
                            placeholder="000 000 00"
                            value={phoneNumber}
                            action={(val) => handlePhoneChange(val.toString().replace(/\D/g, ''))}
                            error={errors.supportPhone}
                            tabIndex={2}
                        />
                    </div>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 mb-6">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={Boolean(data.showSupportPhone)}
                        onChange={(e) => onChange('showSupportPhone', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-surface-strong peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
                <span className="text-sm font-medium text-foreground">
                    {t('profile.showPhoneLabel')}
                </span>
            </div>

            <div className='mb-4'>
              {/* Email */}
              <InputCustom
                  id="rep-email"
                  type="text"
                  label={`${t('userInfo.fields.email')} *`}
                  placeholder="nombre@ejemplo.com"
                  value={data.supportEmail || ''}
                  action={(val) => onChange('supportEmail', val as string)}
                  error={errors.supportEmail}
                  tabIndex={3}
              />
            </div>
             

            {/* Dirección de Soporte */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground">{t('userInfo.fields.supportAddressTitle')}</h4>
                
                {/* País */}
                <InputCustom
                    id="support-country"
                    type="select"
                    label={`${t('userInfo.fields.country')} *`}
                    value={countryCode}
                    action={(val) => setCountry( val as string)}
                    options={countryOptions}
                    error={errors.supportCountry}
                    tabIndex={4}
                />

                {/* Provincia */}
                <InputCustom
                    id="support-province"
                    type="select"
                    label={`${t('userInfo.fields.province')} *`}
                    placeholder={`${t('userInfo.fields.selectProvince')}`}
                    value={stateCode}
                    action={(val) => setState(val as string)}
                    options={stateOptions}
                    error={errors.supportState}
                    tabIndex={5}
                    disabled={!hasCountry}
                    disabledText={t('common.dependencies.state_select_hint')}
                />

                {/* Municipio */}
                <InputCustom
                    id="support-municipality"
                    type="select"
                    label={`${t('userInfo.fields.municipality')} *`}
                    value={cityName}
                    action={(val) => setCity(val as string)}
                    options={cityOptions}
                    error={errors.supportCity}
                    tabIndex={6}
                    disabled={!hasState}
                />

                {/* Código Postal */}
                <InputCustom
                    id="support-postal"
                    type="text"
                    label={`${t('userInfo.fields.postalCode')} *`}
                    value={data.supportPostalCode || ''}
                    action={(val) => onChange('supportPostalCode', val.toString().replace(/\D/g, ''))}
                    error={errors.supportPostalCode}
                    maxLength={10}
                    tabIndex={7}
                />

                {/* Calle (Inputs concatenados) */}
                <InputCustom
                    id="support-address"
                    type="text"
                    label={`${t('userInfo.fields.street')} *`} 
                    value={currentStreet} 
                    action={(val) => handleAddressChange(val as string, currentApt)} 
                    error={errors.supportAddress}
                    tabIndex={8}
                />

                {/* Apartamento (Inputs concatenados) */}
                <InputCustom
                    id="support-apt"
                    type="text"
                    label={`${t('userInfo.fields.apartment')}`}
                    value={currentApt} 
                    action={(val) => handleAddressChange(currentStreet, val as string)} 
                    tabIndex={9}
                />

            </div>
        </div>

      </div>
    </div>
  );
};