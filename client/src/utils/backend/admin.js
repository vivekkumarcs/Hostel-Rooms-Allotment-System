import axios from "axios";

const getConfig = () => {
    const token = JSON.parse(localStorage.getItem("userData")).token;
    const config = {
        headers: { Authorization: token },
    };
    return config;
};

const changePassword = async (credential) => {
    const config = getConfig();
    const url = "/api/admin/changePassword";
    return await axios.patch(url, credential, config);
};

const addNewHostel = async (details) => {
    const config = getConfig();
    const url = "/api/admin/hostel";
    return await axios.post(url, details, config);
};

const getHostels = async (final) => {
    const config = getConfig();
    const url = "/api/admin/hostels" + (final ? "?final=true" : "");
    return await axios.get(url, config);
};

const deleteHostel = async (hostelid) => {
    const config = getConfig();
    const url = `/api/admin/${hostelid}`;
    return await axios.delete(url, config);
};

const updateHostelDetails = async (hostelid, details) => {
    const config = getConfig();
    const url = `/api/admin/${hostelid}`;
    return await axios.patch(url, details, config);
};

const uploadCSV = async (hostelid, data) => {
    const config = getConfig();
    const url = `/api/admin/${hostelid}/upload`;
    return await axios.post(url, data, config);
};

const finalSubmit = async (hostelid, date) => {
    const config = getConfig();
    const url = `/api/admin/${hostelid}/finalSubmit`;
    return await axios.post(url, date, config);
};

const discardFinalSubmit = async (hostelid) => {
    const config = getConfig();
    const url = `/api/admin/${hostelid}/discard`;
    return await axios.get(url, config);
};

const showUsers = async (hostelid, skip, limit, sortBy, order, search) => {
    const config = getConfig();
    const url = `/api/admin/${hostelid}/users?skip=${skip}&limit=${limit}&sortBy=${sortBy}:${order}${
        search ? "&" + search : ""
    }`;
    return await axios.get(url, config);
};

const updateUserDetails = async (hostelid, userid, details) => {
    const config = getConfig();
    const url = `/api/admin/${hostelid}/${userid}`;
    return await axios.patch(url, details, config);
};

export {
    changePassword,
    getHostels,
    deleteHostel,
    discardFinalSubmit,
    addNewHostel,
    updateHostelDetails,
    finalSubmit,
    uploadCSV,
    updateUserDetails,
    showUsers,
};
