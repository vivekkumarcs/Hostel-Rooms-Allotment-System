import React from "react";
import ModalLoad from "./LoadingModal.js";
import pic from "../images/signup.png";
import { signUp } from "../utils/backend/other";

class Signup extends React.Component {
    state = {
        error: "",
        disabled: false,
        modalshow: undefined,
    };
    submitSignup = async (e) => {
        e.preventDefault();
        this.setState(() => ({ disabled: true, modalshow: true }));
        const firstName = e.target.elements.firstName.value.trim();
        const email = e.target.elements.email.value.trim();
        const password = e.target.elements.password.value;
        const rPassword = e.target.elements.rPassword.value;
        const uniqueKey = e.target.elements.uniqueKey.value;
        const credential = {};
        try {
            const re = /^[A-Za-z0-9]{8,15}$/;
            if (!re.test(password))
                throw new Error("Password must contain only alpha-numerics");
            if (password !== rPassword)
                throw new Error("both passwords must be same");

            credential.name = firstName;
            credential.email = email;
            credential.password = password;
            credential.uniqueKey = uniqueKey;

            const data = await signUp(credential);
            this.props.authenticated(data.data);
        } catch (e) {
            let msg = "";
            if (e.response) {
                const error = e.response;
                if (error.status >= 400 && error.status < 500) {
                    msg =
                        error.status === 401
                            ? "provided unique key is invalid"
                            : "provided email already exists";
                } else {
                    msg = "Please Try Again Later";
                }
            } else {
                msg =
                    e.message === "Network Error"
                        ? "Please check you internet connection"
                        : e.message;
            }
            this.setState(() => ({
                error: msg,
                disabled: false,
                modalshow: undefined,
            }));
        }
    };
    render() {
        return (
            <div className="signupflex">
                {this.state.modalshow && <ModalLoad />}
                <div className="signupflex2">
                    <h2 className="singuptag">
                        <img className="signupicon" src={pic} alt="" />
                        Admin Sign Up
                    </h2>
                    <div className="mobileformview">
                        {this.state.error && (
                            <p className="errorshow">{this.state.error}</p>
                        )}
                        <form className="form" onSubmit={this.submitSignup}>
                            <div className="signupalign">
                                <div className="bringdown">
                                    <label htmlFor="firstName1">Name</label>
                                    <label className="red">*</label>
                                </div>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="name"
                                    required={true}
                                />
                            </div>

                            <div className="signupalign">
                                <div className="bringdown">
                                    <label htmlFor="emailid">Email</label>
                                    <label className="red">*</label>
                                </div>
                                <input
                                    placeholder="email"
                                    type="email"
                                    id="emailid"
                                    name="email"
                                    required={true}
                                />
                            </div>
                            <div className="signupalign">
                                <div className="bringdown">
                                    <label htmlFor="uniqueKey">
                                        Unique Key
                                    </label>
                                    <label className="red">*</label>
                                </div>
                                <input
                                    placeholder="Unique Key"
                                    type="text"
                                    id="uniqueKey"
                                    name="uniqueKey"
                                    required={true}
                                />
                            </div>

                            <div className="signupalign">
                                <div className="bringdown">
                                    {" "}
                                    <label htmlFor="password_id">
                                        Password
                                    </label>
                                    <label className="red">*</label>
                                </div>
                                <input
                                    type="password"
                                    id="password_id"
                                    name="password"
                                    placeholder="password"
                                    required={true}
                                    minLength={8}
                                    maxLength={15}
                                />
                            </div>

                            <div className="signupalign">
                                <div className="bringdown">
                                    {" "}
                                    <label htmlFor="retypePassword_id">
                                        Confirm Password
                                    </label>
                                    <label className="red">*</label>
                                </div>
                                <input
                                    type="password"
                                    id="retypePassword_id"
                                    name="rPassword"
                                    placeholder="confirm password"
                                    required={true}
                                    minLength={8}
                                    maxLength={15}
                                />
                            </div>
                            <div className="term">
                                <input
                                    type="checkbox"
                                    id="term_id"
                                    name="checkbox"
                                    required={true}
                                />
                                <label className="terms" htmlFor="term_id">
                                    I accept the terms of Use & Privacy Policy
                                </label>
                                <br />
                            </div>
                            <div className="marginsetsignup">
                                {" "}
                                <input
                                    type="submit"
                                    id="create_an_Account"
                                    name="submit"
                                    value="Create Account"
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

export default Signup;
