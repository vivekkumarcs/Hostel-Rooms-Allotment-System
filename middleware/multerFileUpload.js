const multer = require("multer");

const upload = multer({
    async fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().endsWith(".csv")) {
            cb(new Error("please upload CSV file"));
        }
        cb(undefined, true);
    },
});

module.exports = upload;
