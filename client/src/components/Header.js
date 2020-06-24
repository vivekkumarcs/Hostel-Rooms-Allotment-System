import React from "react";
import { NavLink, Redirect } from "react-router-dom";

class Header extends React.Component {
    state = {
        logout: false,
    };
    flip = () => {
        this.setState((s) => ({
            logout: !s.logout,
        }));
    };

    render() {
        return (
            <div className="header0">
                {(this.state.logout || this.flip()) && <Redirect to="/" />}
                <div>
                    <div className="headerflex">
                        <div className="logoinssertion"></div>
                        <div>
                            {" "}
                            <div className="header01">
                                Hostel Room Allotment System
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="nav0">
                        <div>
                            {" "}
                            <NavLink
                                to="/"
                                className="nav1"
                                activeClassName="nav2"
                                exact={true}
                            >
                                Home
                            </NavLink>
                            {(this.props.admin || this.props.user) && (
                                <NavLink
                                    to={this.props.admin ? "/admin" : "/user"}
                                    className="nav1"
                                    activeClassName="nav2"
                                >
                                    {" "}
                                    {this.props.admin ? "Admin" : "User"}{" "}
                                </NavLink>
                            )}
                            {!(this.props.admin || this.props.user) && (
                                <NavLink
                                    to="/login"
                                    className="nav1"
                                    activeClassName="nav2"
                                >
                                    {" "}
                                    LogIn{" "}
                                </NavLink>
                            )}
                            {!(this.props.admin || this.props.user) && (
                                <NavLink
                                    to="/signup"
                                    className="nav1"
                                    activeClassName="nav2"
                                >
                                    {" "}
                                    SignUp{" "}
                                </NavLink>
                            )}
                            <NavLink
                                to="/help"
                                className="nav1"
                                activeClassName="nav2"
                            >
                                {" "}
                                Support{" "}
                            </NavLink>
                        </div>
                        {(this.props.admin || this.props.user) && (
                            <div>
                                <NavLink
                                    to="/"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.props.logout(this.flip);
                                    }}
                                    className="logout"
                                >
                                    {" "}
                                    LogOut{" "}
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
export default Header;
