import { FileText, User, Globe, MapPin, Mail, Phone, Calendar, Hash, Briefcase } from 'lucide-react';

export const FISCAL_DATA_FIELDS = [
  { key: 'name', label: 'userInfo.fields.companyOfficialName', icon: Briefcase },
  { key: 'documentationId', label: 'userInfo.fields.nit', icon: Hash },
  { key: 'businessType', label: 'userInfo.fields.structure', icon: FileText },
] as const;

export const COMPANY_DATA_FIELDS = [
  { key: 'commercialName', label: 'userInfo.fields.dba', icon: Briefcase },
  { key: 'country', label: 'userInfo.fields.country', icon: Globe },
  { key: 'state', label: 'userInfo.fields.province', icon: MapPin },
  { key: 'city', label: 'userInfo.fields.municipality', icon: MapPin },
  { key: 'address', label: 'userInfo.fields.address', icon: MapPin },
  { key: 'postalCode', label: 'userInfo.fields.postalCode', icon: Hash },
  { key: 'website', label: 'userInfo.fields.website', icon: Globe },
] as const;

export const REPRESENTATIVE_DATA_FIELDS = [
  { key: 'representativeName', label: 'userInfo.fields.repName', icon: User },
  { key: 'representativeEmail', label: 'userInfo.fields.repEmail', icon: Mail },
  { key: 'representativeBirthDate', label: 'userInfo.fields.repDob', icon: Calendar },
  { key: 'representativePhone', label: 'userInfo.fields.repPhone', icon: Phone },
  { key: 'representativeCountry', label: 'userInfo.fields.repCountry', icon: Globe },
  { key: 'representativeState', label: 'userInfo.fields.repProvince', icon: MapPin },
  { key: 'representativeCity', label: 'userInfo.fields.repMunicipality', icon: MapPin },
  { key: 'representativeAddress', label: 'userInfo.fields.repAddress', icon: MapPin },
  { key: 'representativePostalCode', label: 'userInfo.fields.postalCode', icon: Hash },
] as const;

export const PRODUCTS_SERVICES_FIELDS = [
  { key: 'category', label: 'userInfo.fields.category', icon: Briefcase },
  { key: 'description', label: 'userInfo.fields.description', icon: FileText },
] as const;

export const PUBLIC_DATA_FIELDS = [
  { key: 'supportPhone', label: 'userInfo.fields.supportPhone', icon: Phone },
  { key: 'showSupportPhone', label: 'userInfo.fields.showPhone', icon: Phone },
  { key: 'supportEmail', label: 'userInfo.fields.repEmail', icon: Mail },
  { key: 'supportCountry', label: 'userInfo.fields.supportCountry', icon: Globe },
  { key: 'supportState', label: 'userInfo.fields.supportProvince', icon: MapPin },
  { key: 'supportCity', label: 'userInfo.fields.supportMunicipality', icon: MapPin },
  { key: 'supportAddress', label: 'userInfo.fields.supportAddress', icon: MapPin },
  { key: 'supportPostalCode', label: 'userInfo.fields.supportPostalCode', icon: Hash },
] as const;