import { CATEGORY_GROUPS } from "@/lib/businessCategories";

export type User={
  id: string;
  
  name: string;                   
  documentationId: string | null; 
  businessType: string;          

  commercialName: string | null;   
  country: string;
  state: string | null;           
  city: string | null;           
  address: string | null;
  postalCode: string | null;
  website: string | null;
  
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  representativeBirthDate: string;
  representativeCountry: string;
  representativeState: string | null;
  representativeCity: string | null;
  representativeAddress: string | null;
  representativePostalCode: string | null;
  
  category: string;
  description: string | null;
  
  supportPhone: string | null;
  supportEmail: string | null;
  supportCountry: string | null;
  supportState: string | null;
  supportCity: string | null;
  supportAddress: string | null;
  supportPostalCode: string | null;
  showSupportPhone: boolean;

  grossBalance: number;
  netBalance: number;
  validated: "true" | "false" | "pending";

  [key: string]: boolean | string | number | null | undefined; 
}

export interface SelectOption {
  value: string | number;
  label: string;
  flag?: string;
}

export interface GroupedOption {
  label: string;
  options: SelectOption[];
}

type GroupLabels = typeof CATEGORY_GROUPS[number]['label'];

type OptionLabels = typeof CATEGORY_GROUPS[number]['options'][number]['label'];

export type CategoryKeys = GroupLabels | OptionLabels;