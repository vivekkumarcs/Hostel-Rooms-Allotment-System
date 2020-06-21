import React from "react";

export default class YourInfo extends React.Component {
    render() {
        const details = this.props.User;
        return (
            <div>
                <h1 className="heading111">User Information </h1>
                <div className="userinfoflex">
                    <div className="overflowcontrol">
                        <div className="spacing">
                            <h4>Hello {details.name}</h4>
                            <p>Your Email : {details.email}</p>
                            <p>Your Rank : {details.rank}</p>
                            <p>your room allotment is under process</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
// <h1 className="heading111">User Info </h1>
// <div className="userinfoflex">
//     <div className="overflowcontrol">

//     </div>
// </div>