//date filling
import React from "react";
import axios from "axios";
class Page3 extends React.Component {
    state = {
        errormessage: "",
        submitting: false,
    };
    saveAndContinue = async (e) => {
        e.preventDefault();
        this.setState(() => ({ submitting: true }));
        //validating the date
        const date = e.target.elements.date.value;
        const current = new Date().setHours(0, 0, 0, 0);
        const provided = new Date(date).setHours(0, 0, 0, 0);

        try {
            // if (provided <= current) {
            //     throw new Error("Date must be greater than current Date");
            // }

            // send the date to backend using axios
            const url = `https://hostel-allotment-api.herokuapp.com/admin/${this.props.id}/finalSubmit`;
            const config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("userData"))
                        .token,
                },
            };
            const data = { Date: date };
            await axios.post(url, data, config);
            this.props.nextStep();
        } catch (e) {
            let msg = "Please try again later";
            this.setState(() => ({ errormessage: msg, submitting: false }));
        }
    };
    render() {
        return (
            <div>
                {this.props.newUser ? (
                    <h1 className="heading111">Add New Hostel</h1>
                ) : (
                    <h1 className="heading111">Update Hostel Details</h1>
                )}
                <h3>Scheduling...</h3>
                <div className="overflowcontrol">
                    {" "}
                    <form
                        className="widthsetting"
                        onSubmit={this.saveAndContinue}
                    >
                        <p>
                            <b>
                                {" "}
                                Provide the Date for allotment and final submit
                                for processing.....
                            </b>
                        </p>
                        {this.state.errormessage && (
                            <p className="errorshow">
                                {this.state.errormessage}
                            </p>
                        )}
                        <input
                            className="page3"
                            type="date"
                            name="date"
                            required={true}
                        />
                        <p>
                            <button
                                className="datebuttons"
                                onClick={this.props.prevStep}
                                disabled={this.state.submitting}
                            >
                                Back
                            </button>
                            <input
                                className="datebuttons"
                                type="submit"
                                disabled={this.state.submitting}
                                value={
                                    this.state.submitting
                                        ? "Submitting"
                                        : "Final Submit"
                                }
                            />
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
export default Page3;
