import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 80px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  position: fixed;
  top: 0;
  left: 0;
`;

const NavItem = styled.div`
  padding: 10px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    color: #333;
    background-color: #eee;
  }
`;

const NavIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: #999;
  margin-right: 10px;
`;

const NavBar = () => {
  return (
    <NavWrapper>
      <NavItem>
        <NavLink to="#">
          <NavIcon viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </NavIcon>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/">
          <NavIcon viewBox="0 0 24 24">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm5 13.5l-4.5-4.5-3 3-1.5-1.5 4.5-4.5 1.5 1.5 3-3 1.5 1.5-4.5 4.5z"></path>
          </NavIcon>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/profile">
          <NavIcon viewBox="0 0 24 24">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zM12 14c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"></path>
          </NavIcon>
        </NavLink>
      </NavItem>
    </NavWrapper>
  );
};

export default NavBar;
