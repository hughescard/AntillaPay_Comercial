import type { FormError } from "@/app/paymentLink/components/paymentPreview.types";

export type ValidateFormsFieldsInput = {
  name?: string;
  email?: string;
  password?: string;
};

export type ValidateFormsFieldsErrors = {
  name?: FormError;
  email?: FormError;
  password?: FormError;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidateFormsFieldsOptions = {
  requiredErrorId?: FormError["id"];
  invalidEmailErrorId?: FormError["id"];
};

export const validateFormsFields = ({
  name,
  email,
  password,
}: ValidateFormsFieldsInput, options?: ValidateFormsFieldsOptions): ValidateFormsFieldsErrors => {
  const errors: ValidateFormsFieldsErrors = {};
  const requiredErrorId = options?.requiredErrorId ?? "forms.field_necesary";
  const invalidEmailErrorId = options?.invalidEmailErrorId ?? "forms.inalid_email";

  if (!name || name.trim() === "") {
    errors.name = { id: requiredErrorId };
  }

  if (!email || email.trim() === "") {
    errors.email = { id: requiredErrorId };
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = { id: invalidEmailErrorId };
  }

  if (!password || password.trim() === "") {
    errors.password = { id: requiredErrorId };
  }

  return errors;
};
