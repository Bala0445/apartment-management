import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Maintenance.css";

const ManagerMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    fetchRequests();
    const es = new EventSource("http://localhost:5000/sse/maintenance");
    es.onmessage = e => { try { setRequests(JSON.parse(e.data)); } catch {} };
    return () => es.close();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/maintenance", { headers:{ Authorization:`Bearer ${user?.token}`}});
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/maintenance/${id}`, { headers:{ Authorization:`Bearer ${user?.token}`}});
    } catch (err) { console.error(err); }
  };

  return (
    <div className="card">
      <h2>Maintenance Requests</h2>
      <ul className="list">
        {requests.length === 0 ? <li className="muted">No requests</li> :
          requests.map(r => (
            <li key={r._id}>
              <div>{r.apartment} (Floor {r.floor}) — {r.request}</div>
              <button className="delete-btn" onClick={()=>remove(r._id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ManagerMaintenance;
