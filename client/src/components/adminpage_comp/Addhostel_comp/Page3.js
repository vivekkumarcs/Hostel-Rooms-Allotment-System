//date filling
import React from "react";
import { finalSubmit } from "../../../utils/backend/admin";
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

            const data = { Date: date };

            // backend call
            await finalSubmit(this.props.id, data);

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
