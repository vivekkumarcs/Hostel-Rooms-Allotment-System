const isValidRange = range => {
    range = range.trim();
    range += ",";
    const reg1 = /^(([A-Z]+[0-9]+(-[A-Z]+[0-9]+)?, ?)+|([0-9]+(-[0-9]+)?, ?)+)$/;
    const reg2 = /[A-Z]+[0-9]+-[A-Z]+[0-9]+/g;
    if (!reg1.test(range)) return false;
    if (!isNaN(range[0])) return true;
    const A = range.match(reg2);
    if (!A) return true;
    return A.every(s => {
        const x = s.split("-");
        const min = x[0].length < x[1].length ? x[0].length : x[1].length;
        for (let i = 0; i < min; ) {
            if (x[0][i] === x[1][i]) i++;
            else {
                if (isNaN(x[0][i]) || isNaN(x[1][i])) return false;
                else return true;
            }
        }
        return true;
    });
};

const Break = s => {
    if (!s.includes("-")) s += "-" + s;
    const detail = {};
    const x = s.split("-");
    const y = x[0].match(/^[A-Z]*/);
    detail.name = y[0];
    detail.range = [
        parseInt(x[0].slice(y[0].length)),
        parseInt(x[1].slice(y[0].length))
    ];
    return detail;
};
const validateRoomCount = A => {
    A.sort((a, b) => a[0] - b[0]);
    const B = [];
    B.push([A[0][0], A[0][1]]);
    for (let i = 1; i < A.length; i++) {
        if (A[i][1] <= B[B.length - 1][1]) {
            continue;
        } else if (A[i][0] <= B[B.length - 1][1]) {
            B[B.length - 1][1] = A[i][1];
        } else {
            B.push([A[i][0], A[i][1]]);
        }
    }
    let count = 0;
    let i = 0;
    while (count <= 1000 && i < B.length) {
        count += B[i][1] - B[i][0] + 1;
        i++;
    }
    if (count > 1000)
        throw new Error("rooms per floor must be less or equal to 1000");
};

const roomFromRange = roomRange => {
    const splits = roomRange.split(",").map(x => x.trim());
    const range = {};
    splits.forEach(element => {
        const detail = Break(element);
        if (range[detail.name]) {
            range[detail.name].push(detail.range);
        } else {
            range[detail.name] = [detail.range];
        }
        if (Object.keys(range).length > 5)
            throw new Error("total floors should be less than or equal to 5");
    });
    Object.keys(range).forEach(key => validateRoomCount(range[key]));
};

const roomValidation = roomRange => {
    if (!isValidRange(roomRange)) throw new Error("please input valid format");
    roomFromRange(roomRange);
};
// const roomRange = "G1-G100,G5-G7, F53, F11, H11-H14, H13-H15, S1, M1,H1,N3";
// roomValidation(roomRange);
module.exports = {
    isValidRange: isValidRange,
    roomValidation: roomValidation
};
