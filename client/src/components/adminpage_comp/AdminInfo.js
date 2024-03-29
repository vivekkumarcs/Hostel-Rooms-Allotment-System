import React from "react";
import { downloadCheck } from "../../utils/backend/other";
export default class AdminInfo extends React.Component {
    state = {
        variable: 1,
        error: "",
    };

    handleinfo = () => {
        this.setState(() => ({ variable: 1 }));
    };

    handleresult = () => {
        this.setState(() => ({ variable: 2 }));
    };

    handleDownload = async (hostelName) => {
        try {
            // backend call
            const data = await downloadCheck(hostelName);

            if (data.data.present) {
                const link = document.createElement("a");
                link.href = `/api/admin/result?hostelName=${hostelName}`;
                link.download = `${hostelName}-result.pdf`;
                link.click();
            } else {
                throw new Error();
            }
            this.setState(() => ({ error: "" }));
        } catch (e) {
            this.setState(() => ({ error: "!! Please refresh the page" }));
        }
    };

    downloadList = (inbox) => {
        return inbox.map((hostelName, index) => (
            <div className="pdfflex" key={index}>
                <div>
                    {" "}
                    <p className="pdflist">
                        Download result of <b>{hostelName}</b>
                    </p>
                </div>
                <div>
                    {" "}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            this.handleDownload(hostelName);
                        }}
                    >
                        download
                    </button>
                </div>
            </div>
        ));
    };
    render() {
        return (
            <div>
                <h1 className="heading111">Admin Info </h1>
                <div className="userinfoflex">
                    <div>
                        <button
                            className={
                                this.state.variable === 1
                                    ? "userinfoflex3"
                                    : "userinfoflex2"
                            }
                            onClick={this.handleinfo}
                        >
                            Your Info
                        </button>
                        <button
                            className={
                                this.state.variable === 2
                                    ? "userinfoflex3"
                                    : "userinfoflex2"
                            }
                            onClick={this.handleresult}
                        >
                            Download Results
                        </button>
                    </div>
                    <div className="overflowcontrol">
                        <div className="bring-middle">
                            {this.state.variable === 1
                                ? yourinfo(this.props.User)
                                : ""}
                            {this.state.variable === 2 && (
                                <div>
                                    <h3>
                                        Download PDF file of Declared Results...
                                    </h3>
                                    {this.state.error && (
                                        <p className="errorshow">
                                            {this.state.error}
                                        </p>
                                    )}
                                    {this.props.User.inbox.length === 0 ? (
                                        <p>Currently no results declared.</p>
                                    ) : (
                                        <div>
                                            {this.downloadList(
                                                this.props.User.inbox
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const yourinfo = (User) => {
    return (
        <div className="spacing">
            <h4>Welcome back {User.name}</h4>
            <p>
                Your Email: <b>{User.email}</b>
            </p>
            <p>Your room allotment is under process.</p>
        </div>
    );
};
