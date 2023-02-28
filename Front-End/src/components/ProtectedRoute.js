import React from "react";
import { Redirect } from "react-router-dom";

class ProtectedRoute extends React.Component {
  render() {
    const Component = this.props.page;
    const isAuthenticated = localStorage.getItem("token");
    return isAuthenticated ? <Component /> : <Redirect to="/login" />;
  }
}

export default ProtectedRoute;
