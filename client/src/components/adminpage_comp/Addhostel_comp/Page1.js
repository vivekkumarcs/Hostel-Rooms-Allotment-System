//  hostel details....
import React from "react";
import validateRange from "./errorCheck";
import {
    updateHostelDetails,
    addNewHostel,
} from "../../../utils/backend/admin";

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
            saveAndNext: false,
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
        this.setState(() => ({ saveAndNext: true }));
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
                    // backend call
                    console.log("I am from existing");
                    await updateHostelDetails(this.props.values.id, hostelData);
                }
            } else {
                // backend call
                console.log("I am from new");
                const data = await addNewHostel(hostelData);

                hostelData.id = data.data._id;
            }

            this.props.handleChange(hostelData);
            this.props.nextStep();
        } catch (e) {
            let msg = "";
            if (e.response) {
                const error = e.response;
                if (error.status >= 400 && error.status < 500) {
                    msg = "provided hostel name already exists";
                } else {
                    msg = "Please Try Again Later";
                }
            } else {
                msg =
                    e.message.toLowerCase() === "network error"
                        ? "Please Try Again Later"
                        : e.message;
            }
            this.setState(() => ({ errormessage: msg, saveAndNext: false }));
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
                <h4>Enter Hostel Details</h4>
                <form
                    className="overflowcontrol"
                    onSubmit={this.saveAndContinue}
                >
                    {this.state.errormessage && (
                        <p className="errorshow">{this.state.errormessage}</p>
                    )}
                    <div className="widthsetting">
                        <p className="addhostellabels">
                            Hostel Name<span className="red">*</span>
                        </p>
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
                            Rooms Range<span className="red">*</span> (eg.
                            G1-G8, F1-F5, F7)
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
                                disabled={this.state.saveAndNext}
                            />
                        </p>
                    </div>
                </form>
            </div>
        );
    }
}

export default Page1;
