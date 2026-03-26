export type TransferFilters = {
    search: string,
    dateRange: 'month' | 'quarter' | 'semester' | 'year',
    dateSort: string,
    status: 'Pending' | 'Completed' | 'Rejected';
}