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
            const url = "https://hostel-allotment-api.herokuapp.com/user/apply";
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

    handleShowForm = () => {
        return (
            <div>
                <p>
                    Your have been alloted room{" "}
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
        )
    }

    handleShow = () => {
        if (this.state.round === 0 && !this.state.result && !this.state.editable) {//round:0 result : null
            return <p>Allotment Process hasn't started yet.</p>;                     //editable:false
        }

        if (this.state.round === 1 && !this.state.result && this.state.editable) {
            return <p>Please add your Room Preferences in Add Preferences Section for Round-1</p>
        }

        if (this.state.round === 1 && !this.state.result && !this.state.editable) {
            return <p>Round 1 result will decleared at 11:30 PM</p>
        }

        if (this.state.round === 1 && this.state.result === "" && !this.state.editable) {
            return <p>You have not got the room so you are going to Round 2</p>
        }

        if (this.state.round === 1 && this.state.result.length > 0 && !this.state.editable) {
            return this.handleShowForm();
        }

        if (this.state.round === 1 && this.state.result.length > 0 && !this.state.editable) {
            return this.handleShowForm();
        }

        if (this.state.round === 2 && !this.state.result && this.state.editable) {
            return <p>Please add your Room Preferences in Add Preferences Section for Round-2</p>;
        }

        if (this.state.round === 2 && !this.state.result && !this.state.editable) {
            return <p>Result of Round-2 will be decleared at 3:30 PM</p>;
        }

        if (this.state.round === 2 && this.state.result === "" && !this.state.editable) {
            return <p>You have not got the room</p>;
        }

        if (this.state.round === 2 && this.state.result > 0 && !this.state.editable) {
            return (
                <p>
                    Your have been alloted room{" "}
                    <span className="bold-room">
                        {this.state.result}
                    </span>
                </p>
            )
        }

        if (this.state.round === 3 && !this.state.result && !this.state.editable) {
            return <p>Show link for Download PDF</p>;
        }

        if (this.state.round === 3 && this.state.result > 0 && !this.state.editable) {
            return <p>Show link for Download PDF</p>;
        }

        if (this.state.round === 4 && this.state.result > 0 && !this.state.editable) {
            return (
                <div>
                    <p>
                        Your have been alloted room{" "}
                        <span className="bold-room">
                            {this.state.result}
                        </span>

                    </p>
                    {/*<p>Got something for Round 1 and Not applied for next round</p>;*/}
                </div>
            )
        }







    }


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
                <div className="LargeSize">
                    {this.handleShow()}
                </div>
                {/* round 2 and editable false the show the link to download result */}
            </div>
        );
    }
}
