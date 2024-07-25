
# Project Title

A brief description of what this project does and who it's for

# Invoice (Excel/CSV) file parser using Node JS and Typescript

This project demonstrates a basic Express application that accepts and parses multi-line invoice file of only .xlsx or .csv format.
After successfully parsing the file, it will add new column called Error(s) in the file which describes the error messages if any.

## Backend Setup Guide

Follow these steps to set up and start the backend server:

### 1. Configure Environment File
- Initialize environment variables according to the node environment.
    - For `development` environment, use `.env.development` file.
    - For `production` environment, use `.env.production` file.

### 2. Install Dependencies
- Install project dependencies using `npm` command:
    ```sh
    npm install
    ```

### 3. Start the Server

- Start the `development` server:
    ```sh
    npm run dev
    ```
- Start the `production` server:
    ```sh
    npm start
    ```

## Upload Invoice File

- You can upload the file on this route as form-data:
    ```sh
    (POST) http://localhost:{PORT}/invoice/upload
    ```
    Name of the key in body to upload file is `invoiceFile`.


- **Sample files:**
    There are two sample files added in the folder `Sample files` in this repo for testing purpose.

    This is the image of that input file:
    ![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true) 

- **Output:**
    After uploading the file, it will process and validate the errors present in file. It will add all the error messages for each row in the `Error(s)` column.

    This is the image of processed file which was uploaded above:
    ![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)

- After parsing the invoice data, it will try to create invoice for those invoices with no errors. You can see the output in console.

## Run test-cases

- Run the unit tests and get the code coverage for file parsing and validation logic:
    ```sh
    npm test
    ```

- **Sample Input Data for test cases:**
    - You can see the parsed Sample input invoice data in `src/specs/invoice.spec.ts` file. Check variable: `dummyInvoiceData`.
    - This input data contains all types of possible validation errors that may occur.
    - You can see which object will generate which type of error as comment mentioned above the object.

- **Verify Output Data:**
    - Validation function will generate two types of output variable that need to be verified:
        1) Row-wise File data with Error property in it. You can check that sample output in the file `invoice-rows-with-error.ts`.
        2) Invoice-wise data. Sample output data in the file `invoice-structure.ts`.