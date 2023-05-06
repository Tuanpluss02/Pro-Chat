import React from "react";
import { Redirect } from "react-router-dom";
import NavBar from "./NavBar";

class ProtectedRoute extends React.Component {
  render() {
    const Component = this.props.page;
    const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? (
      <div className="flex flex-row">
        <NavBar />
        <Component />
      </div>
    ) : (
      <Redirect to="/login" />
    );
  }
}

export default ProtectedRoute;