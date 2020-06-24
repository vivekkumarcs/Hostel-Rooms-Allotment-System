import React from "react";
import axios from "axios";
//we need last round so we dont show go to the next round

export default class AllotmentResult extends React.Component {
    state = {
        round: 1,
        editable: false,
        result: "G21",
        applied: false,
        error: "",
        color: "",
    };
    componentDidMount = () => {
        this.setState(() => ({
            round: this.props.User.round,
            editable: this.props.User.editable,
            result: this.props.User.result,
            error:
                this.props.User.round === 1 &&
                !this.props.User.editable &&
                this.props.User.nextRound
                    ? "You have already applied for next round"
                    : "",
        }));
    };

    handleChange = (e) => {
        this.setState((prevState) => ({ applied: !prevState.applied }));
    };
    applyForNextRound = async (e) => {
        e.preventDefault();
        try {
            const url = "https://hostel-allotment-api.herokuapp.com/user/apply";
            const config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("userData"))
                        .token,
                },
            };
            !this.props.User.nextRound && (await axios.get(url, config));
            this.setState(() => ({
                error: "you have successfully applied for next Round",
                color: "green",
                applied: false,
            }));
            this.props.appliedForNextRound();
        } catch (e) {
            this.setState(() => ({
                error: "Please try again later",
                color: "red",
                applied: false,
            }));
        }
    };

    handleShowForm = () => {
        return (
            <div>
                <p>
                    Your have been alloted room{" "}
                    <span className="bold-room">{this.state.result}</span>
                </p>
                {this.state.error && (
                    <p
                        className="greenShow"
                        style={{ color: this.state.color }}
                    >
                        {this.state.error}
                    </p>
                )}
                {this.state.round === 1 && (
                    <form onSubmit={this.applyForNextRound}>
                        <label>
                            <input
                                type="checkbox"
                                htmlFor="wantround"
                                name="wantround"
                                onChange={this.handleChange}
                                checked={this.state.applied}
                                style={{
                                    width: "17px",
                                    height: "17px",
                                    margin: "0px 10px 0px 0px",
                                }}
                            />
                            <span id="wantroom">Apply for Round-2</span>
                        </label>
                        <div>
                            <input
                                type="submit"
                                value="Apply"
                                disabled={!this.state.applied}
                                className="csvbuttons"
                            />
                        </div>
                        <p>
                            <b>Note:</b> If you apply for next round, then you
                            will loose the room currently allocated to you.
                        </p>
                    </form>
                )}
            </div>
        );
    };

    handleShow = () => {
        if (this.state.round === 0) {
            return <p>Allotment Process hasn't started yet.</p>;
        }

        if (this.state.editable) {
            return (
                <p>
                    Please add your Room Preferences in Add Preferences Section
                    for Round-{this.state.round}
                </p>
            );
        }

        if (this.state.result === null) {
            return (
                <p>
                    Round {this.state.round} result will be declared at{" "}
                    {this.state.round === 1 ? "11:30 AM" : "3:30 PM"}
                </p>
            );
        }

        if (this.state.result === "") {
            return (
                <p>
                    You have not got any room in round-
                    {this.state.round !== 3 ? this.state.round : 2}.{" "}
                    {this.state.round === 1 &&
                        "You will now automatically be promoted to round-2."}
                </p>
            );
        }

        if (this.state.result.length > 0) {
            return this.handleShowForm();
        }
    };

    render() {
        return (
            <div className="AllotmentResult">
                <h1 className="heading111">Allotment Status</h1>
                <div className="LargeSize" style={{ textAlign: "center" }}>
                    {this.handleShow()}
                </div>
                {/* <p style={{ textAlign: "center" }}>
                    To download PDF of result{" "}
                    <button className="csvbuttons">Click here</button>
                </p> */}
            </div>
        );
    }
}
