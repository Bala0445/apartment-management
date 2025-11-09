import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const nav = useNavigate();
  const role = new URLSearchParams(useLocation().search).get("role");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      // call backend login for tokens (backend has manager hardcoded)
      const { data } = await axios.post("http://localhost:5000/api/users/login", { username, password });
      localStorage.setItem("user", JSON.stringify(data));
      if (data.role === "manager") nav("/manager/apartments");
      else nav("/tenant/apartments");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>{role === "manager" ? "Manager Login" : "Tenant Login"}</h2>
        <form onSubmit={submit}>
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button className="btn primary" type="submit">Login</button>
          {err && <p className="error">{err}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
