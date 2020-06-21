const cron = require("node-cron");

const _8am = require("./8am");
const _11am = require("./11am");
const _1130am = require("./11-30am");
const _1pm = require("./1pm");
const _3pm = require("./3pm");
const _330pm = require("./3-30pm");

cron.schedule("0 8 * * *", async () => {
    console.log("from 8am");
    await _8am();
});
cron.schedule("0 11 * * *", async () => {
    console.log("from 11am");
    await _11am();
});
cron.schedule("30 11 * * *", async () => {
    console.log("from 11-30am");
    await _1130am();
});
cron.schedule("0 13 * * *", async () => {
    console.log("from 1pm");
    await _1pm();
});
cron.schedule("0 15 * * *", async () => {
    console.log("from 3pm");
    await _3pm();
});
cron.schedule("30 15 * * *", async () => {
    console.log("from 3-30pm");
    await _330pm();
});
console.log("hi from schedule");
