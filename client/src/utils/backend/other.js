import axios from "axios";

const getConfig = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData.token;
    const admin = userData.admin;
    const config = {
        headers: { Authorization: token },
    };
    return { config, user: admin ? "admin" : "user" };
};

const getNotification = async () => {
    const url = "/api/getNotification";
    return await axios.get(url);
};

const signUp = async (credential) => {
    const url = "/api/signup";
    return await axios.post(url, credential);
};

const login = async (credential) => {
    const url = "/api/signin";
    return await axios.post(url, credential);
};

const sendOTP = async (credential) => {
    const url = "/api/forgetPassword";
    return await axios.post(url, credential);
};

const OTPVerify = async (credential) => {
    const url = "/api/otpVerify";
    return await axios.post(url, credential);
};

const updatePassword = async (credential) => {
    const url = "/api/changePassword";
    return await axios.post(url, credential);
};

const getUser = async () => {
    const config = getConfig();
    const url = `/api/${config.user}`;
    return await axios.get(url, config.config);
};

const logOut = async () => {
    const config = getConfig();
    const url = `/api/${config.user}/logout`;
    return await axios.get(url, config.config);
};

const downloadCheck = async (hostelName) => {
    const url = `/api/admin/result?hostelName=${hostelName}&check=true`;
    return await axios.get(url);
};

export {
    getNotification,
    signUp,
    login,
    sendOTP,
    OTPVerify,
    updatePassword,
    getUser,
    logOut,
    downloadCheck,
};
