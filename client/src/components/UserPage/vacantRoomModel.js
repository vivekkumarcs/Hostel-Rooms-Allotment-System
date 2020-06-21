import React from "react";
import Modal from "react-modal";
import Select from "react-select";

export default class OptionModal extends React.Component {
    state = {
        vacantRooms: this.props.vacantRooms,
        value: {
            value: 0,
            label: this.props.vacantRooms[0].prefix,
        },
    };

    changeSelect = (value) => {
        this.setState(() => ({ value: value }));
    };
    render() {
        //console.log(this.props.vacantRooms)
        return (
            <div className="parentOfModelVacant">
                <Modal
                    isOpen={!!this.props.openVacantModal}
                    onRequestClose={this.props.changeVacantModel}
                    ariaHideApp={false}
                    className="model-size-vacantroom1"
                >
                    <div className="non-moveable-header">
                        {/*Header of Model */}
                        <div className="h2vacant">Vacant Rooms</div>

                        <div>
                            <button
                                className="vacantRoomModelButton"
                                onClick={this.props.changeVacantModel}
                            >
                                x
                            </button>
                        </div>
                    </div>
                    <div className="Spacing"></div>
                    <div className="vacantRoomModel">
                        {/*body of Model*/}
                        <h3
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Select Floor...
                        </h3>
                        <div className="fixedSelect">
                            <Select
                                className="selectroom1"
                                name="roomNo"
                                menuPlacement="bottom"
                                // menuPosition="fixed"
                                isSearchable={false}
                                onChange={this.changeSelect}
                                value={this.state.value}
                                placeholder="Select Room"
                                options={this.state.vacantRooms.map(
                                    (detail, index) => ({
                                        value: index,
                                        label: detail.prefix,
                                    })
                                )}
                            />
                        </div>

                        {/* this is main content which render*/}
                        {
                            <div className="margin-selectbar">
                                {
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="tr1">Room No</th>
                                                <th className="tr2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.vacantRooms[
                                                this.state.value.value
                                            ].rooms.map((room, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="td1">
                                                            {" " +
                                                                room[0] +
                                                                " "}{" "}
                                                        </td>
                                                        <td className="td2">
                                                            {" " +
                                                                room[1] +
                                                                " "}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        }
                    </div>
                </Modal>
            </div>
        );
    }
}
