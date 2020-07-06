import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Homepage from "../components/Homepage";
import Loginpage from "../components/Loginpage";
import Signup from "../components/Signuppage";
import Adminpage from "../components/Adminpage";
import HelpPage from "../components/HelpPage";
import Userpage from "../components/Userpage";
import NotFoundPage from "../components/NotFoundPage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Passwordreset from "../components/forgetPasswordPage";
import ModalLoad from "../components/LoadingModal.js";
import { logOut, getUser } from "../utils/backend/other";

class AppRouter extends React.Component {
    state = {
        isAdmin: false,
        isUser: false,
        modalshow: undefined,
    };

    UNSAFE_componentWillMount = async () => {
        if (localStorage.getItem("userData")) {
            this.setState(() => ({ modalshow: true }));
            try {
                const userData = JSON.parse(localStorage.getItem("userData"));
                // backend call
                const data = await getUser();

                data.data.vacantRooms &&
                    (data.data.vacantRooms = JSON.parse(data.data.vacantRooms));
                data.data.disabledRooms &&
                    (data.data.disabledRooms = JSON.parse(
                        data.data.disabledRooms
                    ));
                console.log(data.data.vacantRooms);
                console.log(data.data.disabledRooms);
                this.setState(() => ({
                    User: data.data,
                    isAdmin: userData.admin,
                    isUser: !userData.admin,
                }));
            } catch (e) {
                localStorage.removeItem("userData");
            }
            this.setState(() => ({ modalshow: undefined }));
        }
    };

    authenticated = (data) => {
        const userData = {};
        userData.token = data.token;
        userData.admin = data.admin;
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log(data.User.vacantRooms);
        // parsing the vacant room and disable quota/;
        data.User.vacantRooms &&
            (data.User.vacantRooms = JSON.parse(data.User.vacantRooms));
        data.User.disabledRooms &&
            (data.User.disabledRooms = JSON.parse(data.User.disabledRooms));
        console.log(data.User.vacantRooms);
        this.setState(() => ({
            isAdmin: data.admin,
            isUser: !data.admin,
            User: data.User,
        }));
    };

    getComponent = (Component) => {
        if (this.state.isAdmin) {
            return <Redirect to="/admin" />;
        } else if (this.state.isUser) {
            return <Redirect to="/user" />;
        } else return <Component authenticated={this.authenticated} />;
    };

    logout = async (flip) => {
        try {
            // backend call
            await logOut();

            localStorage.removeItem("userData");
            this.setState(() => ({
                isAdmin: false,
                isUser: false,
            }));
            flip();
        } catch (e) {}
    };

    render() {
        return (
            <div>
                {this.state.modalshow && <ModalLoad />}
                {!this.state.modalshow && (
                    <BrowserRouter>
                        <div className="basicflex">
                            <Header
                                logout={this.logout}
                                admin={this.state.isAdmin}
                                user={this.state.isUser}
                            />
                            <div>
                                <Switch>
                                    <Route
                                        exact
                                        path="/"
                                        component={Homepage}
                                    />
                                    <Route exact path="/login">
                                        {this.getComponent(Loginpage)}
                                    </Route>
                                    <Route exact path="/signup">
                                        {this.getComponent(Signup)}
                                    </Route>
                                    <Route
                                        exact
                                        path="/help"
                                        component={HelpPage}
                                    />
                                    <Route
                                        exact
                                        path="/forgotPassword"
                                        component={Passwordreset}
                                    />
                                    {this.state.isUser && (
                                        <Route exact path="/user">
                                            <Userpage User={this.state.User} />
                                        </Route>
                                    )}

                                    {this.state.isAdmin && (
                                        <Route exact path="/admin">
                                            <Adminpage User={this.state.User} />
                                        </Route>
                                    )}
                                    <Route component={NotFoundPage} />
                                </Switch>
                            </div>
                            <Footer />
                        </div>
                    </BrowserRouter>
                )}
            </div>
        );
    }
}

export default AppRouter;
