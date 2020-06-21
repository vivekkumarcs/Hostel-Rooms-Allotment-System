const express = require("express");
const path = require("path");
const cors = require("cors");
const outside = require("./routers/outsiderRouter");
const user = require("./routers/userRouter");
const admin = require("./routers/adminRouter");
require("./db/mongoose");

// require("./allotment/schedule");
// require("./pdfMake/generatePdf");
// require("./allotment/todaysAllotment");
// require("./email/email");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client/build"));

// temporary
const runallotment = require("./routers/runAllotment");
app.use("/runAllotment", runallotment);

app.use("/api/admin", admin);
app.use("/api/user", user);
app.use("/api", outside);

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "client/build/", "index.html"));
});

app.listen(process.env.PORT, () =>
    console.log(`Server is listening at port ${process.env.PORT}`)
);
