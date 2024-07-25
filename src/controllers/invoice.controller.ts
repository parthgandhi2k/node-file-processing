import { RequestHandler } from "express";
import path from "path";
import createHttpError from "http-errors";
import { getSuccessResponse } from "../utils/response.util";
import { IProcessedInvoice } from "../types/invoice.type";
import invoiceProcessQueue from "../services/file-processing-queue.service";

export function createInvoice(invoice: IProcessedInvoice) {
    console.log('Invoice Number:', invoice.invoiceNumber);
    console.log('Invoice Created?', invoice.isError ? 'No' : 'Yes');
}

export const uploadInvoiceController: RequestHandler = async (req, res, next) => {
    try {
        const invoiceFile = req.file;

        // Throw error if file is not present
        if (!invoiceFile) {
            throw createHttpError.BadRequest('Please send file');
        }

        const fileName = invoiceFile.filename;
        const filePath = path.join(__dirname, '../../files/invoices/', fileName);

        // Add job in queue and process file in background
        const createdJob = await invoiceProcessQueue.add({
            filePath: filePath
        });

        // Send response of file acceptance
        return res.status(202).json(
            getSuccessResponse(
                'File is being processed',
                { jobId: createdJob.id },
                202
            )
        );
    } catch (error) {
        next(error);
    }
};
