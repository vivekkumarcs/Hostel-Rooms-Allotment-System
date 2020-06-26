import React from "react";
class HelpPage extends React.Component {
    state = {
        value: 1,
    };
    handleValue1 = () => {
        this.setState(() => ({ value: 1 }));
    };
    handleValue2 = () => {
        this.setState(() => ({ value: 2 }));
    };
    handleValue3 = () => {
        this.setState(() => ({ value: 3 }));
    };
    render() {
        return (
            <div className="help0">
                <div className="help01">
                    <div>
                        <button
                            className={
                                this.state.value === 1 ? "help1" : "help2"
                            }
                            onClick={this.handleValue1}
                        >
                            About Us
                        </button>
                    </div>
                    <div>
                        <button
                            className={
                                this.state.value === 2 ? "help1" : "help2"
                            }
                            onClick={this.handleValue2}
                        >
                            Admin Support
                        </button>
                    </div>
                    <div>
                        <button
                            className={
                                this.state.value === 3 ? "help1" : "help2"
                            }
                            onClick={this.handleValue3}
                        >
                            User Support
                        </button>
                    </div>
                </div>
                {this.state.value === 1 ? (
                    <div className="help-content">
                        <h2>
                            <b>About Us</b>
                        </h2>
                        <div className="aboutusinfo">
                            <p>
                                This web app provides a proper user-friendly
                                interface that helps in allotment of rooms to
                                candidates of a hostel. It features all
                                components that make the work of hostel-warden
                                easy and reduced.
                                <br />
                                <br />
                                It has been divided into two sections:Admin and
                                User.
                                <br />
                                <br /> Admin has the authority to create new
                                hostel and provide candidates informations.{" "}
                                <br />
                                On the other side, User is the candidate who can
                                do choice filling of hostel rooms that are to be
                                alloted.
                            </p>
                            <h3>
                                <u>
                                    General features for both Admin and User
                                    are:
                                </u>
                            </h3>
                            <p>
                                a.) Can reset password using forgot password
                                option in login page.
                                <br />
                                b.) Can login using their respective login
                                credentials.
                                <br />
                                c.) Can see latest information about respective
                                hostel in home page's allotment notifications
                                section.
                            </p>

                            <h4>
                                For detailed functionings, please switch to
                                Admin Support or User Support sections.
                            </h4>
                        </div>
                        <div className="contacts">
                            {" "}
                            <h2>Contacts</h2>
                            <p>
                                Email: <i>hostelallotment@bietjhs.ac.in</i>{" "}
                                <br />
                                Phone:{" "}
                                <i>
                                    +919680105260, +918175016618, +917272811262
                                </i>
                            </p>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {this.state.value === 2 ? (
                    <div className="help-content">
                        <div>
                            <h2>
                                <b>Admin Support</b>
                            </h2>
                            <div>
                                Admin is just like the warden of the hostel or
                                the one who controls the whole allotment process
                                by providing allotment related details.
                                <br />
                                <div className="video">
                                    <h3>Admin Guide</h3>
                                    <iframe
                                        src="https://www.youtube.com/embed/h7Z3rF5CzmU"
                                        allowFullScreen={true}
                                    ></iframe>
                                </div>
                                Admin can login using his/her Email_Id(username)
                                and password in login page.
                                <br />
                                Only admin can do sign-up using sign-up page.
                                <br />
                                <h3>
                                    <u>
                                        The step by step features provided to
                                        admin are:
                                    </u>
                                </h3>
                                <div>
                                    <h3>Admin info</h3> Here admin can see
                                    information related to his/her account.
                                    <br />
                                    Admin can also download the pdf file for
                                    declared result of a hostel.
                                </div>
                                <div>
                                    <h3>Adding new hostel</h3>
                                    To add new hostel the admin has to provide
                                    following details
                                    <ul>
                                        <li>hostel name</li>
                                        <li>
                                            each room capacity(i.e. how many
                                            candidates can live in a single
                                            room)
                                        </li>
                                        <li>
                                            room range(it should be in proper
                                            format, e.g.(F1-F10,G12-G14))
                                        </li>
                                        <li>
                                            room range for handicapped
                                            candidates(this field is optional)
                                        </li>
                                        <li>
                                            wrap around(if it is yes then it
                                            means that after all rooms have been
                                            filled according to room capacity,
                                            rooms can be further filled with
                                            remaining candidates.)
                                        </li>
                                        <li>
                                            adding <b>.csv</b> file in proper
                                            format of data of candidates.(it can
                                            be uploaded either during adding new
                                            hostel or in edit hostel option in
                                            current hostels section.
                                        </li>
                                        <li>
                                            scheduling allotment(Providing
                                            allotment date. It must be provided
                                            atleast one day before the allotment
                                            day.)
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3>Currently added hostels</h3>
                                    In this section admin can see the list of
                                    all hostels that he/she has added till now.
                                    <br />
                                    Admin can customize the Show-user list that
                                    includes the data of .csv file.
                                    <br />
                                    Admin can also edit or remove a hostel.(Edit
                                    and remove options will be disabled for a
                                    hostel if the allotment date of that
                                    particular hostel is already scheduled)
                                </div>
                                <div>
                                    <h3>
                                        Upcoming allotment schedules for hostels
                                    </h3>
                                    In this section admin can check and cancel
                                    schedule of any hostel.
                                </div>
                                <div>
                                    <h3>Change password</h3>
                                    Here Admin can change current login
                                    password.
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {this.state.value === 3 ? (
                    <div className="help-content">
                        <div>
                            <h2>
                                <b>User Support</b>
                            </h2>
                            <div>
                                User is the candidate who is supposed to be
                                alloted hostel rooms.
                                <br />
                                <div className="video">
                                    <h3>User Guide</h3>
                                    <iframe
                                        src="https://www.youtube.com/embed/f1gbQjKwx0Y"
                                        allowFullScreen={true}
                                    ></iframe>
                                </div>
                                User can login using the login credentials
                                received on his/her email_Id that has been
                                provided by Admin.
                                <br />
                                <h3>
                                    <u>
                                        The step by step features provided to
                                        user are:
                                    </u>
                                </h3>
                                <div>
                                    <h3> User Info</h3>
                                    admin can see all relavant details like
                                    <ul>
                                        <li>
                                            personal info like name, roll no.,
                                            rank, email.
                                        </li>
                                        <li>allotment date</li>
                                        <li>allotment timings</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3>Add preferences option</h3>
                                    Here User can fill his/her room preferences
                                    <br />
                                    There will be 2 rounds for choice filling:
                                    <ul>
                                        <li>Round-1</li>
                                        Only in this round, room option using
                                        physically handicapped quota will be
                                        enabled.
                                        <br />
                                        <li>Round-2</li>In this round User can
                                        check the status of room vacancies in
                                        vacant rooms list option.
                                    </ul>
                                    Before Submitting, User can see his selected
                                    rooms list in the preference-wise rooms list
                                    section.
                                    <br />
                                    User can submit the preference list as many
                                    times during the time of each round.
                                </div>
                                <div>
                                    <h3>Allotment Status</h3>
                                    Here User can see the status of allotment
                                    results after every round.
                                    <br />
                                    User can apply for the next round here only.
                                    <br />
                                    User can also download the whole hostel
                                    allotment result.
                                </div>
                                <div>
                                    <h3>Change password</h3>
                                    Here User can change his/her current login
                                    password.
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default HelpPage;
