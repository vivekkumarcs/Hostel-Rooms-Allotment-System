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
            result: this.props.User.result ? this.props.User.result : "",
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
        this.setState(() => ({}));

        try {
            if (this.props.User.nextRound) throw new Error();
            const url = "/api/user/apply";
            const config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("userData"))
                        .token,
                },
            };
            await axios.get(url, config);
            this.setState(() => ({
                error: "you have successfully applied for next Round",
                color: "green",
            }));
            this.props.appliedForNextRound();
        } catch (e) {
            this.setState(() => ({
                error: this.props.User.nextRound
                    ? "You have already applied for next round."
                    : "please try again later",
                color: "red",
            }));
        }
    };

    handleShow = () => {
        if (this.state.editable) {
            return <p>Allotment is going on</p>;
        } else {
            if (this.state.round === 0) {
                return <p>Allotment is not yet started</p>;
            } else {
                if (this.state.result.length === 0) {
                    return <p>No room is alloted to you</p>;
                } else if (this.state.result === null) {
                    return <p>Result is not yet declared</p>;
                } else {
                    return (
                        <div>
                            <p>
                                Your have alloted room{" "}
                                <span className="bold-room">
                                    {this.state.result}
                                </span>
                            </p>
                            {this.state.round === 1 && (
                                <form onSubmit={this.applyForNextRound}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            htmlFor="wantround"
                                            name="wantround"
                                            onChange={this.handleChange}
                                            checked={this.state.applied}
                                        />
                                        <span id="wantroom">
                                            Apply for Round-2
                                        </span>
                                    </label>
                                    <div>
                                        <input
                                            type="submit"
                                            value="Apply"
                                            disabled={!this.state.applied}
                                            className="Apply-button"
                                        />
                                    </div>
                                    <p>
                                        <b style={{ color: "red" }}>Caution:</b>{" "}
                                        If you apply for next round, then you
                                        will loose the room currently allocated
                                        to you.
                                    </p>
                                </form>
                            )}
                        </div>
                    );
                }
            }
        }
    };

    render() {
        //console.log(this.state.error);
        return (
            <div className="AllotmentResult">
                <h1 className="heading111">Your Room Status</h1>
                {this.state.error && (
                    <p
                        className={
                            this.state.color === "red"
                                ? "errorshow"
                                : "greenShow"
                        }
                    >
                        {this.state.error}
                    </p>
                )}
                {this.handleShow()}
                {/* round 2 and editable false the show the link to download result */}
            </div>
        );
    }
}
