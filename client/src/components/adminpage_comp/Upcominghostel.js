import React from "react";
import axios from "axios";
import Modal from "react-modal";
import ModalLoad from "../LoadingModal.js";

class Upcomingevents extends React.Component {
    state = {
        hostels: [],
        selectedOptionId: undefined,
        selectedOptionName: undefined,
        modalshow: undefined,
    };
    componentDidMount = async () => {
        this.setState(() => ({ modalshow: true }));
        try {
            const url =
                "https://hostel-allotment-api.herokuapp.com/admin/hostels?final=true";
            const config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("userData"))
                        .token,
                },
            };

            const data = await axios.get(url, config);

            this.setState(() => ({ hostels: data.data }));
        } catch (e) {
            // handle error if something went wrong
        }
        this.setState(() => ({ modalshow: undefined }));
    };
    handleDeleteOption = async (e) => {
        try {
            if (e.target.id === "yes") {
                const url = `https://hostel-allotment-api.herokuapp.com/admin/${this.state.selectedOptionId}/discard`;
                const config = {
                    headers: {
                        Authorization: JSON.parse(
                            localStorage.getItem("userData")
                        ).token,
                    },
                };
                await axios.get(url, config);
                this.setState((prevState) => ({
                    hostels: prevState.hostels.filter(
                        (hostel) => hostel._id !== this.state.selectedOptionId
                    ),
                }));
            }
        } catch (e) {
            // handle error if something went wrong
        }
        this.setState(() => ({
            selectedOptionId: undefined,
            selectedOptionName: undefined,
        }));
    };
    handleSelected = (name, id) => {
        this.setState(() => ({
            selectedOptionId: id,
            selectedOptionName: name,
        }));
    };
    getDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };
    todaysDate = (provided) => {
        return provided === new Date().setHours(0, 0, 0, 0);
    };
    render() {
        return (
            <div>
                {this.state.modalshow && <ModalLoad />}
                <h1 className="heading111">Upcoimg Allotments </h1>
                <p>Here you can cancel the scheduled allotments of hostels.</p>
                <div className="overflowcontrol">
                    {this.state.hostels.length === 0 && (
                        <p className="errorshow emptyUpcoming">
                            ! No Upcoming Allotments
                        </p>
                    )}

                    <div className="divcurrenthostels">
                        {this.state.hostels.map((hostel, index) => (
                            <div key={index}>
                                <div className="currenthostels">
                                    <div>
                                        <div style={{ textAlign: "center" }}>
                                            <b>{hostel.name}</b>
                                        </div>
                                        <p style={{ textAlign: "center" }}>
                                            <i>
                                                Allotment will be conducted on{" "}
                                                {this.getDate(hostel.Date)}
                                            </i>
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            className="removebutton"
                                            disabled={this.todaysDate(
                                                hostel.Date
                                            )}
                                            onClick={(e) => {
                                                this.handleSelected(
                                                    hostel.name,
                                                    hostel._id
                                                );
                                            }}
                                        >
                                            Cancel Allotment
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
                            Are you sure to cancel allotment of{" "}
                            {this.state.selectedOptionName}
                        </h4>

                        <div className="yesno-space">
                            <button
                                className="modalbutton"
                                id="yes"
                                onClick={this.handleDeleteOption}
                            >
                                Yes
                            </button>
                            <button
                                className="modalbutton"
                                id="no"
                                onClick={this.handleDeleteOption}
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

export default Upcomingevents;
