import axios from "axios";

const getConfig = () => {
    const token = JSON.parse(localStorage.getItem("userData")).token;
    const config = {
        headers: { Authorization: token },
    };
    return config;
};

const addPreferences = async (data) => {
    const config = getConfig();
    const url = "/api/user/preferences";
    return await axios.post(url, data, config);
};

const changePassword = async (credential) => {
    const config = getConfig();
    const url = "/api/user/changePassword";
    return await axios.patch(url, credential, config);
};

const applyForNextRound = async () => {
    const config = getConfig();
    const url = "/api/user/apply";
    return await axios.get(url, config);
};

export { addPreferences, changePassword, applyForNextRound };
