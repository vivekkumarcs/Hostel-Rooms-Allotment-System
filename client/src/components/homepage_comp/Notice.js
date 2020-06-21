import React from "react";
import axios from "axios";

class Notice extends React.Component {
    state = {
        students: [],
    };

    createNoticeElement = () =>
        this.state.students.map((student, index) => (
            <p className="ptag" key={index}>
                {student}
            </p>
        ));

    componentDidMount = async () => {
        try {
            const data = await axios.get("/api/getNotification");
            console.log(data.data);
            const s = [];
            data.data.forEach((d) => {
                let x = "";
                if (d.editable) {
                    x = `${d.name} result is declared`;
                } else {
                    const date = new Date(d.Date).toString();
                    x = `${d.name} allotment scheduled on ${date.slice(0, 15)}`;
                    console.log(new Date(d.Date));
                }
                s.push(x);
            });
            if (s.length === 0) {
                s.push("No notifications to show");
            }
            this.setState((state) => ({
                students: s,
            }));
        } catch (e) {
            console.log(e);
        }
    };
    render() {
        return (
            <div className="notice">
                <p className="h1tag">Allotment Notifications</p>
                <marquee className="marq" direction="up" scrollamount="3">
                    <div>
                        {/* temporary data */}

                        {this.createNoticeElement()}
                    </div>
                </marquee>
            </div>
        );
    }
}

export default Notice;
