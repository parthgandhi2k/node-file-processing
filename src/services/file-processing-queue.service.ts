import Queue from 'bull';
import XLSX from 'xlsx';
import fs from 'fs';
import createHttpError from 'http-errors';
import path from 'path';

import { APP_CONFIG } from '../config';
import { IInvoiceItemRaw, IInvoiceItemRawWithError } from '../types/invoice.type';
import { getFileType } from '../utils/helper.util';
import { readCsvToJson } from '../helpers/file-reader.helper';
import { validateInvoiceItemsAndFormat } from '../helpers/invoice.helper';
import { writeJsonIntoCsv, writeJsonIntoExcel } from '../helpers/file-writer.helper';
import { createInvoice } from '../controllers/invoice.controller';

const invoiceProcessQueue = new Queue('Invoice-Process-Queue', {
    redis: {
        password: APP_CONFIG.REDIS_PASSWORD,
        host: APP_CONFIG.REDIS_HOST,
        port: APP_CONFIG.REDIS_PORT,
    },
});

invoiceProcessQueue.process(3, async (job, done) => {
    try {
        const { filePath } = job.data;

        if (!fs.existsSync(filePath)) {
            throw createHttpError.NotFound('File not found!');
        }

        let jsonData: IInvoiceItemRaw[] = [];

        const fileName = path.basename(filePath);
        const fileType = getFileType(fileName);

        if (fileType === 'xlsx') {
            // Read excel file and sheet
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];

            try {
                // Convert sheet data to json
                jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                    raw: false,
                    dateNF: 'dd-mm-yyyy',
                    defval: ''
                });
            } catch (error) {
                throw createHttpError.UnprocessableEntity('Excel parsing error!');
            }

        } else if (fileType === 'csv') {
            jsonData = (await readCsvToJson(filePath)) as IInvoiceItemRaw[];
        }

        // Process json data
        const { processedInvoiceItems, processedInvoices } = validateInvoiceItemsAndFormat(jsonData);

        // Define headers for processed file with error description
        let headers: (keyof IInvoiceItemRawWithError)[] = [
            'Invoice Number',
            'Date',
            'Customer Name',
            'Total Amount',
            'Item Description',
            'Item Quantity',
            'Item Price',
            'Item Total',
            'Error(s)'
        ];

        // Update file
        if (fileType === 'xlsx') {
            writeJsonIntoExcel(filePath, processedInvoiceItems, headers);
        } else if (fileType === 'csv') {
            await writeJsonIntoCsv(filePath, processedInvoiceItems, headers);
        }

        // Create invoice
        processedInvoices.forEach((invoice) => createInvoice(invoice));
        done();
    } catch (error) {
        console.log('Invoice Queue Job Error:', error);
        done(error as Error);
    }
});

export default invoiceProcessQueue;
