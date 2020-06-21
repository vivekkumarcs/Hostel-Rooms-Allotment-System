//  hostel details....
import React from "react";
import validateRange from "./errorCheck";
import axios from "axios";

class Page1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hostelName: this.props.values.hostelName,
            roomCapacity: this.props.values.roomCapacity,
            roomRange: this.props.values.roomRange,
            disabledRoomRange: this.props.values.disabledRoomRange,
            wrapAround: this.props.values.wrapAround,
            errormessage: "",
        };
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState(() => ({
            hostelName: props.values.hostelName,
            roomCapacity: props.values.roomCapacity,
            roomRange: props.values.roomRange,
            disabledRoomRange: props.values.disabledRoomRange,
            wrapAround: props.values.wrapAround,
            errormessage: "",
        }));
    }

    saveAndContinue = async (e) => {
        e.preventDefault();
        const elements = e.target.elements;
        const hostelData = {};
        hostelData.hostelName = elements.hostelName.value.trim();
        hostelData.roomCapacity = parseInt(elements.roomCapacity.value);
        hostelData.roomRange = elements.roomRange.value.trim();
        hostelData.disabledRoomRange = elements.disabledRoomRange.value.trim();
        hostelData.wrapAround = elements.wrapAround.value === "true";

        try {
            validateRange(hostelData.roomRange, "Room Range");
            if (hostelData.disabledRoomRange) {
                validateRange(
                    hostelData.disabledRoomRange,
                    "Room Range for physically disabled"
                );
            }
            const config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("userData"))
                        .token,
                },
            };

            if (this.props.values.saved) {
                const provided = this.props.values;
                if (
                    !(
                        provided.hostelName === hostelData.hostelName &&
                        provided.roomCapacity === hostelData.roomCapacity &&
                        provided.roomRange === hostelData.roomRange &&
                        provided.disabledRoomRange ===
                            hostelData.disabledRoomRange &&
                        provided.wrapAround === hostelData.wrapAround
                    )
                ) {
                    //call axios to update data of existing hostel
                    console.log("I am from existing");
                    const url = `/api/admin/${this.props.values.id}`;
                    await axios.patch(url, hostelData, config);
                }
            } else {
                //call axios to add the data of new hostel
                console.log("I am from new");
                const url = "/api/admin/hostel";
                const data = await axios.post(url, hostelData, config);

                hostelData.id = data.data._id;
            }

            this.props.handleChange(hostelData);
            this.props.nextStep();
            this.setState(() => ({ errormessage: "" }));
        } catch (e) {
            let msg = "";
            if (e.response) {
                const error = e.response;
                if (error.status >= 400 && error.status < 500) {
                    msg = "validation failed";
                } else {
                    msg = "Please Try Again Later";
                }
            } else {
                msg =
                    e.message.toLowerCase() === "network error"
                        ? "Please Try Again Later"
                        : e.message;
            }
            this.setState(() => ({ errormessage: msg }));
        }
    };
    handleChange = (e) => {
        const change = {};
        change[e.target.name] = e.target.value;
        this.setState(() => change);
    };

    render() {
        return (
            <div>
                {this.props.values.newUser ? (
                    <h1 className="heading111">Add New Hostel</h1>
                ) : (
                    <h1 className="heading111">Update Hostel Details</h1>
                )}
                {this.state.errormessage && (
                    <p className="errorshow">{this.state.errormessage}</p>
                )}
                <h4>Enter Hostel Details</h4>
                <form
                    className="overflowcontrol"
                    onSubmit={this.saveAndContinue}
                >
                    <div className="widthsetting">
                        <p className="addhostellabels">Hostel Name</p>
                        <input
                            className="hosteldetails"
                            type="text"
                            name="hostelName"
                            placeholder="hostel name"
                            value={this.state.hostelName}
                            onChange={this.handleChange}
                            required={true}
                        />
                        <p className="addhostellabels">Each room capacity</p>
                        <select
                            className="hosteldetails"
                            name="roomCapacity"
                            value={this.state.roomCapacity}
                            onChange={this.handleChange}
                        >
                            <option value="1">1 person</option>
                            <option value="2">2 persons</option>
                            <option value="3">3 persons</option>
                            <option value="4">4 persons</option>
                            <option value="5">5 persons</option>
                            <option value="6">6 persons</option>
                        </select>
                        <p className="addhostellabels">
                            Rooms Range (eg. G1-G8, F1-F5, F7)
                        </p>
                        <input
                            className="hosteldetails"
                            type="text"
                            placeholder="rooms range"
                            name="roomRange"
                            value={this.state.roomRange}
                            onChange={this.handleChange}
                            required={true}
                        />
                        <p className="addhostellabels">
                            Rooms range for physically disabled
                        </p>
                        <input
                            className="hosteldetails"
                            type="text"
                            placeholder="rooms range"
                            name="disabledRoomRange"
                            onChange={this.handleChange}
                            value={this.state.disabledRoomRange}
                        />
                        <p className="addhostellabels">Wrap Around</p>
                        <select
                            className="hosteldetails"
                            name="wrapAround"
                            onChange={this.handleChange}
                            value={this.state.wrapAround}
                        >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                        <p>
                            <input
                                className="hosteldetailssave"
                                type="submit"
                                name="submit"
                                value="Save and Next"
                            />
                        </p>
                    </div>
                </form>
            </div>
        );
    }
}

export default Page1;
