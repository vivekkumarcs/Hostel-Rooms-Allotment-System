import validator from "validator";
import csvFileValidator from "csv-file-validator";
const config = {
    headers: [
        {
            name: "rollNo",
            inputName: "rollNo",
            unique: true,
            uniqueError(headerName) {
                return `${headerName} is not unique`;
            },
            required: true,
            requiredError(headerName, rowNumber, columnNumber) {
                return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
            },
        },
        {
            name: "Email",
            inputName: "email",
            required: true,
            requiredError(headerName, rowNumber, columnNumber) {
                return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
            },
            validate(email) {
                return validator.isEmail(email);
            },
            validateError(headerName, rowNumber, columnNumber) {
                return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`;
            },
        },
        {
            name: "Name",
            inputName: "name",
            required: true,
            requiredError(headerName, rowNumber, columnNumber) {
                return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
            },
        },
        {
            name: "Rank",
            inputName: "rank",
            required: true,
            requiredError(headerName, rowNumber, columnNumber) {
                return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
            },
            validate(rank) {
                return !isNaN(rank);
            },
            validateError(headerName, rowNumber, columnNumber) {
                return `${headerName} must be a Number in the ${rowNumber} row / ${columnNumber} column`;
            },
        },
        {
            name: "Disable",
            inputName: "disabled",
            optional: true,
        },
    ],
};

const validateCSV = async (csvData) => {
    const buffer = csvData;
    return await csvFileValidator(buffer, config);
};

export default validateCSV;
