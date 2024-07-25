import { Router } from 'express';
import createHttpError from 'http-errors';
import multer from 'multer';
import path from 'path';
import { uploadInvoiceController } from '../controllers/invoice.controller';
import { getFileType } from '../utils/helper.util';

const multerStorage = multer.diskStorage({
    // Set destination folder
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './../../files/invoices/'))
    },

    // Set unique file name
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileType = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileType, '');
        const newFileName = 'Invoice' + '-' + fileName + '-' + uniqueSuffix + fileType;
        cb(null, newFileName);
    },
});

const fileUploadMiddleware = multer({
    storage: multerStorage,
    limits: { fileSize: 1E7 },

    // Allow only xlsx and csv files
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['xlsx', 'csv'];
        const fileType = getFileType(file.originalname);
        const isValidType = allowedTypes.includes(fileType);
        if (isValidType) cb(null, true);
        else cb(createHttpError.UnsupportedMediaType('Invalid file type!'));
    },
});

const invoiceRouter = Router();

invoiceRouter.post('/upload', fileUploadMiddleware.single('invoiceFile'), uploadInvoiceController);

export { invoiceRouter };
