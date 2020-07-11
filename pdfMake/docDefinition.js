const documentDefinition = {
    pageSize: "A4",
    pageMargins: [30, 30, 30, 30],
    footer: function (currentPage, pageCount) {
        return {
            text: [
                { text: "PAGE " },
                { text: currentPage, bold: true, fontSize: 15 },
                { text: " OF " + pageCount },
            ],
            style: "footer",
        };
    },
    content: [
        { text: "PANCHWATI HOSTEL", style: "header" },
        { text: [{ text: "Date: ", bold: true }, "11/03/2020"], style: "date" },
        {
            style: "tableData",
            table: {
                widths: ["12%", "44%", "44%"],
                headerRows: 1,
                body: [
                    [
                        {
                            text: "S.No.",
                            bold: true,
                        },
                        {
                            text: "Roll Number",
                            bold: true,
                        },
                        {
                            text: "Room Number",
                            bold: true,
                        },
                    ],
                ],
            },
            layout: {
                // hLineWidth: function (i, node) { return 0; },
                // vLineWidth: function (i, node) { return 0; },
                // paddingLeft: function(i, node) { return 0; },
                // paddingRight: function(i, node) { return 0; },
                paddingTop: function (i, node) {
                    return 3;
                },
                paddingBottom: function (i, node) {
                    return 3;
                },
            },
        },
    ],
    styles: {
        footer: {
            alignment: "center",
            margin: [0, 4],
        },
        header: {
            fontSize: 30,
            bold: true,
            alignment: "center",
        },
        date: {
            margin: [0, 10],
            alignment: "right",
        },
        tableData: {
            fontSize: 14,
            alignment: "center",
        },
    },
};

const getDocDefinition = (hostelName, date, users) => {
    documentDefinition.content[0].text = hostelName.toUpperCase();
    documentDefinition.content[1].text[1] = date;
    users.forEach((user, index) => {
        documentDefinition.content[2].table.body.push([
            index + 1,
            user[0],
            user[1],
        ]);
    });
    return documentDefinition;
};

module.exports = getDocDefinition;
