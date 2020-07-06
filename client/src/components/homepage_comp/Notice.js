import React from "react";
import { getNotification } from "../../utils/backend/other";

class Notice extends React.Component {
    state = {
        students: ["No notifications to show"],
    };

    createNoticeElement = () =>
        this.state.students.map((student, index) => (
            <p className="ptag" key={index}>
                {student}
            </p>
        ));

    componentDidMount = async () => {
        try {
            const data = await getNotification();
            const s = [];
            data.data.forEach((d) => {
                let x = "";
                if (d.editable) {
                    x = `${d.name} result has been declared`;
                } else {
                    const date = new Date(d.Date).toDateString();
                    x = `${d.name} allotment is scheduled on ${date}`;
                }
                s.push(x);
            });
            s.length > 0 && this.setState(() => ({ students: s }));
        } catch (e) {}
    };
    render() {
        return (
            <div className="notice">
                <p className="h1tag">Allotment Notifications</p>
                <marquee className="marq" direction="up" scrollamount="3">
                    <div>{this.createNoticeElement()}</div>
                </marquee>
            </div>
        );
    }
}

export default Notice;
