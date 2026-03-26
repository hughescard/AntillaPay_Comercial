import type { SelectOption } from "@/common/components/ui/SearchableTable";

export type PaymentMethod = "bank" | "wallet";
export type AccountMode = "cuba" | "foreing";
export type AntillaStep = "login" | "verify";

export type PaymentPreviewPayParams = {
  selectedMethod?: PaymentMethod;
  accountMode?: AccountMode;
  contactEmail?: string;
  contactName?: string;
};

export type AntillaLoginSuccessPayload = {
  email: string;
  password: string;
  expiresIn: number;
};

export type FormErrorId =
  | "forms.field_necesary"
  | "forms.inalid_email"
  | "errors.required"
  | "errors.invalid_email"
  | "errors.unknown_error";

export type FormError = {
  id: FormErrorId;
};

export type Errors = {
  accountMode?: FormError;
  contactEmail?: FormError;
  contactName?: FormError;
  general?: FormError;
  [key: string]: FormError | undefined;
};

export type AccountOption = Omit<SelectOption, "value"> & {
  value: AccountMode;
};

export type ProductLine = {
  id: string;
  name: string;
  quantity: number;
  currency: string;
  unitValue: number;
  lineTotal: number;
  image: string | null;
};
