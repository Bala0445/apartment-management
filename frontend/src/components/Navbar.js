import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ role }) => {
  const base = role === "manager" ? "/manager" : "/tenant";
  return (
    <nav className="navbar">
      <div className="logo">MB Restaurant</div>
      <div className="links">
        {role === "manager" ? (
          <>
            <NavLink to={`${base}/apartments`}>Apartments</NavLink>
            <NavLink to={`${base}/add-apartment`}>Add Apartment</NavLink>
            <NavLink to={`${base}/bills`}>Bills</NavLink>
            <NavLink to={`${base}/maintenance`}>Maintenance</NavLink>
          </>
        ) : (
          <>
            <NavLink to={`${base}/apartments`}>Apartments</NavLink>
            <NavLink to={`${base}/bills`}>Bills</NavLink>
            <NavLink to={`${base}/maintenance`}>Maintenance</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
