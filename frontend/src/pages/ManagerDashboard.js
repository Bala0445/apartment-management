import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ApartmentList from "./ApartmentList";
import AddApartment from "./AddApartment";
import ManagerBill from "./ManagerBill";
import ManagerMaintenance from "./ManagerMaintenance";

const ManagerDashboard = () => {
  return (
    <>
      <Navbar role="manager" />
      <div className="page-inner">
        <Routes>
          <Route path="apartments" element={<ApartmentList />} />
          <Route path="add-apartment" element={<AddApartment />} />
          <Route path="bills" element={<ManagerBill />} />
          <Route path="maintenance" element={<ManagerMaintenance />} />
        </Routes>
      </div>
    </>
  );
};

export default ManagerDashboard;
