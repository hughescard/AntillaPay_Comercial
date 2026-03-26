export type Operation =  {
  id: string;
  businessId: string;
  amount: string;
  currency: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  declineReason: string | null;
  completedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}