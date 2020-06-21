import React from "react";
import Page1 from "./Addhostel_comp/Page1";
import Page2 from "./Addhostel_comp/Page2";
import Page3 from "./Addhostel_comp/Page3";
import Page4 from "./Addhostel_comp/Page4";

class Addhostel extends React.Component {
    UNSAFE_componentWillMount = () => {
        //console.log("from componentDidMount");
        if (this.props.existing) {
            //console.log(this.props.existing);
            this.setState(() => ({
                step: 1,
                hostelName: this.props.existing.name,
                roomCapacity: this.props.existing.capacity,
                roomRange: this.props.existing.roomRange,
                disabledRoomRange: this.props.existing.disabledRoomRange,
                wrapAround: this.props.existing.wrapAround,
                uploaded: this.props.existing.uploaded,
                saved: true,
                id: this.props.existing._id,
                newUser: false,
            }));
        } else {
            this.setState(() => ({
                step: 1,
                hostelName: "",
                roomCapacity: "1",
                roomRange: "",
                disabledRoomRange: "",
                wrapAround: true,
                uploaded: false,
                saved: false,
                newUser: true,
                id: null,
            }));
        }
    };
    UNSAFE_componentWillReceiveProps = (props) => {
        // console.log("from componentWillReceiveProps");
        // console.log(props);
        if (!props.existing) {
            this.setState(() => ({
                step: 1,
                hostelName: "",
                roomCapacity: "1",
                roomRange: "",
                disabledRoomRange: "",
                wrapAround: true,
                uploaded: false,
                saved: false,
                newUser: true,
                id: null,
            }));
        }
    };
    nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1,
        });
    };
    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1,
        });
    };
    handleChange = (hostelData) => {
        hostelData.saved = true;
        this.setState(() => hostelData);
    };

    uploaded = () => {
        this.setState(() => ({ uploaded: true }));
    };

    render() {
        switch (this.state.step) {
            case 1:
                return (
                    <Page1
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        values={this.state}
                    />
                );
            case 2:
                return (
                    <Page2
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        upload={this.uploaded}
                        uploaded={this.state.uploaded}
                        id={this.state.id}
                        newUser={this.state.newUser}
                    />
                );
            case 3:
                return (
                    <Page3
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        id={this.state.id}
                        newUser={this.state.newUser}
                    />
                );
            default:
                return <Page4 />;
        }
    }
}
export default Addhostel;
