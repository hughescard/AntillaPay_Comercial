import { Step } from '@/common/types/stepsProfileTypes';
import { User } from '@/common/types/userTypes';
import { CheckCircle } from 'lucide-react';

export const VERIFICATION_STEPS = [
  { id: 1, key: 'fiscalData', label: 'profile.fiscalData' },
  { id: 2, key: 'companyData', label: 'profile.companyData' },
  { id: 3, key: 'representative', label: 'profile.representative' },
  { id: 4, key: 'productsServices', label: 'profile.productsServices' },
  { id: 5, key: 'publicData', label: 'profile.publicData' },
] as const;

export const REVIEW_STEP: Step = { 
  id: 6, 
  key: 'review', 
  label: 'profile.review', 
  icon: CheckCircle 
};

export const TOTAL_STEPS = VERIFICATION_STEPS.length + 1; 

export const COMPANY_STRUCTURES = [
  { value: 'state_company', label: 'profile.structures.state_company' },
  { value: 'cooperative', label: 'profile.structures.cooperative' },
  { value: 'self_employed', label: 'profile.structures.self_employed' },
  { value: 'mipyme', label: 'profile.structures.mipyme' },
  { value: 'mixed_company', label: 'profile.structures.mixed_company' },
] as const;



export const INITIAL_DATA: User = {
  id: '',
  documentationId: '', 
  name: '',            
  businessType: '',    
  commercialName: '',  
  country: '',
  state: '',           
  city: '',            
  address: '',
  postalCode: '',
  website: '',

  representativeName: '',      
  representativeEmail: '',     
  representativePhone: '',     
  representativeBirthDate: '', 
  representativeCountry: '',   
  representativeState: '',    
  representativeCity: '',      
  representativeAddress: '',   
  representativePostalCode: '',

  category: '',
  description: '',

  supportPhone: '',
  supportEmail: '',
  supportCountry:'',
  supportState: '',    
  supportCity: '',   
  supportAddress: '',
  supportPostalCode: '',
  showSupportPhone: false,

  grossBalance: 0,
  netBalance: 0,
  validated:'false'
};


const REQUIRED_FIELDS = {
  1: ['documentationId', 'businessType','name'],
  2: ['country', 'state', 'city', 'address','commercialName'], 
  3: [
    'representativeName', 
    'representativeEmail', 
    'representativePhone', 
    'representativeBirthDate', 
    'representativeCountry', 
    'representativeState', 
    'representativeCity', 
    'representativeAddress'
  ],
  4: ['category', 'description'],
  5: ['supportPhone', 'supportState', 'supportCity', 'supportAddress', 'supportEmail','supportCountry'] 
} as const;


const hasValue = (value: string | boolean | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};


export const isStepComplete = (step: number, data: User): boolean => {
  const fieldsToCheck = REQUIRED_FIELDS[step as keyof typeof REQUIRED_FIELDS];
  
  if (!fieldsToCheck) return false;

  return fieldsToCheck.every(field => hasValue(data[field]));
};


export const getCompletedSteps = (data: User): number[] => {
  const completedSteps: number[] = [];
  
  for (let i = 1; i <= 5; i++) {
    if (isStepComplete(i, data)) {
      completedSteps.push(i);
    }
  }
  
  return completedSteps;
};