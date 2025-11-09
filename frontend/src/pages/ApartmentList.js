import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/ApartmentList.css";

const ApartmentList = () => {
  const [list, setList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/apartments", { headers:{ Authorization:`Bearer ${user?.token}`}});
        setList(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();

    // SSE for apartments
    const es = new EventSource("/sse/apartments");
    es.onmessage = e => { try { setList(JSON.parse(e.data)); } catch {} };
    return () => es.close();
  }, []);

  return (
    <div className="card">
      <h2>Apartments</h2>
      <ul className="list">
        {list.length === 0 ? <li className="muted">No apartments</li> :
          list.map(a => <li key={a._id}>{a.name} — Floor {a.floor}</li>)}
      </ul>
    </div>
  );
};

export default ApartmentList;
