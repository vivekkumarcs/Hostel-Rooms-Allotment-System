import React from "react";
import AddPreferences from "./UserPage/AddPreferences";
import AllotmentResult from "./UserPage/AllotmentResult";
import DisableAddPreferences from "./UserPage/DisableAddpreferences";
import ChangePassword from "./UserPage/ChangePassword";
import YourInfo from "./UserPage/YourInfo";

class Userpage extends React.Component {
    state = {
        User: this.props.User,
        currentActive: 0,
        //0->userInfo,1->changepassword, 2->addPreferences, 3->disableAddPreferences
        // 4->allotmentResult
        popupVisible: false,
        width: "0px",
        mountedVariable: false,
    };

    componentDidMount = () => {
        this.setState(() => ({
            mountedVariable: true,
        }));
    };

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

        this.setState(() => ({
            popupVisible: !this.state.popupVisible,
            mountedVariable: false,
            width: this.state.width === "0px" ? "380px" : "0px",
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

    userInfo = () => {
        this.setState(() => ({
            currentActive: 0,
        }));
    };

    changepasswordFunction = () => {
        this.setState(() => ({
            currentActive: 1,
        }));
    };

    addPreferences = () => {
        this.setState(() => ({
            currentActive: 2,
        }));
    };

    //I have added the new function for disable button
    disableAddPreferencesPage = () => {
        this.setState(() => ({
            currentActive: 3,
        }));
    };
    allotmentResult = () => {
        this.setState(() => ({
            currentActive: 4,
        }));
    };

    updatePreferences = (data) => {
        const User = this.state.User;
        Object.keys(data).forEach((key) => (User[key] = data[key]));
        this.setState(() => ({ User: User }));
    };
    appliedForNextRound = () => {
        const User = this.state.User;
        User.nextRound = true;
        this.setState(() => ({
            User: User,
        }));
    };

    render() {
        //console.log(this.props.User)
        const userName =
            this.props.User.name.charAt(0).toUpperCase() +
            this.props.User.name.slice(1).split(" ")[0].toLowerCase();
        return (
            <div className="flex-container0">
                <div
                    ref={(node) => {
                        this.node = node;
                    }}
                >
                    {" "}
                    <div>
                        <div
                            className={
                                this.state.mountedVariable ? "DisplayNone" : ""
                            }
                        >
                            {/*start button in humberger*/}
                            <div
                                className={
                                    this.state.popupVisible
                                        ? "flex-container1"
                                        : "flex-container11"
                                }
                            >
                                <button
                                    className={
                                        this.state.currentActive === 0
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.userInfo}
                                    ref={(node) => {
                                        this.node = node;
                                    }}
                                >
                                    User Info
                                </button>

                                <button
                                    className={
                                        this.state.currentActive === 1
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.changepasswordFunction}
                                    ref={(node) => {
                                        this.node = node;
                                    }}
                                >
                                    Change Password
                                </button>

                                {this.props.User.editable && (
                                    <button
                                        className={
                                            this.state.currentActive === 2
                                                ? "buttonactive"
                                                : "flexdiv"
                                        }
                                        onClick={this.addPreferences}
                                        disabled={!this.props.User.editable}
                                        ref={(node) => {
                                            this.node = node;
                                        }}
                                    >
                                        Add Preferences
                                    </button>
                                )}

                                {/* I addded the new disabled Add perferences */}
                                {!this.props.User.editable && (
                                    <button
                                        className={
                                            this.state.currentActive === 3
                                                ? "buttonactive"
                                                : "flexdiv"
                                        }
                                        onClick={this.disableAddPreferencesPage}
                                        disabled={this.props.User.editable}
                                        ref={(node) => {
                                            this.node = node;
                                        }}
                                    >
                                        Add Preferences
                                    </button>
                                )}
                                {/* end */}

                                <button
                                    className={
                                        this.state.currentActive === 4
                                            ? "buttonactive"
                                            : "flexdiv"
                                    }
                                    onClick={this.allotmentResult}
                                    ref={(node) => {
                                        this.node = node;
                                    }}
                                >
                                    Allotment Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*main contenet*/}
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
                                //onClick={this.burgerclick}
                                onClick={this.handleClick}
                                ref={(node) => {
                                    this.node = node;
                                }}
                            ></button>
                            Hello, {userName}
                        </h1>
                    </div>
                    <div className="admindiv">
                        {(this.state.currentActive === 0 && (
                            <YourInfo User={this.state.User} />
                        )) || //User info
                        (this.state.currentActive === 1 && (
                            <ChangePassword />
                        )) || //change Password
                            (this.state.currentActive === 2 && (
                                <AddPreferences
                                    User={this.state.User}
                                    updatePreferences={this.updatePreferences}
                                />
                            )) ||
                            (this.state.currentActive === 3 && (
                                <DisableAddPreferences
                                    User={this.state.User}
                                    /*updatePreferences={this.updatePreferences}*/
                                />
                            )) ||
                            (this.state.currentActive === 4 && (
                                <AllotmentResult
                                    User={this.state.User}
                                    appliedForNextRound={
                                        this.appliedForNextRound
                                    }
                                />
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Userpage;

// <div className="flex-container0">
//   <div className="flex-container1">
//     <button
//       className={this.state.userInfo ? "buttonactive" : "flexdiv"}
//       onClick={this.userInfo}
//     >
//       User Info
//     </button>
//     {/* I addded the new disabled Add perferences */}
//     {!this.props.User.editable
//       &&
//       <button
//         className={this.state.disableAddPreferences ? "buttonactive" : "flexdiv"}
//         onClick={this.disableAddPreferencesPage}
//         disabled={this.props.User.editable}
//       >
//         Add Preferences
//     </button>

//     }
//     {/* end */}
//     {this.props.User.editable
//       &&
//       <button
//         className={this.state.addPreferences ? "buttonactive" : "flexdiv"}
//         onClick={this.addPreferences}
//         disabled={!this.props.User.editable}
//       >
//         Add Preferences
//     </button>
//     }
//     <button
//       className={this.state.allotmentResult ? "buttonactive" : "flexdiv"}
//       onClick={this.allotmentResult}
//     >
//       Allotment Results
//     </button>
//   </div>
//   <div className="flex2">
//     <h1 className="allheadings">User Workspace</h1>
//     <div className="admindiv">
//       {(this.state.userInfo && <UserInfo User={this.state.User} />) ||
//         (this.state.disableAddPreferences && (
//           <DisableAddPreferences
//             User={this.state.User}
//           /*updatePreferences={this.updatePreferences}*/
//           />
//         ))
//         ||
//         (this.state.addPreferences && (
//           <AddPreferences
//             User={this.state.User}
//             updatePreferences={this.updatePreferences}
//           />
//         ))
//         ||
//         (this.state.allotmentResult && (
//           <AllotmentResult
//             User={this.state.User}
//             appliedForNextRound={this.appliedForNextRound}
//           />
//         ))}
//     </div>
//   </div>
// </div>
