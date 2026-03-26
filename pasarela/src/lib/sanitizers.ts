
export const MAX_NUMERIC_LENGTH = 15;
export const MAX_NUMERIC_LENGTH_ID = 11;

export const sanitizeText = (value: string): string => {
  return value.replace(/[^\p{L}\s]/gu, '');
};

export const sanitizeEmail = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9.@_\-+]/g, '');
};

export const sanitizeIdNumber = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, MAX_NUMERIC_LENGTH_ID); 
};

export const sanitizeAddress = (value: string): string => {
  return value.replace(/[^\p{L}\d\s/#,.-]/gu, '');
};

export const sanitizeUrl = (url: string): string => {
  if (!url) return '';

  let sanitized = url.replace(/[\s\u0000-\u001F\u007F-\u009F]+/g, '');

  sanitized = sanitized.replace(/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/g, '');

  const maliciousProtocols = /^(javascript|vbscript|data):/i;
  
  try {
    if (maliciousProtocols.test(decodeURIComponent(sanitized))) {
      return ''; 
    }
  } catch {
    return ''; 
  }

  return sanitized;
};

export const sanitizePhone = (value: string): string => {
  const sanitized = value.replace(/[^\d\s+\-]/g, '');
  let digitsCount = 0;
  let result = '';

  for (const char of sanitized) {
    const isDigit = char >= '0' && char <= '9';

    if (digitsCount >= MAX_NUMERIC_LENGTH) break;
    if (isDigit) digitsCount += 1;

    result += char;
  }

  return result;
};

export const sanitizeNoFutureDate = (inputValue: string) => {
  if (!inputValue) return inputValue;

  const selectedDate = new Date(inputValue);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  const offsetSelected = new Date(selectedDate.getTime() + Math.abs(selectedDate.getTimezoneOffset() * 60000));

  if (offsetSelected > today) {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  return inputValue;
};
