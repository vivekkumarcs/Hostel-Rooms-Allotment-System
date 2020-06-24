import React from "react";
import axios from "axios";
import Option from "./options";
import Select from "react-select";
import Modal from "react-modal";
import OptionModal from "./vacantRoomModel";
import logo from "./../../styles/components/questionmark.png";

export default class AddPrefernces extends React.Component {
    state = {
        normalFloors: this.props.User.vacantRooms.map(
            (detail) => detail.prefix
        ),
        disabledFloors: this.props.User.disabled
            ? this.props.User.disabledRooms.map((detail) => detail.prefix)
            : [],
        normalPreferences:
            !this.props.User.disabled || !this.props.User.disabledQuota
                ? this.props.User.preferences
                : [],
        disabledPreferences:
            this.props.User.disabled && this.props.User.disabledQuota
                ? this.props.User.preferences
                : [],
        rooms:
            this.props.User.disabled && this.props.User.disabledQuota
                ? this.props.User.disabledRooms.length > 0
                    ? this.props.User.disabledRooms[0].rooms
                    : []
                : this.props.User.vacantRooms.length > 0
                ? this.props.User.round === 2
                    ? this.props.User.vacantRooms[0].rooms.map(
                          (room) => room[0]
                      )
                    : this.props.User.vacantRooms[0].rooms
                : [],
        disabledQuota: this.props.User.disabledQuota,
        errormessage: undefined,
        error: undefined,
        value: "",
        //for vacant field purpose
        openVacantModal: false,
        waiting: false,
    };

    checkPreferenceList = (Room) => {
        if (this.props.User.disabled && this.state.disabledQuota) {
            return this.state.disabledPreferences.some((room) => room === Room);
        } else {
            return this.state.normalPreferences.some((room) => room === Room);
        }
    };
    getPreferences = () => {
        if (this.props.User.disabled && this.state.disabledQuota) {
            return this.state.disabledPreferences;
        } else {
            return this.state.normalPreferences;
        }
    };
    updatePreferences = (pref) => {
        if (this.props.User.disabled && this.state.disabledQuota) {
            this.setState(() => ({ disabledPreferences: pref }));
        } else {
            this.setState(() => ({ normalPreferences: pref }));
        }
    };
    handleDeleteOption = (removeOption) => {
        let preferences = this.getPreferences();
        preferences = preferences.filter((option) => option !== removeOption);
        this.updatePreferences(preferences);
        this.setState(() => ({ errormessage: undefined }));
    };

    handleUpOption = (upOption) => {
        let preferences = this.getPreferences();
        preferences = preferences.map((p) => p);
        for (let i = 1; i < preferences.length; i++) {
            if (preferences[i] === upOption) {
                let temp = preferences[i - 1];
                preferences[i - 1] = upOption;
                preferences[i] = temp;
            }
        }
        this.updatePreferences(preferences);
    };

    handleDownOption = (downOption) => {
        let preferences = this.getPreferences();
        preferences = preferences.filter((option) => option !== downOption);
        preferences.push(downOption);
        this.updatePreferences(preferences);
    };

    sendAllValue = async (e) => {
        e.preventDefault();
        this.setState(() => ({ waiting: true }));

        const referral = e.target.elements.referral.value.trim();
        const referee = e.target.elements.referee.value.trim();
        const disabledQuota = this.state.disabledQuota;
        const preferences = disabledQuota
            ? this.state.disabledPreferences
            : this.state.normalPreferences;
        const data = {};
        if (referral !== this.props.User.referral) data.referral = referral;
        if (referee !== this.props.User.referee) data.referee = referee;
        if (disabledQuota !== this.props.User.disabledQuota) {
            data.disabledQuota = disabledQuota;
            data.preferences = preferences;
        } else if (preferences.length !== this.props.User.preferences.length) {
            data.preferences = preferences;
        } else {
            let isDifferent = false;
            for (let i = 0; i < preferences.length; i++) {
                if (preferences[i] !== this.props.User.preferences[i]) {
                    isDifferent = true;
                    break;
                }
            }
            if (isDifferent) {
                data.preferences = preferences;
            }
        }
        if (Object.keys(data).length === 0) {
            this.setState(() => ({
                error: "Please update the data before resubmitting!",
            }));
        } else {
            try {
                const url =
                    "https://hostel-allotment-api.herokuapp.com/user/preferences";
                const config = {
                    headers: {
                        Authorization: JSON.parse(
                            localStorage.getItem("userData")
                        ).token,
                    },
                };
                await axios.post(url, data, config);
                this.setState(() => ({
                    error: "Your preferences have been updated",
                }));
                this.props.updatePreferences(data);
            } catch (e) {
                let msg = "Network Error! Please try again later";
                if (e.response && e.response.status === 406)
                    msg = "Portal has already been closed.";
                this.setState(() => ({ error: msg }));
            }
        }
        this.setState(() => ({ waiting: false }));
        //console.log(data);
    };

    handleAddRoom = (e) => {
        e.preventDefault();
        const prefix = e.target.elements.floors.value;
        const roomNo = e.target.elements.roomNo.value;
        const room = prefix + roomNo;
        //console.log(roomNo)
        if (!roomNo) {
            this.setState(() => ({
                errormessage: "Please select any room!",
            }));
        } else if (this.getPreferences().length >= 10) {
            this.setState(() => ({
                errormessage: "Maximum limit reached!",
            }));
        } else if (!this.checkPreferenceList(room)) {
            if (this.props.User.disabled && this.state.disabledQuota) {
                this.setState((prevState) => ({
                    disabledPreferences: prevState.disabledPreferences.concat(
                        room
                    ),
                    errormessage: undefined,
                }));
            } else {
                this.setState((prevState) => ({
                    normalPreferences: prevState.normalPreferences.concat(room),
                    errormessage: undefined,
                }));
            }
        } else {
            this.setState(() => ({
                errormessage: "this room has already been added",
            }));
        }
    };

    handleChange = (e) => {
        let floorNo = e.target.value;
        let rooms;
        if (this.props.User.disabled && this.state.disabledQuota) {
            this.props.User.disabledRooms.forEach((detail) => {
                if (detail.prefix === floorNo) rooms = detail.rooms;
            });
        } else {
            this.props.User.round === 2
                ? this.props.User.vacantRooms.forEach((detail) => {
                      if (detail.prefix === floorNo)
                          rooms = detail.rooms.map((room) => room[0]);
                  })
                : this.props.User.vacantRooms.forEach((detail) => {
                      if (detail.prefix === floorNo) rooms = detail.rooms;
                  });
        }
        this.setState(() => ({ rooms: rooms, value: "", floorNo: floorNo }));
    };
    handleModal = () => {
        this.setState(() => ({
            error: undefined,
        }));
    };
    handleModal2 = () => {
        this.setState(() => ({
            errormessage: undefined,
        }));
    };

    changeHadicappedQuota = () => {
        let rooms = [];
        let floorNo;
        if (!this.state.disabledQuota) {
            if (this.state.disabledFloors.length > 0) {
                rooms = this.props.User.disabledRooms[0].rooms;
                floorNo = this.props.User.disabledRooms[0].prefix;
            }
        } else {
            if (this.state.normalFloors.length > 0) {
                rooms = this.props.User.vacantRooms[0].rooms;
                floorNo = this.props.User.vacantRooms[0].prefix;
            }
        }
        this.setState((prevState) => ({
            disabledQuota: !prevState.disabledQuota,
            rooms: rooms,
            value: "",
            floorNo: floorNo,
            errormessage: undefined,
        }));
    };

    showFloors = () => {
        let floors;
        if (this.props.User.disabled && this.state.disabledQuota) {
            floors = this.state.disabledFloors;
        } else {
            floors = this.state.normalFloors;
        }
        if (floors.length !== 0) {
            return (
                <div>
                    <select
                        className="floor"
                        name="floors"
                        onChange={this.handleChange}
                        value={
                            this.state.floorNo ? this.state.floorNo : floors[0]
                        }
                    >
                        {floors.map((floor) => (
                            <option key={floor} value={floor}>
                                {floor}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }
    };
    changeSelect = (value) => {
        this.setState(() => ({ value: value }));
    };
    showRooms = () => {
        if (this.state.rooms.length > 0) {
            return (
                <div className="room">
                    {" "}
                    <Select
                        className="selectroom"
                        name="roomNo"
                        menuPlacement="auto"
                        menuPosition="fixed"
                        onChange={this.changeSelect}
                        value={this.state.value}
                        placeholder="Select Room"
                        options={this.state.rooms.map((room) => ({
                            value: room,
                            label: room,
                        }))}
                    />
                </div>
            );
        }
    };

    showMessage = () => {
        let msg = "Preference-wise Rooms List:";
        if (this.props.User.disabled && this.state.disabledQuota) {
            if (this.state.disabledPreferences.length === 0)
                msg = "Your preference list is empty";
        } else {
            if (this.state.normalPreferences.length === 0)
                msg = "Your preference list is empty";
        }
        return <p className="msg">{msg}</p>;
    };

    showOptions = () => {
        let rooms;
        if (this.props.User.disabled && this.state.disabledQuota)
            rooms = this.state.disabledPreferences;
        else rooms = this.state.normalPreferences;

        return rooms.map((room, index) => (
            <Option
                key={index}
                length={rooms.length}
                roomText={room}
                position={index + 1}
                handleDeleteOption={this.handleDeleteOption}
                handleUpOption={this.handleUpOption}
                handleDownOption={this.handleDownOption}
            />
        ));
    };

    /*open vacant function Modal*/
    changeVacantModel = () => {
        this.setState(() => ({ openVacantModal: !this.state.openVacantModal }));
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
                <h3>Current Round : {this.props.User.round}</h3>
                {this.state.error && (
                    <Modal
                        ariaHideApp={false}
                        isOpen={!!this.state.error}
                        contentLabel="selected"
                        className="modal"
                    >
                        <p className="errorshow">{this.state.error}</p>

                        <div>
                            <button
                                className="modalbutton"
                                id="yes"
                                onClick={this.handleModal}
                            >
                                Ok
                            </button>
                        </div>
                    </Modal>
                )}
                <div className="overflowcontroluser">
                    <div className="vacantdiv">
                        {this.props.User.round === 2 && (
                            <div>
                                <p>
                                    <button
                                        onClick={this.changeVacantModel}
                                        className="question-mark-button"
                                    >
                                        Check vacant rooms list
                                        <img
                                            src={logo}
                                            className="content-button"
                                            alt="?"
                                        />
                                        {/*&#10068;*/}
                                    </button>
                                </p>
                                <OptionModal
                                    vacantRooms={this.props.User.vacantRooms}
                                    openVacantModal={this.state.openVacantModal}
                                    changeVacantModel={this.changeVacantModel}
                                />
                            </div>
                        )}
                    </div>
                    <div className="preferenceflex">
                        <div className="preferenceflex1">
                            {" "}
                            <form
                                className="addroomform"
                                onSubmit={this.handleAddRoom}
                            >
                                {this.props.User.disabled && (
                                    <p>
                                        <label>
                                            <input
                                                className="checksize"
                                                type="checkbox"
                                                name="disabledQuota"
                                                checked={
                                                    this.state.disabledQuota
                                                }
                                                onChange={
                                                    this.changeHadicappedQuota
                                                }
                                            />
                                            Select Under Handicapped Division
                                            only?
                                        </label>
                                    </p>
                                )}
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
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="preferencelist">
                            {this.state.errormessage && (
                                <Modal
                                    ariaHideApp={false}
                                    isOpen={!!this.state.errormessage}
                                    contentLabel="selected"
                                    className="modal"
                                >
                                    <p className="errorshow">
                                        {this.state.errormessage}
                                    </p>

                                    <div>
                                        <button
                                            className="modalbutton"
                                            id="yes"
                                            onClick={this.handleModal2}
                                        >
                                            Ok
                                        </button>
                                    </div>
                                </Modal>
                            )}
                            {this.showMessage()}
                            <span>{this.showOptions()}</span>
                        </div>
                    </div>

                    {
                        <h4 className="underlined">
                            {" "}
                            Fill the reference details (optional)
                        </h4>
                    }
                    {/*create a new form for referral and referee*/}
                    <form onSubmit={this.sendAllValue}>
                        <input
                            type="text"
                            className="referenceinput"
                            placeholder="referral"
                            defaultValue={this.props.User.referral}
                            name="referral"
                        />
                        <input
                            type="text"
                            className="referenceinput"
                            placeholder="referee"
                            defaultValue={this.props.User.referee}
                            name="referee"
                        />
                        <p>
                            {" "}
                            <input
                                className="preferencesubmit"
                                type="submit"
                                name="Sumit"
                                value={
                                    this.state.waiting ? "Submitting" : "Submit"
                                }
                            />
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
