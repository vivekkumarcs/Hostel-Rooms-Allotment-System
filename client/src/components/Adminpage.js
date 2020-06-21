import React from "react";
import Addhostel from "./adminpage_comp/Addhostel";
import Currenthostel from "./adminpage_comp/Currenthostel";
import Upcomingevents from "./adminpage_comp/Upcominghostel";
import AdminInfo from "./adminpage_comp/AdminInfo";
import ShowUsers from "./showUsers/ShowUsers";
import ChangeAdminpassword from "./adminpage_comp/ChangeAdminpassword";

class Adminpage extends React.Component {
    state = {
        admininfo: true,
        addhostel: false,
        currenthostel: false,
        upcominghostel: false,
        edithostel: false,
        showUsers: false,
        changePassword: false,
        popupVisible: false,
        mountedVariable: false,
    };

    componentDidMount = () => {
        this.setState(() => ({
            mountedVariable: true,
        }));
    };
    //start burger
    handleClick = () => {
        if (!this.state.popupVisible) {
            // attach/remove event handler
            document.addEventListener("click", this.handleOutsideClick, false);
        } else {
            document.removeEventListener(
                "click",
                this.handleOutsideClick,
                false
            );
        }

        this.setState((prevState) => ({
            mountedVariable: false,
            popupVisible: !prevState.popupVisible,
        }));
    };

    handleOutsideClick = (e) => {
        // ignore clicks on the component itself

        try {
            if (this.node.contains(e.target)) {
                return;
            }
        } catch (e) {
            return;
        }
        this.handleClick();
    };

    //end burger

    admininfo = () => {
        this.setState(() => ({
            admininfo: true,
            addhostel: false,
            currenthostel: false,
            upcominghostel: false,
            edithostel: false,
            changePassword: false,
            showUsers: false,
        }));
    };
    add = () => {
        this.setState(() => ({
            admininfo: false,
            addhostel: true,
            currenthostel: false,
            upcominghostel: false,
            edithostel: false,
            showUsers: false,
            changePassword: false,
            hostelDetail: null,
        }));
    };
    current = () => {
        this.setState(() => ({
            admininfo: false,
            addhostel: false,
            currenthostel: true,
            upcominghostel: false,
            edithostel: false,
            showUsers: false,
            changePassword: false,
        }));
    };
    upcoming = () => {
        this.setState(() => ({
            admininfo: false,
            addhostel: false,
            currenthostel: false,
            upcominghostel: true,
            edithostel: false,
            showUsers: false,
            changePassword: false,
        }));
    };
    edithostel = (hostelDetail) => {
        //console.log("from edithostel function");
        this.setState(() => ({
            admininfo: false,
            addhostel: false,
            currenthostel: true,
            upcominghostel: false,
            edithostel: true,
            showUsers: false,
            changePassword: false,
            hostelDetail: hostelDetail,
        }));
    };
    showUsers = (hostelDetail) => {
        this.setState(() => ({
            admininfo: false,
            addhostel: false,
            currenthostel: true,
            upcominghostel: false,
            edithostel: false,
            showUsers: true,
            changePassword: false,
            hostelDetail: hostelDetail,
        }));
    };
    closeUsers = () => {
        this.setState(() => ({
            admininfo: false,
            addhostel: false,
            currenthostel: true,
            upcominghostel: false,
            edithostel: false,
            showUsers: false,
            changePassword: false,
        }));
    };

    changePasswordFunction = () => {
        this.setState(() => ({
            admininfo: false,
            addhostel: false,
            currenthostel: false,
            upcominghostel: false,
            edithostel: false,
            showUsers: false,
            changePassword: true,
        }));
    };
    render() {
        //console.log(this.state.mountedVariable)
        const adminName =
            this.props.User.name.charAt(0).toUpperCase() +
            this.props.User.name.slice(1).split(" ")[0].toLowerCase();
        return (
            <div className="flex-container0">
                <div>
                    {" "}
                    <div>
                        <div
                            className={
                                this.state.mountedVariable ? "DisplayNone" : ""
                            }
                        >
                            <div
                                className={
                                    this.state.popupVisible
                                        ? "flex-container1"
                                        : "flex-container11"
                                }
                            >
                                <button
                                    className={
                                        this.state.admininfo
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.admininfo}
                                >
                                    Admin Info
                                </button>
                                {/*Add change password*/}
                                <button
                                    className={
                                        this.state.changePassword
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.changePasswordFunction}
                                >
                                    Change Password
                                </button>
                                {/*end*/}

                                <button
                                    className={
                                        this.state.addhostel
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.add}
                                >
                                    Add New Hostel
                                </button>
                                <button
                                    className={
                                        this.state.currenthostel
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.current}
                                >
                                    Current Hostels
                                </button>
                                <button
                                    className={
                                        this.state.upcominghostel
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.upcoming}
                                >
                                    Next Allotments
                                </button>
                            </div>
                            {/*burger-menu ended*/}
                        </div>
                    </div>
                </div>

                <div className="flex2">
                    <div>
                        <h1 className="allheadings">
                            {" "}
                            <button
                                className={
                                    !this.state.popupVisible
                                        ? "burger"
                                        : "no-burger"
                                }
                                // onClick={this.burgerclick}
                                onClick={this.handleClick}
                                ref={(node) => {
                                    this.node = node;
                                }}
                            ></button>
                            Hello, {adminName}
                        </h1>
                    </div>

                    <div className={this.state.showUsers ? "" : "admindiv"}>
                        {(this.state.showUsers && (
                            <ShowUsers
                                hostel={this.state.hostelDetail}
                                closeUsers={this.closeUsers}
                            />
                        )) ||
                            (this.state.changePassword && (
                                <ChangeAdminpassword />
                            )) ||
                            ((this.state.edithostel ||
                                this.state.addhostel) && (
                                <Addhostel existing={this.state.hostelDetail} />
                            )) ||
                            (this.state.admininfo && (
                                <AdminInfo User={this.props.User} />
                            )) ||
                            (this.state.currenthostel && (
                                <Currenthostel
                                    edithostel={this.edithostel}
                                    showUsers={this.showUsers}
                                />
                            )) ||
                            (this.state.upcominghostel && <Upcomingevents />)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Adminpage;
