export interface IInvoiceItemRaw {
    'Invoice Number'?: number | string | '',
    'Date'?: string,
    'Customer Name'?: string,
    'Total Amount'?: number | string,
    'Item Description'?: string,
    'Item Quantity'?: number | string,
    'Item Price'?: number | string,
    'Item Total'?: number | string
};

export interface IInvoiceItemRawWithError extends IInvoiceItemRaw {
    'Error(s)': string;
};

export interface IProcessedInvoice {
    invoiceNumber: number,
    date: string,
    customerName: string,
    totalAmount: number,
    isError: boolean,
    items: IProcessedInvoiceItem[]
};

export interface IProcessedInvoiceItem {
    itemDescription: string,
    itemQuantity: number,
    itemPrice: number,
    itemTotal: number,
    errorMessage: string,
};
