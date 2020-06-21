const randomPassword = length => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let password = "";
    while (length > 0) {
        let index = Math.floor(Math.random() * chars.length);
        password += chars.substring(index, index + 1);
        length--;
    }
    return password;
};

module.exports = randomPassword;
