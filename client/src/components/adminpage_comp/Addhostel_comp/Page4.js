// Success msg
import React, { Component } from "react";

class Success extends Component {
  handleredirect = () => {
    this.setState(() => ({ redirect: true }));
  };

  render() {
    return (
      <div className="overflowcontrol">
        <h1 className="added-successfully">Details Successfully Saved</h1>
      </div>
    );
  }
}

export default Success;
