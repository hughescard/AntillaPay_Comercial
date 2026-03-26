/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Country, State, City } from 'country-state-city';

export interface LocationOption {
  value: string;
  label: string;
  flag?: string;
  phoneCode?: string;
}

interface LocationOverrides {
  addrCountry?: string; 
  addrState?: string;   
  addrCity?: string;    
  phCountry?: string;   
}

interface UseLocationSelectorParams {
  initialCountryCode?: string | null; 
  initialStateCode?: string | null;   
  initialCountryName?: string | null;
  initialStateName?: string | null;  
  initialCity?: string | null;        
  
  initialPhoneCode?: string | null;

  onLocationChange?: (data: { 
    countryName: string; 
    countryCode: string;
    stateName: string; 
    stateCode: string;
    cityName: string; 
    phoneCode: string;
    phoneCountryCode: string;
  }) => void;
}

export const useLocationSelector = ({ 
  initialCountryCode = '', 
  initialStateCode = '',
  initialCountryName = '',
  initialStateName = '',
  initialCity = '',
  initialPhoneCode = '', 
  onLocationChange 
}: UseLocationSelectorParams = {}) => {
  
  const [addressCountryCode, setAddressCountryCode] = useState('');
  const [addressStateCode, setAddressStateCode] = useState('');
  const [addressCityName, setAddressCityName] = useState('');
  
  const [phoneCountryCode, setPhoneCountryCode] = useState('');

  useEffect(() => {
    let activeAddrCountry = initialCountryCode;
    let activeAddrState = initialStateCode;
    
    if (!activeAddrCountry && initialCountryName) {
      const found = Country.getAllCountries().find(
        c => c.name.toLowerCase() === initialCountryName.toLowerCase()
      );
      if (found) activeAddrCountry = found.isoCode;
    }

    if (activeAddrCountry && !activeAddrState && initialStateName) {
      const found = State.getStatesOfCountry(activeAddrCountry).find(
        s => s.name.toLowerCase() === initialStateName.toLowerCase()
      );
      if (found) activeAddrState = found.isoCode;
    }

    if (initialPhoneCode && !phoneCountryCode) {
      const cleanCode = initialPhoneCode.replace(/\+/g, '').trim();
      
      const foundCountry = Country.getAllCountries().find(c => c.phonecode === cleanCode);
      
      if (foundCountry) {
        setPhoneCountryCode(foundCountry.isoCode);
      }
    }

    if (activeAddrCountry) setAddressCountryCode(activeAddrCountry);
    if (activeAddrState) setAddressStateCode(activeAddrState);
    if (initialCity) setAddressCityName(initialCity);

  }, [initialCountryCode, initialCountryName, initialStateCode, initialStateName, initialCity, initialPhoneCode]);

  const countryOptions = useMemo(() => Country.getAllCountries().map(c => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
    })).sort((a, b) => a.label.localeCompare(b.label)), []);

  const phoneOptions = useMemo(() => Country.getAllCountries().map((c) => ({
      value: c.isoCode, 
      label: `${c.flag} +${c.phonecode}`, 
      phoneCode: `+${c.phonecode}`
    })).sort((a, b) => a.label.localeCompare(b.label)), []);

  const stateOptions = useMemo(() => {
    if (!addressCountryCode) return [];
    return State.getStatesOfCountry(addressCountryCode).map(s => ({
      value: s.isoCode, label: s.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [addressCountryCode]);

  const cityOptions = useMemo(() => {
    if (!addressCountryCode && !addressStateCode) return [];
    return (City.getCitiesOfState(addressCountryCode, addressStateCode) || []).map(c => ({
      value: c.name, label: c.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [addressCountryCode, addressStateCode]);

  const currentPhonePrefix = useMemo(() => {
    if (!phoneCountryCode) return '';
    const country = Country.getCountryByCode(phoneCountryCode);
    return country ? `+${country.phonecode}` : '';
  }, [phoneCountryCode]);

  const notifyChange = useCallback((overrides: LocationOverrides = {}) => {
    if (!onLocationChange) return;

    const finalAddrCountry = overrides.addrCountry ?? addressCountryCode;
    const finalAddrState = overrides.addrState ?? addressStateCode;
    const finalAddrCity = overrides.addrCity ?? addressCityName;
    const finalPhoneIso = overrides.phCountry ?? phoneCountryCode;

    const cData = Country.getCountryByCode(finalAddrCountry);
    const sData = State.getStateByCodeAndCountry(finalAddrState, finalAddrCountry);
    const pData = Country.getCountryByCode(finalPhoneIso);

    onLocationChange({
      countryName: cData?.name || '',
      countryCode: finalAddrCountry,
      stateName: sData?.name || '',
      stateCode: finalAddrState,
      cityName: finalAddrCity,
      phoneCode: pData ? `+${pData.phonecode}` : '', 
      phoneCountryCode: finalPhoneIso
    });
  }, [onLocationChange, addressCountryCode, addressStateCode, addressCityName, phoneCountryCode]);

  const handleAddressCountryChange = useCallback((val: string | number) => {
    const code = val.toString();
    setAddressCountryCode(code);
    setAddressStateCode('');
    setAddressCityName('');
    notifyChange({ addrCountry: code, addrState: '', addrCity: '' });
  }, [notifyChange]);

  const handleStateChange = useCallback((val: string | number) => {
    const code = val.toString();
    setAddressStateCode(code);
    setAddressCityName('');
    notifyChange({ addrState: code, addrCity: '' });
  }, [notifyChange]);

  const handleCityChange = useCallback((val: string | number) => {
    const name = val.toString();
    setAddressCityName(name);
    notifyChange({ addrCity: name });
  }, [notifyChange]);

  const handlePhoneCountryChange = useCallback((val: string | number) => {
    const isoCode = val.toString();
    setPhoneCountryCode(isoCode);
    notifyChange({ phCountry: isoCode });
  }, [notifyChange]);

  return {
    countryCode: addressCountryCode,
    stateCode: addressStateCode,
    cityName: addressCityName,
    
    phoneCountryCode: phoneCountryCode, 
    phonePrefix: currentPhonePrefix, 
    
    countryOptions,
    stateOptions,
    cityOptions,
    phoneOptions,   
    
    setCountry: handleAddressCountryChange,
    setState: handleStateChange,
    setCity: handleCityChange,
    setPhoneCountry: handlePhoneCountryChange,

    hasCountry: !!addressCountryCode,
    hasState: !!addressStateCode
  };
};