import React from "react";
import { Redirect } from "react-router-dom";
import NavBar from "./NavBar";

class ProtectedRoute extends React.Component {
  render() {
    const Component = this.props.page;
    const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? (
      <div className="flex w-screen">
        <div className="flex-none w-16">
          <NavBar />
        </div>
        <div className="flex-auto w-3/5">
          <Component />
        </div>
        <div className="flex-auto w-2/5">
          <h1>Members</h1>
        </div>
      </div>
    ) : (
      <Redirect to="/login" />
    );
  }
}

export default ProtectedRoute;