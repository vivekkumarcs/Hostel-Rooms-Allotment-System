import React from "react";
import Notice from "./homepage_comp/Notice";

class Homepage extends React.Component {
  render() {
    return (
      <div className="homeflex">
        <div className="home-cotent-1">
          <h3>Welcome to hostel rooms allocation system</h3>
          <p>
            (To get started, please login with your existing credentials or you
            may signup as a new admin...)
          </p>
          <p>
            (To know more about how this web-app works please refer to support
            page...)
          </p>
        </div>
        <div className="home-content-2">
          <Notice />
        </div>
      </div>
    );
  }
}

export default Homepage;
