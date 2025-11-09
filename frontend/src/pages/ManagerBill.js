import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bills.css";

const ManagerBill = () => {
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({ apartment: "", floor: "", rent: "", maintenance: ""});
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    fetchBills();
    const es = new EventSource("http://localhost:5000/sse/bills");
    es.onmessage = e => { try { setBills(JSON.parse(e.data)); } catch {} };
    return () => es.close();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bills", { headers:{ Authorization:`Bearer ${user?.token}`}});
      setBills(res.data);
    } catch (err) { console.error(err); }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/bills", { apartment: form.apartment, floor: Number(form.floor), rent: Number(form.rent), maintenance: Number(form.maintenance) }, { headers:{ Authorization:`Bearer ${user?.token}`}});
      setForm({ apartment:"", floor:"", rent:"", maintenance:"" });
    } catch (err) { console.error(err); alert(err.response?.data?.message || "Error"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/bills/${id}`, { headers:{ Authorization:`Bearer ${user?.token}`}});
    } catch (err) { console.error(err); }
  };

  return (
    <div className="card">
      <h2>Manager - Bills</h2>
      <form className="form-row" onSubmit={create}>
        <input placeholder="Apartment" value={form.apartment} onChange={e=>setForm({...form, apartment:e.target.value})} required/>
        <input placeholder="Floor" type="number" value={form.floor} onChange={e=>setForm({...form, floor:e.target.value})} required/>
        <input placeholder="Rent" type="number" value={form.rent} onChange={e=>setForm({...form, rent:e.target.value})} required/>
        <input placeholder="Maintenance" type="number" value={form.maintenance} onChange={e=>setForm({...form, maintenance:e.target.value})} required/>
        <button className="btn primary" type="submit">Create</button>
      </form>

      <h3>All Bills</h3>
      <ul className="list">
        {bills.length === 0 ? <li className="muted">No bills</li> :
          bills.map(b => (
            <li key={b._id}>
              <div>{b.apartment} (Floor {b.floor}) — Rent: ₹{b.rent} Maintenance: ₹{b.maintenance}</div>
              <button className="delete-btn" onClick={()=>remove(b._id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ManagerBill;
