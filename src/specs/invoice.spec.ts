import { describe, it } from 'mocha';
import { expect } from 'chai';
import { validateInvoiceItemsAndFormat } from '../helpers/invoice.helper';
import { IInvoiceItemRaw } from '../types/invoice.type';

const dummyInvoiceData: IInvoiceItemRaw[] = [
    // Error: "Invoice number" is required
    {
        'Date': '7/1/24',
        'Customer Name': 'Paresh Patel',
        'Total Amount': '1100',
        'Item Description': 'Pencil',
        'Item Quantity': '50',
        'Item Price': '10',
        'Item Total': '500'
    },
    // Error: "Item Description" is required
    {
        'Invoice Number': '1',
        'Date': '7/1/24',
        'Customer Name': 'Paresh Patel',
        'Total Amount': '1100',
        'Item Quantity': '10',
        'Item Price': '60',
        'Item Total': '600'
    },
    // No error
    {
        'Invoice Number': '2',
        'Date': '7/5/24',
        'Customer Name': 'Suresh Patel',
        'Total Amount': '1000',
        'Item Description': 'Brush-1',
        'Item Quantity': '10',
        'Item Price': '50',
        'Item Total': '500'
    },
    // No error because its current invoice number would be 2. Support for multi-line invoices.
    {
        'Date': '7/5/24',
        'Customer Name': 'Suresh Patel',
        'Total Amount': '1000',
        'Item Description': 'Brush-2',
        'Item Quantity': '10',
        'Item Price': '50',
        'Item Total': '500'
    },
    // Error(s): 'Duplicate Invoice number. "Item Description" is required'
    {
        'Invoice Number': '2',
        'Date': '7/5/24',
        'Customer Name': 'Bhavna Patel',
        'Total Amount': '1000',
        'Item Quantity': '20',
        'Item Price': '50',
        'Item Total': '1000'
    },
    // Error(s): 'Duplicate Invoice number. "Item Description" is required'
    {
        'Invoice Number': '3',
        'Date': '7-5-24',
        'Customer Name': 'Bhavna Patel',
        'Item Description': 'Rubber',
        'Total Amount': '1000',
        'Item Quantity': '20',
        'Item Price': '50',
        'Item Total': '1000'
    }
];

describe("Test Invoice Helper", function() {
    describe("Test function: validateInvoiceItemsAndFormat", function() {
        describe("failure cases", () => {
            it("should add an error message if 'Invoice Number' is not present", () => {
                const invoiceNumberErrorData = dummyInvoiceData.slice(0, 1);
                const { processedInvoiceItems, processedInvoices } = validateInvoiceItemsAndFormat(invoiceNumberErrorData);
    
                // Validate error message to add in excel sheet
                expect(processedInvoiceItems[0]['Error(s)']).to.be.equal(`"Invoice Number" is required`);
    
                // Validate JSON structure and error
                expect(processedInvoices[0].isError).to.be.equal(true);
            });
            it("should add an error message if 'Item Description' is not present", () => {
                const invoiceNumberErrorData = dummyInvoiceData.slice(1, 2);
                const { processedInvoiceItems, processedInvoices } = validateInvoiceItemsAndFormat(invoiceNumberErrorData);
    
                // Validate error message to add in excel sheet
                expect(processedInvoiceItems[0]['Error(s)']).to.be.equal(`"Item Description" is required`);
    
                // Validate JSON structure and error
                expect(processedInvoices[0].isError).to.be.equal(true);
            });
            it("should add an error message if 'Invoice Number' is duplicate", () => {
                const invoiceNumberErrorData = dummyInvoiceData.slice(2, 5);
                const { processedInvoiceItems, processedInvoices } = validateInvoiceItemsAndFormat(invoiceNumberErrorData);
    
                // Validate error message to add in excel sheet
                expect(processedInvoiceItems[0]['Error(s)']).to.be.equal('');
                expect(processedInvoiceItems[1]['Error(s)']).to.be.equal('');
                expect(processedInvoiceItems[2]['Error(s)']).to.be.equal(`Duplicate Invoice number.\n"Item Description" is required`);
    
                // Validate JSON structure and error
                expect(processedInvoices[0].isError).to.be.equal(false);
                expect(processedInvoices[1].isError).to.be.equal(true);
            });
            it("should add an error message of date format", () => {
                const invoiceNumberErrorData = dummyInvoiceData.slice(5, 6);
                const { processedInvoiceItems, processedInvoices } = validateInvoiceItemsAndFormat(invoiceNumberErrorData);
    
                // Validate error message to add in excel sheet
                expect(processedInvoiceItems[0]['Error(s)']).to.be.equal(`"Date" must be in M/D/YY format`);
    
                // Validate JSON structure and error
                expect(processedInvoices[0].isError).to.be.equal(true);
            });
        });
        describe("success cases", () => {
            it("should successfully parse multi-line invoice", () => {
                const invoiceNumberErrorData = dummyInvoiceData.slice(2, 4);
                const { processedInvoiceItems, processedInvoices } = validateInvoiceItemsAndFormat(invoiceNumberErrorData);
    
                // Validate error message to add in excel sheet
                expect(processedInvoiceItems[0]['Error(s)']).to.be.equal('');
                expect(processedInvoiceItems[1]['Error(s)']).to.be.equal('');
    
                // Validate JSON structure and error
                expect(processedInvoices[0].isError).to.be.equal(false);
            });
        });
    });
});
