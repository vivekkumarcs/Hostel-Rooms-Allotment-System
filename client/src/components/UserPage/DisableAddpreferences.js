import React from "react";
import axios from "axios";
import Option from "./options";
import Select from "react-select";
import Modal from "react-modal";
import OptionModal from "./vacantRoomModel";
import logo from "./../../styles/components/questionmark.png";

export default class DisableAddPreferences extends React.Component {
    showFloors = () => {
        return (
            <div>
                <select
                    className="floor"
                    name="floors"
                    onChange={this.handleChange}
                    value="NA"
                >
                    <option>NA</option>
                </select>
            </div>
        );
    };

    showRooms = () => {
        return (
            <div className="room">
                {" "}
                <select
                    className="floor"
                    name="floors"
                    onChange={this.handleChange}
                    value="NA"
                >
                    <option>NA</option>
                </select>
            </div>
        );
    };

    showMessage = () => {
        let msg = "Preference-wise Rooms List:";

        return <p className="msg">{msg}</p>;
    };

    //close

    //render
    render() {
        // console.log(this.props.User.vacantRooms)
        // console.log(this.state.rooms)
        // console.log(this.state.normalPreferences)
        return (
            <div className="addpreferencesheight">
                <h1 className="heading111">Select your preferences</h1>
                <h3>Current Round : NA</h3>

                <Modal
                    ariaHideApp={false}
                    contentLabel="selected"
                    className="modal"
                >
                    <div>
                        <button className="modalbutton" id="yes">
                            Ok
                        </button>
                    </div>
                </Modal>

                <div className="overflowcontroluser">
                    <div className="inactive-msg">
                        You cannot add any preference during an inactive round
                    </div>
                    <div className="preferenceflex">
                        <div className="preferenceflex1">
                            {" "}
                            <form className="addroomform">
                                <div className="selectlimit">
                                    {" "}
                                    <div>
                                        {" "}
                                        Select floor No. : {this.showFloors()}
                                    </div>
                                    <div>
                                        Select Room No. : {this.showRooms()}
                                    </div>
                                    <input
                                        className="addroom"
                                        type="submit"
                                        name="submit"
                                        value="Add room"
                                        disabled={true}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="preferencelist">
                            {this.showMessage()}
                        </div>
                    </div>

                    {
                        <h4 className="underlined">
                            {" "}
                            Fill the reference details (optional)
                        </h4>
                    }
                    {/*create a new form for referral and referee*/}
                    <form>
                        <input
                            type="text"
                            className="referenceinput"
                            placeholder="referral"
                            name="referral"
                        />
                        <input
                            type="text"
                            className="referenceinput"
                            placeholder="referee"
                            name="referee"
                        />
                        <p>
                            {" "}
                            <input
                                className="preferencesubmit"
                                type="submit"
                                name="Sumit"
                                value="Submit"
                                disabled={true}
                            />
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
