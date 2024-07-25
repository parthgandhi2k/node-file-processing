import { parse } from 'csv-parse';
import moment from "moment-timezone";
import fs from 'fs';
import createHttpError from 'http-errors';

export const readCsvToJson = async (filePath: string): Promise<object[]> => {
    const jsonData: object[] = [];
    return await new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath);
        readStream
            .pipe(parse({ delimiter: ",", columns: true }))
            .on("data", function (row) {
                row.Date = moment(row.Date, 'DD-MM-YYYY').format('M/D/YY');
                jsonData.push(row);
            })
            .on("end", function () {
                // Close stream on read completed
                readStream.close();
                resolve(jsonData);
            })
            .on("error", function (error) {
                readStream.close();
                reject(createHttpError.UnprocessableEntity('CSV parsing error!'));
            });
    });
};
