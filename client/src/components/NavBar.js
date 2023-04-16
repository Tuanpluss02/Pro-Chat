import React from "react";
import { NavLink } from "react-router-dom";

class NavBar extends React.Component {
  render() {
    return (
      <div
        className="px-5 py-3 bg-blue-500 flex flex-row justify-start"
      >
        <div className="px-2">
          <NavLink
            className="text-white no-underline"
            to="/"
          >
            Home
          </NavLink>
        </div>
        <div className="px-2">
          <NavLink
            className="text-white no-underline"
            to="/profile"
          >
            Profile
          </NavLink>
        </div>
      </div>
    );
  }
}
export default NavBar;

