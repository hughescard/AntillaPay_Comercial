import { COMPANY_DATA_FIELDS, FISCAL_DATA_FIELDS, PRODUCTS_SERVICES_FIELDS, PUBLIC_DATA_FIELDS, REPRESENTATIVE_DATA_FIELDS } from "@/lib/infoUserConstants";
import { LucideIcon } from "lucide-react";

type FiscalLabels = typeof FISCAL_DATA_FIELDS[number]['label'];
type CompanyLabels = typeof COMPANY_DATA_FIELDS[number]['label'];
type RepresentativeLabels = typeof REPRESENTATIVE_DATA_FIELDS[number]['label'];
type ProductLabels = typeof PRODUCTS_SERVICES_FIELDS[number]['label'];
type PublicLabels = typeof PUBLIC_DATA_FIELDS[number]['label'];

export type PossibleUserFields = 
  | FiscalLabels 
  | CompanyLabels 
  | RepresentativeLabels 
  | ProductLabels 
  | PublicLabels;

export type FieldConfig = {
  key: string;
  label: PossibleUserFields;
  icon: LucideIcon;
}
