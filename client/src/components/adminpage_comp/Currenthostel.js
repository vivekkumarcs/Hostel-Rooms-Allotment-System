import React from "react";
import Modal from "react-modal";
import ModalLoad from "../LoadingModal.js";
import { getHostels, deleteHostel } from "../../utils/backend/admin.js";

class Currenthostel extends React.Component {
    state = {
        hostels: [],
        selectedOptionName: undefined,
        selectedOptionId: undefined,
        modalshow: undefined,
    };

    componentDidMount = async () => {
        this.setState(() => ({ modalshow: true }));
        try {
            // backend call
            const Hostels = await getHostels();

            this.setState(() => ({ hostels: Hostels.data }));
        } catch (e) {}
        this.setState(() => ({ modalshow: undefined }));
    };

    handleSelected = (name, id) => {
        this.setState(() => ({
            selectedOptionName: name,
            selectedOptionId: id,
        }));
    };

    handleRemove = async (e) => {
        try {
            if (e.target.id === "yes") {
                // backend call
                await deleteHostel(this.state.selectedOptionId);

                this.setState((prevState) => ({
                    hostels: prevState.hostels.filter(
                        (hostel) => hostel._id !== this.state.selectedOptionId
                    ),
                }));
            }
            this.setState(() => ({
                selectedOptionName: undefined,
                selectedOptionId: undefined,
            }));
        } catch (er) {}
    };

    handleEdit = (e) => {
        const hostelDetail = this.state.hostels.find(
            (hostel) => hostel._id === e.target.id
        );
        this.props.edithostel(hostelDetail);
    };
    render() {
        return (
            <div>
                {this.state.modalshow && <ModalLoad />}
                <h1 className="heading111">Hostels List </h1>
                <p>
                    Here you can delete, modify and schedule allotments for
                    current hostels
                </p>
                <div className="overflowcontrol">
                    {this.state.hostels.length === 0 && (
                        <p className="errorshow emptyUpcoming">
                            No Hostels added yet!
                        </p>
                    )}

                    <div className="divcurrenthostels">
                        {this.state.hostels.map((hostel, index) => (
                            <div key={index}>
                                <div className="currenthostels">
                                    <div className="hostelnamesflex">
                                        <div>{index + 1}.</div>
                                        <div>{hostel.name}</div>
                                    </div>
                                    <div className="fixedbuttons">
                                        <button
                                            className="removebutton"
                                            onClick={(e) =>
                                                this.props.showUsers(hostel)
                                            }
                                        >
                                            Show Users
                                        </button>
                                        <button
                                            className="removebutton"
                                            id={hostel._id}
                                            onClick={this.handleEdit}
                                            disabled={!hostel.editable}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="removebutton"
                                            disabled={!hostel.editable}
                                            onClick={(e) =>
                                                this.handleSelected(
                                                    hostel.name,
                                                    hostel._id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Modal
                        ariaHideApp={false}
                        isOpen={!!this.state.selectedOptionId}
                        contentLabel="selected"
                        className="modal"
                    >
                        <h4>
                            Are you sure to remove{" "}
                            {this.state.selectedOptionName}
                        </h4>

                        <div className="yesno-space">
                            <button
                                className="modalbutton"
                                id="yes"
                                onClick={this.handleRemove}
                            >
                                Yes
                            </button>
                            <button
                                className="modalbutton"
                                id="no"
                                onClick={this.handleRemove}
                            >
                                No
                            </button>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Currenthostel;
