import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Maintenance.css";

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ apartment: "", floor: "", request: "" });
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/maintenance", { headers:{ Authorization:`Bearer ${user?.token}`}});
        setRequests(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
    const es = new EventSource("http://localhost:5000/sse/maintenance");
    es.onmessage = e => { try { setRequests(JSON.parse(e.data)); } catch {} };
    return () => es.close();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/maintenance", { apartment: form.apartment, floor: Number(form.floor), request: form.request }, { headers:{ Authorization:`Bearer ${user?.token}`}});
      setForm({ apartment:"", floor:"", request:"" });
    } catch (err) { console.error(err); alert(err.response?.data?.message || "Error"); }
  };

  return (
    <div className="card">
      <h2>Maintenance</h2>
      <form className="form-row" onSubmit={submit}>
        <input placeholder="Apartment name" value={form.apartment} onChange={e=>setForm({...form, apartment:e.target.value})} required />
        <input placeholder="Floor" type="number" value={form.floor} onChange={e=>setForm({...form, floor:e.target.value})} required />
        <input placeholder="Describe issue" value={form.request} onChange={e=>setForm({...form, request:e.target.value})} required />
        <button className="btn primary" type="submit">Submit</button>
      </form>

      <ul className="list">
        {requests.length === 0 ? <li className="muted">No requests</li> :
          requests.map(r => <li key={r._id}>{r.apartment} (Floor {r.floor}) — {r.request} <span className="muted">({r.status})</span></li>)}
      </ul>
    </div>
  );
};

export default Maintenance;
