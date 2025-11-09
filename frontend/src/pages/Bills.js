import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bills.css";

const Bills = () => {
  const [bills, setBills] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bills", { headers:{ Authorization:`Bearer ${user?.token}`}});
        setBills(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
    const es = new EventSource("http://localhost:5000/sse/bills");
    es.onmessage = e => { try { setBills(JSON.parse(e.data)); } catch {} };
    return () => es.close();
  }, []);

  return (
    <div className="card">
      <h2>Bills</h2>
      <ul className="list">
        {bills.length === 0 ? <li className="muted">No bills</li> :
          bills.map(b => <li key={b._id}>{b.apartment} (Floor {b.floor}) — Rent: ₹{b.rent} Maintenance: ₹{b.maintenance}</li>)}
      </ul>
    </div>
  );
};

export default Bills;
