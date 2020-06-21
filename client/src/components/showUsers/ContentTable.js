import React from "react";
import axios from "axios";
import UserModal from "./UsersModal";

class ContentTable extends React.Component {
    state = {
        open: false,
    };
    openModal = (index) => {
        this.setState(() => ({ open: true, index: index }));
    };
    closeModal = () => {
        this.setState(() => ({ open: false }));
    };
    submitted = async (details) => {
        console.log(details);
        try {
            const User = this.props.Users[this.state.index];
            const url = `/api/admin/${User.hostelid}/${User._id}`;
            const config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("userData"))
                        .token,
                },
            };
            await axios.patch(url, details, config);
            return true;
        } catch (e) {
            return false;
        }
    };
    render() {
        return (
            <div>
                {this.state.open && (
                    <UserModal
                        User={this.props.Users[this.state.index]}
                        closeModal={this.closeModal}
                        submitted={this.submitted}
                    />
                )}
                <table id="userTable">
                    <thead>
                        <tr>
                            <th>RollNo</th>
                            <th>Name</th>
                            <th id="showmail">Email</th>
                            <th>Rank</th>
                            <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.Users.map((User, index) => (
                            <tr
                                key={index}
                                className={
                                    User.disabled ? "disabled" : "notDisabled"
                                }
                            >
                                <td>{User.rollNo}</td>
                                <td>{User.name}</td>
                                <td id="showmail">{User.email}</td>
                                <td>{User.rank}</td>
                                <td>
                                    <button
                                        disabled={this.props.disabled}
                                        onClick={(e) => this.openModal(index)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default ContentTable;
