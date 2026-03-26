export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const ANTILLA_PAY_LOGO_URL = "/pasarela/logo.png";

export const minorUnitsToMajor = (value: string | number | null | undefined) => {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) return 0;
  return normalized / 100;
};

export const majorUnitsToMinor = (value: string | number | null | undefined) => {
  if (typeof value === "string") {
    const normalized = Number(value.replace(",", "."));
    return Number.isFinite(normalized) ? Math.round(normalized * 100) : 0;
  }

  const normalized = Number(value);
  return Number.isFinite(normalized) ? Math.round(normalized * 100) : 0;
};

export const toMoneyInputValue = (value: string | number | null | undefined) =>
  minorUnitsToMajor(value).toFixed(2);

export const getPreviewTotals = (amount: string, quantity: number) => {
  const normalizedAmount = Number(amount.replace(",", "."));
  const safeAmount = Number.isFinite(normalizedAmount) ? normalizedAmount : 0;
  const formattedAmount = safeAmount.toFixed(2);
  const subtotalValue = safeAmount * quantity;
  const formattedSubtotal = subtotalValue.toFixed(2);
  return { formattedAmount, formattedSubtotal };
};

export const resolveProductImageUrl = (image?: string | null) => {
  if (!image) return ANTILLA_PAY_LOGO_URL;
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }
  return ANTILLA_PAY_LOGO_URL;
};
