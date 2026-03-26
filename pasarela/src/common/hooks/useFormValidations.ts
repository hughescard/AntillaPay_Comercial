import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type ValidationType = 'email' | 'password' | 'confirmPassword' | 'bankAccount' | 'phone' | 'name' | 'text' | 'select';

export interface ValidationRule {
  type: ValidationType;
  required?: boolean;
  strictPassword?: boolean;
  customRegex?: RegExp;
  customMessage?: string;
  matchField?: string; 
}

export type ValidationSchema<T> = Partial<Record<keyof T, ValidationRule>>;

const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_STRICT: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
  BANK_ACCOUNT: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
  PHONE: /^\+?[0-9\s-]{7,15}$/,
  NAME: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,}$/,
};

export const useFormValidation = <T extends Record<string, unknown>>() => {
  const { t } = useTranslation();
  
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback((values: T, schema: ValidationSchema<T>): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    (Object.keys(schema) as Array<keyof T>).forEach((key) => {
      const rawValue = values[key];
      const value = rawValue ? String(rawValue).trim() : '';
      const rule = schema[key];

      if (!rule) return;

      if (rule.required && !value) {
        newErrors[key] = t('errors.required');
        isValid = false;
        return;
      }

      if (!rule.required && !value) {
        return;
      }

      switch (rule.type) {
        case 'email':
          if (!REGEX.EMAIL.test(value)) {
            newErrors[key] = t('errors.invalid_email');
            isValid = false;
          }
          break;

        case 'password':
          if (rule.strictPassword && !REGEX.PASSWORD_STRICT.test(value)) {
            newErrors[key] = t('errors.weak_password');
            isValid = false;
          }
          break;

        case 'confirmPassword':
          if (rule.matchField) {
            const valueToMatch = values[rule.matchField];
            if (value !== valueToMatch) {
              newErrors[key] = t('errors.passwords_do_not_match');
              isValid = false;
            }
          }
          break;

        case 'bankAccount':
          if (!REGEX.BANK_ACCOUNT.test(value)) {
            newErrors[key] = t('errors.invalid_bank_account');
            isValid = false;
          }
          break;

        case 'phone':
          if (!REGEX.PHONE.test(value)) {
            newErrors[key] = t('errors.invalid_phone');
            isValid = false;
          }
          break;

        case 'name':
          if (!REGEX.NAME.test(value)) {
            newErrors[key] = t('errors.invalid_name');
            isValid = false;
          }
          break;

        case 'select': 
        case 'text':
        default:
          if (rule.customRegex && !rule.customRegex.test(value)) {
             newErrors[key] = rule.customMessage || t('errors.invalid_format');
             isValid = false;
          }
          break;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [t]);

  const clearErrors = () => setErrors({});

  return { errors, validate, clearErrors, setErrors };
};