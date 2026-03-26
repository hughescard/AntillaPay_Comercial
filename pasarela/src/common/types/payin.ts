import { Operation } from "./operation";

export type Payin = {
  id: string;
  customerId:string;
  customerEmail: string;
  customerName:string;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount:string,
  currency:string,
  status: 'Pending' | 'Completed' | 'Rejected'
}

export type PayinHistory = {
  id: string;
  customerId:string;
  customerEmail: string;
  customerName:string;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Operation: Operation;
}