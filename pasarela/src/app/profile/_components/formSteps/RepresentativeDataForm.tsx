/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import {  useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InputCustom } from '@/common/components/ui/InputCustom'; 
import { User } from '@/common/types/userTypes';
import { sanitizeTextInput } from '@/lib/profileValidations'; 
import { useLocationSelector } from '@/common/hooks/useLocationSelector';

interface RepresentativeDataFormProps {
  data: User;
  onChange: (field: keyof User, value: string) => void;
  errors?: Record<string, string>;
}

export const RepresentativeDataForm = ({ data, onChange, errors = {} }: RepresentativeDataFormProps) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apartment, setApartment] = useState(''); 
  const { 
      countryCode, stateCode, phoneOptions, phonePrefix, phoneCountryCode,cityName,
      countryOptions, stateOptions, cityOptions,   
      setCountry, setState, setCity, setPhoneCountry,          
      hasCountry, hasState                      
    } = useLocationSelector({
      initialCountryName: data.representativeCountry, 
      initialStateName: data.representativeState,     
      initialCity: data.representativeCity,
      initialPhoneCode: data.representativePhone? data.representativePhone.split(' ')[0] : undefined,
      onLocationChange: (data) => {
        onChange('representativeCountry',data.countryName);
        onChange('representativeState',data.stateName);
        onChange('representativeCity',data.cityName);
        onChange('representativePhone', `${data.phoneCode} ${phoneNumber}`);
      }
    });
  

  useEffect(() => {
    if (data.representativeName) {
        const parts = data.representativeName.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
    }
    if (data.representativePhone) {
        if (data.representativePhone.includes(' ')) {
             const [code, ...num] = data.representativePhone.split(' ');
             setPhoneNumber(num.join(''));
        } else {
             setPhoneNumber(data.representativePhone);
        }
    }
    if (data.representativeAddress && data.representativeAddress.includes(', Apt ')) {
        const [addr, apt] = data.representativeAddress.split(', Apt ');
        setApartment(apt || '');
    }
  }, []);


  const handleNameChange = (first: string, last: string) => {
    setFirstName(first);
    setLastName(last);
    onChange('representativeName', `${first} ${last}`.trim());
  };

  const handlePhoneChange = (number: string) => {
    setPhoneNumber(number);
    onChange('representativePhone', `${phonePrefix} ${number}`);
  };

  const handleAddressChange = (addr: string, apt: string) => {
      const finalAddress = apt ? `${addr}, Apt ${apt}` : addr;
      onChange('representativeAddress', finalAddress);
  };

  

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {t('profile.repDataTitle')}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {t('profile.repDataDesc')}
        </p>
        <div className="bg-surface-muted p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
                {t('profile.repDataSubDesc')}
            </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Nombre Legal */}
        <div className="space-y-1">
            <InputCustom
                id="legal-name"
                type="text"
                label={`${t('userInfo.fields.legalName')} *`}
                placeholder=""
                value={firstName}
                action={(val) => handleNameChange(sanitizeTextInput(val as string), lastName)}
                error={errors.representativeName} 
                tabIndex={1}
            />
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                {t('userInfo.fields.nameHelp')}
            </p>
        </div>

        {/* Apellido Legal */}
        <InputCustom
            id="legal-surname"
            type="text"
            label={`${t('userInfo.fields.legalSurname')} *`}
            placeholder=""
            value={lastName}
            action={(val) => handleNameChange(firstName, sanitizeTextInput(val as string))}
            tabIndex={2}
        />

        {/* Email */}
        <InputCustom
            id="rep-email"
            type="text"
            label={`${t('userInfo.fields.email')} *`}
            placeholder="nombre@ejemplo.com"
            value={data.representativeEmail || ''}
            action={(val) => onChange('representativeEmail', val as string)}
            error={errors.representativeEmail}
            tabIndex={3}
        />

        {/* Fecha Nacimiento */}
        <InputCustom
            id="rep-dob"
            type="date"
            label={`${t('userInfo.fields.dob')} *`}
            value={data.representativeBirthDate || ''}
            action={(val) => onChange('representativeBirthDate', val as string)}
            error={errors.representativeBirthDate}
            tabIndex={4}
        />

         {/* Teléfono */}
        <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
                {`${t('userInfo.fields.phone')} *`}
            </label>
            <div className="flex gap-2">
                <div className="w-32">
                     <InputCustom
                        id="phone-code"
                        type="select"
                        value={phoneCountryCode}
                        action={(val) => setPhoneCountry(val as string)}
                        options={phoneOptions}
                        tabIndex={5}
                     />
                </div>
                <div className="flex-1">
                    <InputCustom
                        id="phone-number"
                        type="text"
                        placeholder="000 000 00"
                        value={phoneNumber}
                        action={(val) => handlePhoneChange(val.toString().replace(/\D/g, ''))}
                        error={errors.representativePhone}
                        tabIndex={6}
                    />
                </div>
            </div>
        </div>


        {/* SECCIÓN DOMICILIO PARTICULAR */}
        <div className="pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground mb-4">{t('profile.personalAddress')}</h3>
            
            <div className="space-y-4">
                {/* País */}
                <InputCustom
                    id="rep-country"
                    type="select"
                    label={`${t('userInfo.fields.country')} *`}
                    placeholder={t('userInfo.fields.selectCountry')}
                    value={countryCode}
                    action={(val) => setCountry(val)}
                    options={countryOptions}
                    error={errors.representativeCountry}
                    tabIndex={7}
                />

                {/* Provincia */}
                <InputCustom
                    id="rep-province"
                    type="select"
                    label={`${t('userInfo.fields.province')} *`}
                    placeholder={t('userInfo.fields.selectProvince')}
                    value={stateCode}
                    action={(val) => {
                        setState(val as string);
                    }}
                    options={stateOptions}
                    error={errors.representativeState}
                    disabled={!hasCountry}
                    disabledText={t('common.dependencies.state_select_hint')}
                    tabIndex={8}
                />

                {/* Municipio */}
                <InputCustom
                    id="rep-municipality"
                    type="select"
                    label={`${t('userInfo.fields.municipality')} *`}
                    placeholder={t('userInfo.fields.selectMunicipality')}
                    value={cityName}
                    action={(val) => setCity(val as string)}
                    options={cityOptions}
                    error={errors.representativeCity}
                    tabIndex={9}
                    disabled={!hasState}
                    disabledText={t('common.dependencies.city_select_hint')}
                />

                {/* Código Postal (Opcional) */}
                <InputCustom
                    id="rep-postal"
                    type="text"
                    label={`${t('userInfo.fields.postalCode')} *`}
                    value={data.representativePostalCode || ''}
                    action={(val) => onChange('representativePostalCode', val.toString().replace(/\D/g, ''))}
                    error={errors.representativePostalCode}
                    maxLength={10}
                    tabIndex={10}
                />

                {/* Dirección */}
                <InputCustom
                    id="rep-address"
                    type="text"
                    label={`${t('userInfo.fields.street')} *`}
                    placeholder="Calle y número"
                    value={data.representativeAddress ? data.representativeAddress.split(', Apt ')[0] : ''}
                    action={(val) => handleAddressChange(val as string, apartment)}
                    error={errors.representativeAddress}
                    tabIndex={11}
                />

                <InputCustom
                    id="rep-apt"
                    type="text"
                    label={t('userInfo.fields.apartment')}
                    placeholder=""
                    value={apartment}
                    action={(val) => {
                        setApartment(val as string);
                        handleAddressChange(data.representativeAddress ? data.representativeAddress.split(', Apt ')[0] : '', val as string);
                    }}
                    tabIndex={12}
                />

                
            </div>
        </div>
      </div>
    </div>
  );
};