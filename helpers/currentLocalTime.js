const getCurrentLocalTime = (newTimeZone) => {
    if (!newTimeZone) newTimeZone = 330;
    const d = new Date();
    // now ms is local time
    let ms = d.getTime();
    // console.log(ms);
    const timeZone = d.getTimezoneOffset();
    // now ms is UTC time
    ms += timeZone * 60000;
    // now ms is in GMT+5:30
    ms += newTimeZone * 60000;
    // console.log(ms);
    return new Date(ms).setHours(0, 0, 0, 0);
};
// console.log(getCurrentLocalTime());
// getCurrentLocalTime();
module.exports = getCurrentLocalTime;
