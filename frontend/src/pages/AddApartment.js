import React, { useState } from "react";
import axios from "axios";
import "../styles/AddApartment.css";

const AddApartment = () => {
  const [name,setName] = useState("");
  const [floor,setFloor] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/apartments", { name, floor: Number(floor) }, { headers:{ Authorization:`Bearer ${user?.token}`}});
      setName(""); setFloor("");
      alert("Apartment added");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="card">
      <h2>Add Apartment</h2>
      <form className="form-row" onSubmit={submit}>
        <input placeholder="Apartment name" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Floor number" type="number" value={floor} onChange={e=>setFloor(e.target.value)} required />
        <button className="btn primary" type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddApartment;
