import JoiBase from "joi";
const Joi = JoiBase.extend(require('@joi/date'));
import { IInvoiceItemRaw, IInvoiceItemRawWithError, IProcessedInvoice, IProcessedInvoiceItem } from "../types/invoice.type";

function validateInvoiceItem(invoiceItem: IInvoiceItemRaw) {
    // Create Joi schema for validation
    const joiSchema = Joi.object({
        'Invoice Number': Joi.number().integer().required(),
        'Date': Joi.date().format('M/D/YY'),
        'Customer Name': Joi.string().trim().required(),
        'Total Amount': Joi.number().required(),
        'Item Description': Joi.string().trim().required(),
        'Item Quantity': Joi.number().integer().required(),
        'Item Price': Joi.number().required(),
        'Item Total': Joi.number().required(),
    });

    // Validate invoice item against schema
    const validateResult = joiSchema.validate(invoiceItem, { context: true, abortEarly: false });

    // Fetch all error messages
    const errorMessage = validateResult.error?.details?.map((errObj: { message: string }) => errObj.message).join('\n');

    // Generate and send response
    const response = {
        status: errorMessage ? 'error' : 'success',
        data: validateResult.value,
        message: errorMessage
    };
    return response;
}

export const validateInvoiceItemsAndFormat = (invoiceItems: IInvoiceItemRaw[]) => {
    let currentInvoiceNo: number;
    let isDuplicateInvoice = false;

    const processedInvoiceItems: IInvoiceItemRawWithError[] = [];
    const processedInvoices: IProcessedInvoice[] = [];

    invoiceItems.forEach(invoiceRow => {
        let isInvoiceNoChanged = false;
        if (invoiceRow["Invoice Number"]) {
            currentInvoiceNo = Number(invoiceRow["Invoice Number"]);
            isInvoiceNoChanged = true;
            isDuplicateInvoice = false;
        }

        // Check unique invoice number
        if (isInvoiceNoChanged) {
            isDuplicateInvoice = processedInvoiceItems.some(invoiceItem => invoiceItem["Invoice Number"] == currentInvoiceNo);
        }

        // Validate invoice item
        const validationRes = validateInvoiceItem({ ...invoiceRow, "Invoice Number": currentInvoiceNo });
        const normalizedObject = validationRes.data;

        // Check if any error in item
        const isParsingError = isDuplicateInvoice || validationRes.status === 'error';

        // Generate error message
        let parsingErrorMsg = '';

        if (isDuplicateInvoice) parsingErrorMsg += 'Duplicate Invoice number.\n';
        if (validationRes.status === 'error') parsingErrorMsg += validationRes.message;

        const invoiceItem: IProcessedInvoiceItem = {
            itemDescription: normalizedObject["Item Description"],
            itemQuantity: normalizedObject["Item Quantity"],
            itemPrice: normalizedObject["Item Price"],
            itemTotal: normalizedObject["Item Total"],
            errorMessage: parsingErrorMsg
        };

        // Prepare Invoice wise JSON format
        if (isInvoiceNoChanged || !currentInvoiceNo) {
            processedInvoices.push({
                invoiceNumber: currentInvoiceNo,
                date: normalizedObject.Date,
                customerName: normalizedObject["Customer Name"],
                totalAmount: normalizedObject["Total Amount"],
                isError: isParsingError,
                items: [invoiceItem]
            });
        } else {
            const currentInvoiceData = processedInvoices[processedInvoices.length - 1];
            currentInvoiceData.isError = isParsingError;
            currentInvoiceData.items.push(invoiceItem);
        }

        // Add error property.
        processedInvoiceItems.push({
            ...invoiceRow,
            'Error(s)': parsingErrorMsg
        });
    });

    // Return both: invoice items and error property and JSON formatted invoices
    return {
        processedInvoiceItems,
        processedInvoices
    };
};
