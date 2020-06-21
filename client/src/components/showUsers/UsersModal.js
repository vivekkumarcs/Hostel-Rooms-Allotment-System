import React from "react";
import Modal from "react-modal";

export default class UserModal extends React.Component {
    state = {
        error: "",
        open: true,
        submitting: false,
    };
    submitted = async (e) => {
        e.preventDefault();
        this.setState(() => ({ submitting: true }));
        const name = e.target.elements.name.value.trim().toLowerCase();
        const email = e.target.elements.email.value.trim().toLowerCase();
        const rank = parseInt(e.target.elements.rank.value);
        const disabled = e.target.elements.disabled.value === "yes";
        console.log(this.props.User);
        const pName = this.props.User.name;
        const pEmail = this.props.User.email;
        const pRank = this.props.User.rank;
        const pDisabled = this.props.User.disabled;

        let changed = false;
        const updates = {};

        if (pName !== name) {
            changed = true;
            updates.name = name;
        }
        if (pEmail !== email) {
            changed = true;
            updates.reset = true;
            updates.email = email;
        }
        if (pRank !== rank) {
            changed = true;
            updates.rank = rank;
        }
        if (pDisabled !== disabled) {
            changed = true;
            updates.disabled = disabled;
        }
        if (changed) {
            const done = await this.props.submitted(updates);
            if (done) {
                this.close();
            } else {
                this.setState(() => ({
                    error: "Please Try Again Later",
                }));
            }
        } else {
            this.setState(() => ({
                error: "please Update Details befor submit",
            }));
        }
        this.setState(() => ({ submitting: false }));
    };
    close = () => {
        this.setState(() => ({ open: false }));
        this.props.closeModal();
    };

    render() {
        return (
            <Modal
                isOpen={this.state.open}
                overlayClassName="userModalOverlay"
                className="UserModalWrapper"
                ariaHideApp={false}
            >
                <button className="UMclose" onClick={this.close}>
                    X
                </button>
                <h1>Update Details</h1>
                {this.state.error && (
                    <p className="errorshow">{this.state.error}</p>
                )}
                <form onSubmit={this.submitted}>
                    <div className="Minput">
                        <label>
                            <span className="LABEL">Name</span>
                            <input
                                type="text"
                                name="name"
                                className="UMbox"
                                required={true}
                                maxLength="50"
                                defaultValue={this.props.User.name}
                            />
                        </label>
                    </div>
                    <div className="Minput">
                        <label>
                            <span className="LABEL">Email</span>
                            <input
                                type="email"
                                name="email"
                                className="UMbox"
                                required={true}
                                maxLength="50"
                                defaultValue={this.props.User.email}
                            />
                        </label>
                    </div>
                    <div className="Minput">
                        <label>
                            <span className="LABEL">Rank</span>
                            <input
                                type="number"
                                name="rank"
                                className="UMbox"
                                min="1"
                                required={true}
                                defaultValue={this.props.User.rank}
                            />
                        </label>
                    </div>
                    <div className="Minput">
                        <label>
                            <span className="LABEL">Disabled</span>
                            <select
                                className="UMselect"
                                name="disabled"
                                defaultValue={
                                    this.props.User.disabled ? "yes" : "no"
                                }
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <input
                            type="submit"
                            name="submit"
                            value="Submit"
                            disabled={this.state.submitting}
                            className="UMsubmit"
                        />
                    </div>
                </form>
            </Modal>
        );
    }
}
