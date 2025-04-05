import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = ({ text = "" }) => {
  return (
    <div className="header-container">
      <i className="fa-solid fa-meteor"></i>
      <div className="logo">TypeMaster</div>
    </div>
  );
};

export default Header;
