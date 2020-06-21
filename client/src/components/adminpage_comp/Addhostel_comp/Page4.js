// Success msg
import React, { Component } from "react";

class Success extends Component {
  handleredirect = () => {
    this.setState(() => ({ redirect: true }));
  };

  render() {
    return (
      <div className="widthsetting">
        <h1 className="overflowcontrol">Details Successfully Saved</h1>
      </div>
    );
  }
}

export default Success;
