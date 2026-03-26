import { User } from "@/common/types/userTypes";
import { TFunction } from "i18next";

export const sanitizeTextInput = (value: string) => {
    return value.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s.,]/g, '');
  };

const isValidNit = (nit: string | null) => {
    if (!nit) return false;
    return /^\d{2}-\d{7}$/.test(nit);
};

const isValidWebsite = (url: string | null) => {
    if (!url) return true; 
    return url.includes('.');
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
  return /^[\d\s+]{8,}$/.test(phone);
};

const isValidDescriptor = (text: string) => {
    return text.length >= 2 && text.length <= 10;
};

export const validateStep1 = (data: User, t: TFunction<"translation", undefined>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.businessType) {
        errors.businessType = t('validations.businessTypeRequired');
    }

    if (!data.documentationId) {
        errors.documentationId = t('validations.nitRequired');
    } else if (!isValidNit(data.documentationId)) {
        errors.documentationId = t('validations.nitFormat');
    }

    return errors;
};

export const validateStep2 = (data: User, t: TFunction<"translation", undefined>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if(!data.commercialName || data.commercialName.trim() === '') errors.commercialName = t('validations.required');
    if (!data.country) errors.country = t('validations.required');
    if (!data.postalCode) errors.postalCode = t('validations.required');
    if (!data.state) errors.state = t('validations.required');
    if (!data.city) errors.city = t('validations.required');
    if (!data.address || data.address.trim() === '') errors.address = t('validations.required');

    if (data.website && !isValidWebsite(data.website)) {
        errors.website = t('validations.invalidWebsite');
    }

    return errors;
};

export const validateStep3 = (data: User, t: TFunction<"translation", undefined>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.representativeName) errors.representativeName = t('validations.required');
    
    if (!data.representativeEmail) {
        errors.representativeEmail = t('validations.required');
    } else if (!isValidEmail(data.representativeEmail)) {
        errors.representativeEmail = t('validations.invalidEmail');
    }

    if (!data.representativeBirthDate) errors.representativeBirthDate = t('validations.required');
    
    const birthDate = new Date(data.representativeBirthDate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    if (Math.abs(ageDate.getUTCFullYear() - 1970) < 18) {
        errors.representativeBirthDate = t('validations.underage');
    }

    if (!data.representativeCountry) errors.representativeCountry = t('validations.required');
    if (!data.representativeState) errors.representativeState = t('validations.required');
    if (!data.representativeCity) errors.representativeCity = t('validations.required');
    if (!data.representativeAddress) errors.representativeAddress = t('validations.required');
    if (!data.representativePostalCode) errors.representativePostalCode = t('validations.required');
    
    if (!data.representativePhone) {
        errors.representativePhone = t('validations.required');
    } else if (!isValidPhone(data.representativePhone)) {
        errors.representativePhone = t('validations.invalidPhone');
    }

    return errors;
};

export const validateStep4 = (data: User, t: TFunction<"translation", undefined>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.category) {
        errors.category = t('validations.required');
    }

    if (!data.description) {
        errors.description = t('validations.required');
    } else if (data.description.length < 10) {
        errors.description = t('validations.descTooShort'); 
    }

    return errors;
};

export const validateStep5 = (data: User, t: TFunction<"translation", undefined>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (data.descriptor && !isValidDescriptor(data.descriptor as string)) {
         errors.descriptor = t('validations.descriptorLength');
    }

    if (!data.supportPhone) {
        errors.supportPhone = t('validations.required');
    } else if (!isValidPhone(data.supportPhone)) { 
        errors.supportPhone = t('validations.invalidPhone');
    }

    if (!data.supportCountry) errors.supportCountry = t('validations.required');
    if (!data.supportEmail) errors.supportEmail = t('validations.required');
    
    if (!data.supportState) errors.supportState = t('validations.required');
    if (!data.supportCity) errors.supportCity = t('validations.required');
    if (!data.supportAddress) errors.supportAddress = t('validations.required');
    if (!data.supportPostalCode) errors.supportPostalCode = t('validations.required');

    return errors;
};

export const validateStep = (step: number, data: User, t: TFunction<"translation", undefined>): {errors?: Record<string, string>, validation: boolean} => {
  switch (step) {
    case 1: 
        const errors1 = validateStep1(data, t);
        if(Object.keys(errors1).length > 0) return {errors: errors1, validation: false};
        return {validation: true};
    case 2: 
        const errors2 = validateStep2(data, t);
        if(Object.keys(errors2).length > 0) return {errors: errors2, validation: false};
        return {validation: true};
    case 3: 
        const errors3 = validateStep3(data, t);
        if(Object.keys(errors3).length > 0) return {errors: errors3, validation: false};  
        return {validation: true};
    case 4: 
        const errors4 = validateStep4(data, t);
        if(Object.keys(errors4).length > 0) return {errors: errors4, validation: false};
        return {validation: true};
    case 5:
        const errors5 = validateStep5(data, t);
        if(Object.keys(errors5).length > 0) return {errors: errors5, validation: false};             
        return {validation: true};
    case 6: 
      return {validation: true};

    default:
      return {validation: false};
  }
};