export type dateRange = 'month' | 'quarter' | 'semester' | 'year';
export type statusOperation = 'Pending' | 'Completed' | 'Rejected';
export type productStatus = 'active' | 'inactive';
export type paymentLinkStatus = 'active' | 'inactive' | 'paid' | 'expired' | 'draft';

export type ClientFilters = {
    kind:'clientFilter'
    search: string,
    dateRange: dateRange,
    dateSort: string,
    type:'business' | 'customer',
}

export type BalanceFilters = {
    kind:'balanceFilters'
    dateRange: dateRange,
    dateSort: string,
    status: statusOperation
}

export type TransferFilters = {
    kind:'transferFilters'
    search: string,
    dateRange: dateRange,
    dateSort: string,
    status: statusOperation
}

export type ProductFilters = {
    kind:'productFilter'
    search: string,
    dateRange: dateRange,
    dateSort: string,
    status: productStatus
}

export type PaymentLinkFilters = {
    kind:'paymentLinkFilters'
    search: string,
    dateRange: dateRange,
    dateSort: string,
    
}

export type filters = ClientFilters | TransferFilters | BalanceFilters | ProductFilters | PaymentLinkFilters;


export type uiStateClient = {
    kind:'clientUiState',
    showDate: boolean,
    showType: boolean,
}

export type uiStateTransfer = {
    kind:'transferUiState',
    showDate: boolean,
    showStatus: boolean,
}

export type uiStateProduct = {
    kind:'productUiState',
    showDate: boolean,
    showStatus: boolean,
}

export type uiStatePaymentLink = {
    kind:'paymentLinkUiState',
    showDate: boolean,
  
}

export type uiState = uiStateClient | uiStateTransfer | uiStateProduct | uiStatePaymentLink;
