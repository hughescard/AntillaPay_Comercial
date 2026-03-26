import { COMPANY_STRUCTURES, VERIFICATION_STEPS } from "@/lib/profileConstants";
import { LucideIcon } from "lucide-react";

export type VerificationStep = typeof VERIFICATION_STEPS[number]['label'] 

export interface Step {
  id: number;
  key: string;
  label: string;
  icon?: LucideIcon;
}

export type typeBusiness = typeof COMPANY_STRUCTURES[number]['value'];