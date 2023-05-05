import React from "react";
import { NavLink } from "react-router-dom";

class NavBar extends React.Component {
  render() {
    return (
      <div className="px-5 py-8 h-screen w-16 flex flex-col items-center space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700">
        <div>
          <NavLink to="#">
            <svg className="w-6 h-6" viewBox="0 0 0.6 0.6" fill="#9ca3af">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M0.3 0.48 0 0.16h0.6l-0.3 0.32Z"
              />
            </svg>
          </NavLink>
        </div>
        <div className="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
          <NavLink to="/">
            <svg fill="#9ca3af" className="w-8 h-8" viewBox="0 0 0.72 0.72">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M0.36 0.09s-0.186 0.16 -0.289 0.247A0.031 0.031 0 0 0 0.06 0.36a0.03 0.03 0 0 0 0.03 0.03h0.06v0.21a0.03 0.03 0 0 0 0.03 0.03h0.09a0.03 0.03 0 0 0 0.03 -0.03v-0.12h0.12v0.12a0.03 0.03 0 0 0 0.03 0.03h0.09a0.03 0.03 0 0 0 0.03 -0.03v-0.21h0.06a0.03 0.03 0 0 0 0.03 -0.03 0.029 0.029 0 0 0 -0.011 -0.023C0.546 0.25 0.36 0.09 0.36 0.09z"
              />
            </svg>
          </NavLink>
        </div>
        <div className="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
          <NavLink to="/profile">
            <svg fill="#9ca3af" className="w-6 h-6" viewBox="0 0 0.96 0.96">
              <title />
              <path d="M0.677 0.496a0.298 0.298 0 0 1 -0.394 0A0.45 0.45 0 0 0 0.03 0.9a0.03 0.03 0 0 0 0.03 0.03h0.84a0.03 0.03 0 0 0 0.03 -0.03 0.45 0.45 0 0 0 -0.253 -0.404Z" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M0.72 0.27A0.24 0.24 0 0 1 0.48 0.51A0.24 0.24 0 0 1 0.24 0.27A0.24 0.24 0 0 1 0.72 0.27z"
              />
            </svg>
          </NavLink>
        </div>
      </div>
    );
  }
}
export default NavBar;
