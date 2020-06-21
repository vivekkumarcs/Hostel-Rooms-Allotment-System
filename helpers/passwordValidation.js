const validate = password => {
    const re = /^[a-zA-Z0-9]{8,15}$/;
    if (!re.test(password)) throw new Error("please enter valid password");
};
module.exports = validate;
