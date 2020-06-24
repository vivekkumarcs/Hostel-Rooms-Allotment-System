import React from "react";
import axios from "axios";
export default class ChangeAdminpassword extends React.Component {
    state = {
        error: "",
        disabled: false,
    };

    handleChangePassword = async (e) => {
        e.preventDefault();
        e.persist();
        this.setState(() => ({ disabled: true }));
        const prevPassword = e.target.elements.prevPassword.value;
        const newPassword = e.target.elements.newPassword.value;
        const retypePassword = e.target.elements.retypePassword.value;
        try {
            const re = /^[A-Za-z0-9]{8,15}$/;
            const msg = "password must contain only alphaNumerics";
            if (!re.test(prevPassword)) throw new Error("Old " + msg);
            if (!re.test(newPassword)) throw new Error("New " + msg);
            if (!re.test(retypePassword)) throw new Error("re-Enter " + msg);
            if (newPassword !== retypePassword) {
                throw new Error(
                    "! New password and re-entered password did not match"
                );
            }
            if (newPassword === prevPassword) {
                throw new Error(
                    "Old password and New password must be different"
                );
            }
            const credential = {};
            credential.oldPassword = prevPassword;
            credential.newPassword = newPassword;

            // calling the backend to change the password
            const url = "/api/user/changePassword";
            const config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("userData"))
                        .token,
                },
            };
            await axios.patch(url, credential, config);

            this.setState(() => ({ error: "password changed successfully" }));
            e.target.elements.prevPassword.value = "";
            e.target.elements.newPassword.value = "";
            e.target.elements.retypePassword.value = "";
        } catch (e) {
            let msg = "";
            if (e.response) {
                const error = e.response;
                if (error.status >= 400 && error.status < 500) {
                    msg = "password did not satisfied the criteria";
                } else {
                    msg = "Please Try Again Later";
                }
            } else {
                msg = e.message;
            }
            this.setState(() => ({ error: msg }));
        }
        this.setState(() => ({ disabled: false }));
    };

    render() {
        return (
            <div>
                <h1 className="heading111">Change Password</h1>
                <div className="overflowcontrol">
                    <div>
                        <h3>
                            Change Password below by entering following
                            credentials
                        </h3>

                        <form
                            className="formdiv"
                            onSubmit={this.handleChangePassword}
                            onReset={this.resetInput}
                        >
                            {this.state.error && (
                                <p className="errorshow">{this.state.error}</p>
                            )}
                            <p>
                                <label htmlFor="id_prevPassword">
                                    Old Password
                                </label>
                                <input
                                    className="float"
                                    type="password"
                                    id="id_prevPassword"
                                    name="prevPassword"
                                    required={true}
                                    minLength={8}
                                    maxLength={15}
                                />
                            </p>

                            <p>
                                <label htmlFor="id_newPassword">
                                    New Password
                                </label>
                                <input
                                    className="float"
                                    type="password"
                                    id="id_newPassword"
                                    name="newPassword"
                                    required={true}
                                    minLength={8}
                                    maxLength={15}
                                />
                            </p>

                            <p>
                                <label htmlFor="id_retypePassword">
                                    Re-Enter Password
                                </label>
                                <input
                                    className="float"
                                    type="password"
                                    id="id_retypePassword"
                                    name="retypePassword"
                                    required={true}
                                    minLength={8}
                                    maxLength={15}
                                />
                            </p>
                            <div className="setreset">
                                <input
                                    className="submitbuttonspace"
                                    type="reset"
                                    name="reset"
                                />
                                <input
                                    className="submitbuttonspace"
                                    type="submit"
                                    name="submit"
                                    value="Save"
                                    disabled={this.state.disabled}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
