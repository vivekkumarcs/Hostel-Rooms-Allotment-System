import React from "react";

export default class YourInfo extends React.Component {
    render() {
        const details = this.props.User;
        return (
            <div>
                <h1 className="heading111">User Information </h1>
                <div className="overflowcontrol">
                    <div className="center-Box">
                        <div className="main-contentBox">
                            <p>
                                <span className="bold-Heading">Name : </span>
                                <span className="bold-Heading2">
                                    {details.name.toUpperCase()}
                                </span>
                            </p>
                            <p>
                                <span className="bold-Heading">Roll No : </span>
                                <span className="bold-Heading2">
                                    {details.rollNo}
                                </span>
                            </p>
                            <p>
                                <span className="bold-Heading">Email : </span>
                                {details.email}
                            </p>
                            <p>
                                <span className="bold-Heading">Rank : </span>
                                {details.rank}
                            </p>
                            <p>
                                <span className="bold-Heading">Hostel : </span>
                                {details.hostelName.toUpperCase()}
                            </p>
                            {details.Date && (
                                <p>
                                    <span className="bold-Heading">
                                        Allotment Schedule :
                                    </span>{" "}
                                    {new Date(
                                        details.Date
                                    ).toLocaleDateString()}
                                </p>
                            )}
                            {details.Date && (
                                <div>
                                    <p className="bold-Heading3">Timings : </p>
                                    <p className="margin-Left">
                                        <span className="bold-Heading">
                                            Round-1 :{" "}
                                        </span>
                                        8:00 AM (3:00 hours){" "}
                                    </p>
                                    <p className="margin-Left">
                                        <span className="bold-Heading">
                                            Round-2 :{" "}
                                        </span>
                                        1:00 PM (2:00 hours){" "}
                                    </p>
                                    <p className="bold-Heading3">
                                        Result Declare :
                                    </p>
                                    <p className="margin-Left">
                                        <span className="bold-Heading">
                                            Round-1:{" "}
                                        </span>
                                        11:30AM
                                    </p>
                                    <p className="margin-Left">
                                        <span className="bold-Heading">
                                            Round-2:{" "}
                                        </span>
                                        03:30PM
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    {details.Date && (
                        <p className="Note-Part">
                            If you are not satisfied with your room after
                            Round-1, you can further apply (Duration: 30 min)
                            for Round 2 in Allotment Status Section.
                        </p>
                    )}
                </div>
            </div>
        );
    }
}
