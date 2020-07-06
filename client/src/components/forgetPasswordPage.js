import React from "react";
import validator from "validator";
import lock from "./lock.png";
import { sendOTP, OTPVerify, updatePassword } from "../utils/backend/other";
class Passwordreset extends React.Component {
    state = {
        Email: "",
        isSetPage: 1,
        error: "",
        otp: "",
        successMsg: "",
        disablePage1: false,
        disablePage2a: false,
        disablePage2b: false,
        disablePage3: false,
    };

    handleSubmitPage1 = async (e) => {
        e.preventDefault();
        this.setState(() => ({ disablePage1: true }));
        const email = e.target.elements.email.value;
        try {
            if (!validator.isEmail(email)) {
                this.setState(() => ({ error: "Please enter valid email" }));
                throw new Error();
            }

            const credential = {};
            credential.email = email;

            const data = await sendOTP(credential);

            if (!data.data.sent) {
                this.setState(() => ({
                    error: "Provided email does not exists in our database",
                }));
                throw new Error();
            } else {
                this.setState(() => ({
                    error: "",
                    Email: email,
                    isSetPage: 2,
                    disablePage1: false,
                    successMsg: "OTP has been sent to provided email",
                }));
            }
        } catch (e) {
            this.setState(() => ({ disablePage1: false }));
        }
    };

    handleChange = (e) => {
        this.setState({ otp: e.target.value });
    };

    handleResend = async () => {
        this.setState(() => ({ disablePage2b: true }));

        const credential = {};
        credential.email = this.state.Email;
        const data = await sendOTP(credential);
        if (data.data.sent) {
            this.setState(() => ({
                error: "",
                otp: "",
                disablePage2b: false,
                successMsg: "OTP has been sent to provided email",
            }));
        } else {
            this.setState(() => ({ disablePage2b: false }));
        }
    };

    handleSubmitPage2 = async (e) => {
        e.preventDefault();
        this.setState(() => ({ disablePage2a: true }));
        // backend call

        const credential = {};
        credential.email = this.state.Email;
        credential.OTP = parseInt(e.target.elements.otp.value);

        try {
            await OTPVerify(credential);
            this.setState(() => ({
                isSetPage: 3,
                error: "",
                disablePage2a: false,
                successMsg: "OTP Verified",
            }));
        } catch (e) {
            this.setState(() => ({
                error: "Invalid OTP",
                disablePage2a: false,
                successMsg: "",
            }));
        }
    };
    handlePasswordUpdate = async (e) => {
        e.preventDefault();
        this.setState(() => ({ disablePage3: true }));
        const x = e.target.elements.newPassword.value;
        const y = e.target.elements.reNewPassword.value;
        try {
            if (x !== y) {
                this.setState(() => ({
                    error: "Both passwords must be same",
                    successMsg: "",
                }));
                throw new Error();
            }
            const re = /^[a-zA-Z0-9]{8,15}$/;
            if (!re.test(x)) {
                this.setState(() => ({
                    error: "password must contain only alphanumeric keys",
                    successMsg: "",
                }));
                throw new Error();
            }

            const credential = {};
            credential.email = this.state.Email;
            credential.newPassword = x;
            await updatePassword(credential);

            this.setState(() => ({
                successMsg: "Your password is updated successfully.",
                error: "",
                isSetPage: 4,
            }));
        } catch (e) {
            this.setState(() => ({ disablePage3: false }));
        }
    };

    render() {
        const Page1 = (
            <div className="box">
                <div className="heading-box">
                    <h3 className="headingxz">
                        <img className="lock" src={lock} alt="" />
                        Password Reset
                    </h3>
                    <hr />
                </div>
                <p className="description-otp">
                    Enter your email Id below to get an OTP on your email-id to
                    reset password.
                </p>
                <div>
                    {this.state.error && (
                        <p className="errorshow">{this.state.error}</p>
                    )}
                    <form
                        className="form-box"
                        onSubmit={this.handleSubmitPage1}
                        onKeyPress={(event) =>
                            event.which === 13 && event.preventDefault()
                        }
                    >
                        <div className="margin-top">
                            <input
                                className="input-email"
                                type="text"
                                name="email"
                                placeholder="Email_Id"
                                required={true}
                            />
                        </div>
                        <div className="for-margin">
                            <input
                                className="OTP-send"
                                type="submit"
                                value="Send OTP"
                                disabled={this.state.disablePage1}
                            />
                        </div>
                    </form>
                </div>
            </div>
        );

        const Page2 = (
            <div className="box">
                <div>
                    <h3 className="heading">OTP Validation</h3>
                    <hr />
                </div>
                <div>
                    <p>
                        Email Id: <span>{this.state.Email}</span>
                    </p>
                    <p className="success">{this.state.successMsg}</p>
                    {this.state.error && (
                        <p className="errorshow">{this.state.error}</p>
                    )}
                    <span>
                        <form
                            onSubmit={this.handleSubmitPage2}
                            onKeyPress={(event) =>
                                event.which === 13 && event.preventDefault()
                            }
                        >
                            <input
                                className="input-email"
                                type="number"
                                placeholder="Enter OTP"
                                name="otp"
                                value={this.state.otp}
                                onChange={this.handleChange}
                            />
                            <div className="right-float">
                                <span className="margin-float">
                                    <input
                                        className="forgot-button"
                                        type="submit"
                                        value="Verify OTP"
                                        disabled={
                                            this.state.otp.length !== 6 ||
                                            this.state.disablePage2a
                                        }
                                    />
                                </span>
                            </div>
                        </form>
                    </span>
                    <span className="right-float">
                        <button
                            className="forgot-button"
                            onClick={this.handleResend}
                            disabled={this.state.disablePage2b}
                        >
                            Resend OTP
                        </button>
                    </span>
                </div>
            </div>
        );

        const Page3 = (
            <div className="box">
                <div>
                    <h3 className="heading">Password Reset</h3>
                    <hr />
                </div>
                <p>
                    Email Id: <span>{this.state.Email}</span>
                </p>
                <p className="success">{this.state.successMsg}</p>
                {this.state.error && (
                    <p className="errorshow">{this.state.error}</p>
                )}
                <form
                    onSubmit={this.handlePasswordUpdate}
                    onKeyPress={(event) =>
                        event.which === 13 && event.preventDefault()
                    }
                >
                    <label htmlFor="id_newPassword">Enter New Password:</label>
                    <br />
                    <div>
                        <input
                            className="input-email"
                            type="password"
                            id="id_newPassword"
                            name="newPassword"
                            required={true}
                            minLength={8}
                            maxLength={15}
                        />
                    </div>
                    <br />
                    <label htmlFor="re_newPassword">
                        Re-enter New Password:
                    </label>
                    <br />
                    <input
                        className="input-email"
                        type="password"
                        name="reNewPassword"
                        id="re_newPassword"
                        required={true}
                        minLength={8}
                        maxLength={15}
                    />
                    <br />
                    <div className="margin-top">
                        <input
                            className="OTP-send"
                            type="submit"
                            value="Update Password"
                            disabled={this.state.disablePage3}
                        />
                    </div>
                </form>
            </div>
        );

        return (
            <div className="setMiddle">
                {this.state.isSetPage === 1 && Page1}
                {this.state.isSetPage === 2 && Page2}
                {this.state.isSetPage === 3 && Page3}
                {this.state.isSetPage === 4 && (
                    <div className="page4-succesful">
                        <h3>{this.state.successMsg}</h3>
                        <h3>Go back to Home Page</h3>
                    </div>
                )}
            </div>
        );
    }
}
export default Passwordreset;
