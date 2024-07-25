import { RequestHandler, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import { ValidationError } from 'express-validation';
import { MulterError } from 'multer';

import { getFailureResponse } from '../utils/response.util';

function getValidationErrorMessage(errObject: ValidationError): string {
    const { body, params, query } = errObject.details;
    return params?.[0].message || query?.[0].message || body?.[0].message || errObject.message;
}

export const notFoundHandler: RequestHandler = (req, res, next) => {
    return next(createHttpError.NotFound('Resource not found!'));
};

export const mainErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let errStatus: number;
    let errMessage: string;

    if (err.status) {
        errStatus = err.status;
        errMessage = err.message;
    } else {
        console.log(err);
        errStatus = 500;
        errMessage = "Something went wrong!";
    }

    if (err instanceof ValidationError) {
        errStatus = 422;
        errMessage = getValidationErrorMessage(err);
    }

    // if (err instanceof MulterError) {
    //     console.log(err);
    // }

    return res.status(errStatus).json(getFailureResponse(errMessage, errStatus));
};
