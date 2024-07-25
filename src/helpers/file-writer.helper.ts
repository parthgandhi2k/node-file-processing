import XLSX from "xlsx";
import fs from 'fs';
import { stringify } from 'csv-stringify';

export const writeJsonIntoExcel = (filePath: string, jsonData: object[], headers: string[]) => {
    // New workbook
    const wb = XLSX.utils.book_new();

    // Create sheet
    const ws = XLSX.utils.json_to_sheet(jsonData, {
        header: headers
    });

    // Assign sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save workbook
    XLSX.writeFile(wb, filePath, {});
}

export const writeJsonIntoCsv = async (filePath: string, jsonData: object[], headers: string[]) => {
    return new Promise((resolve, reject) => {
        // Create write stream
        const writableStream = fs.createWriteStream(filePath);

        // Write into stream
        const stringifier = stringify({ header: true, columns: headers });
        jsonData.forEach(row => {
            stringifier.write(row);
        });
        stringifier.end();
        stringifier.pipe(writableStream);

        // Close stream on writing done
        writableStream.on('finish', function () {
            writableStream.close();
            resolve(1);
        });

        // Close stream on error
        writableStream.on('error', function (err) {
            writableStream.close();
            reject(err);
        });
    });
};
