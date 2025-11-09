import React from "react";
import { Routes, Route } from "react-router-dom";
import TitlePage from "./pages/TitlePage";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import TenantDashboard from "./pages/TenantDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TitlePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manager/*" element={<ManagerDashboard />} />
      <Route path="/tenant/*" element={<TenantDashboard />} />
    </Routes>
  );
}

export default App;
