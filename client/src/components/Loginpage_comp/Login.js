import React from "react";
import validator from "validator";
import { Link, Redirect } from "react-router-dom";
import ModalLoad from "../LoadingModal.js";
import pass from "../../images/pass.png";
import user from "../../images/user.png";
import { login } from "../../utils/backend/other";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            redirect: false,
            modalshow: undefined,
        };
    }
    Submitted = async (e) => {
        e.preventDefault();
        this.setState(() => ({ modalshow: true }));
        this.setState(() => ({ disabledbutton: true }));
        const password = e.target.password.value;
        const username = e.target.username.value.trim();
        e.target.password.value = "";
        e.target.username.value = "";

        try {
            const re = /^[A-Za-z0-9]{8,15}$/;
            if (!re.test(password))
                throw new Error(
                    "password must contain only alphaNumeric characters"
                );

            const credential = {};
            credential.password = password;
            if (validator.isEmail(username)) {
                credential.email = username;
            } else {
                credential.userid = username;
            }

            const data = await login(credential);
            this.props.authenticated(data.data);
            this.setRedirect();
        } catch (e) {
            let msg = "";
            if (e.response) {
                const error = e.response;
                if (error.status >= 400 && error.status < 500) {
                    msg = "incorrect username or password";
                } else {
                    msg = "Please Try Again Later";
                }
            } else {
                msg = e.message;
            }
            this.setState(() => ({ error: msg }));
        }
        this.setState(() => ({ modalshow: undefined }));
    };

    setRedirect = () => {
        this.setState({
            redirect: true,
        });
    };
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/admin" />;
        }
    };
    render() {
        return (
            <div className="temp">
                {" "}
                {this.state.modalshow && <ModalLoad />}
                {this.renderRedirect()}
                <form onSubmit={this.Submitted}>
                    {this.state.error && (
                        <p className="errorshow">{this.state.error}</p>
                    )}
                    <p className="headings"> Username</p>
                    <p className="login-icon-flex">
                        <img className="login-icons" src={user} alt="" />
                        <input
                            className="logininput"
                            type="text"
                            name="username"
                            placeholder="Username"
                            required={true}
                            maxLength={50}
                        />
                    </p>
                    <p className="headings">Password</p>
                    <p className="login-icon-flex">
                        <img className="login-icons" src={pass} alt="" />
                        <input
                            className="logininput"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required={true}
                            maxLength={15}
                            minLength={8}
                        />
                    </p>
                    <div className="fptag">
                        <input
                            className="loginsubmit"
                            type="submit"
                            value="Login"
                        />

                        <p className="forgetright">
                            <Link to="/forgotPassword">forgot password</Link>
                        </p>
                    </div>
                    <p className="signupoption">
                        Don't have an Account ?{" "}
                        <Link to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        );
    }
}

export default Login;
