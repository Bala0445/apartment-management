import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ApartmentList from "./ApartmentList";
import Bills from "./Bills";
import Maintenance from "./Maintenance";

const TenantDashboard = () => {
  return (
    <>
      <Navbar role="tenant" />
      <div className="page-inner">
        <Routes>
          <Route path="apartments" element={<ApartmentList />} />
          <Route path="bills" element={<Bills />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Routes>
      </div>
    </>
  );
};

export default TenantDashboard;
