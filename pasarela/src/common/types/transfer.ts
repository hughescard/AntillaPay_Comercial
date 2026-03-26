
export type Transfer = {
  id: string;
  senderCustomerId?: string | null;
  senderBusinessId?: string;
  senderBusinessName?: string | null;
  senderEmail?: string | null;
  receiverBusinessId?: string;
  receiverBusinessName?: string | null;
  receiverEmail?: string | null;
  customerId?: string;
  customerName?: string | null;
  customerEmail?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount:string,
  currency:string,
  status: 'Pending' | 'Completed' | 'Rejected'
}
