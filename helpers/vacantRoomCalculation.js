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
    });
    return range;
};

const actualRooms = A => {
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
    const rooms = [];
    B.forEach(b => {
        for (let i = b[0]; i <= b[1]; i++) rooms.push(i);
    });
    return rooms;
};

const convert = roomRange => {
    const range = roomFromRange(roomRange);
    const keys = Object.keys(range);
    if (keys.length > 5)
        throw new Error("total floors should be less than or equal to 5");
    const vacantRooms = keys.map(key => {
        const data = {};
        data.prefix = key;
        data.rooms = actualRooms(range[key]);
        return data;
    });
    return vacantRooms;
};

// const roomRange = "G1-G500, G5-G7, F53, F11, H11-H14, H13-H15, S1, M1";
// console.log(convert(roomRange));
module.exports = convert;
