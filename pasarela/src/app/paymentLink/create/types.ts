export type productStatus = 'active' | 'inactive';

export type CatalogProduct = {
  id: string;
  description: string;
  image?: string | null;
  name: string;
  prices: Price;
  createdAt:Date;
  status:productStatus;
};



export const USD = "USD"

export const currency = [
  {
    label: 'USD',
    sym: "$",
    value: USD
  },
  {
    label: 'Euro',
    sym: "e",
    value: "EU"
  }
]

export type currencyType = string

export type Price = {
    value: number;
    currency: currencyType
  }[]

export type PaymentPreviewData = {
  title: string;
  description: string;
  currency: currencyType;
  amount: number;
  products: SelectedProduct[];
  additionalInfoEnabled: boolean;
  additionalInfo: string;
  paymentMethods: {
    transfer: boolean;
    balance: boolean;
  };
  replaceMessageEnabled: boolean;
  replaceMessage: string;
  generatePDF: boolean;
  successURL: string;
  errorURL: string;
};

export type PaymentDataCreate = {
  title: string;
  description: string;
  currency: currencyType;
  amount: number;
  products: {id: string, quantity: number}[] | undefined;
  paymentMethods: {
    transfer: boolean;
    balance: boolean;
  };
  additionalInfo?: string;
  afterPaymentMessage?: string;
  generatePDF?: boolean;
  showConfirmation?: boolean;
  successURL?: string;
  errorURL?: string;
};

export type CatalogProductCreate = {
  description: string;
  image?: string;
  imageFile?: File | null;
  name: string;
  prices: Price;
  status: productStatus;
};

export type SelectedProduct = CatalogProduct & {
  quantity: number;
  allowCustomerQuantity: boolean;
};
