// this is the temporary file for scheduling
// allotment until we get any permanent solution.

const express = require("express");

const _8am = require("../allotment/8am");
const _11am = require("../allotment/11am");
const _1130am = require("../allotment/11-30am");
const _1pm = require("../allotment/1pm");
const _3pm = require("../allotment/3pm");
const _330pm = require("../allotment/3-30pm");

const router = express.Router();

router.get("/8am", async (req, res) => {
    try {
        res.send();
        await _8am();
        console.log("8am done!!");
    } catch (e) {
        console.log("error from 8am");
        console.log(e);
    }
});

router.get("/11am", async (req, res) => {
    try {
        res.send();
        await _11am();
        console.log("11am done!!");
    } catch (e) {
        console.log("error from 11am");
        console.log(e);
    }
});

router.get("/1130am", async (req, res) => {
    try {
        res.send();
        await _1130am();
        console.log("1130am done!!");
    } catch (e) {
        console.log("error from 1130am");
        console.log(e);
    }
});

router.get("/1pm", async (req, res) => {
    try {
        res.send();
        await _1pm();
        console.log("1pm done!!");
    } catch (e) {
        console.log("error from 1pm");
        console.log(e);
    }
});

router.get("/3pm", async (req, res) => {
    try {
        res.send();
        await _3pm();
        console.log("3pm done!!");
    } catch (e) {
        console.log("error from 3pm");
        console.log(e);
    }
});

router.get("/330pm", async (req, res) => {
    try {
        res.send();
        await _330pm();
        console.log("330pm done!!");
    } catch (e) {
        console.log("error from 330pm");
        console.log(e);
    }
});

module.exports = router;
