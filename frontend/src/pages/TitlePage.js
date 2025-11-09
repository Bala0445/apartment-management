import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TitlePage.css";
import bg from "../assets/restaurant-bg.jpg"; // you need to add an image file at src/assets/restaurant-bg.jpg

const TitlePage = () => {
  const navigate = useNavigate();
  return (
    <div className="title-wrap" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay" />
      <div className="title-card">
        <h1>MB Apartment</h1>
        <p>Welcome to MB Apartment management</p>
        <div className="btns">
          <button onClick={() => navigate("/login?role=tenant")}>Tenant Login</button>
          <button className="primary" onClick={() => navigate("/login?role=manager")}>Manager Login</button>
        </div>
      </div>
    </div>
  );
};

export default TitlePage;
