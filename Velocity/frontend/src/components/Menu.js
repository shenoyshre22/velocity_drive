import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Menu(){
  const nav = useNavigate();
  return (
    <div className="container center">
      <div className="header">
        <h2>Menu</h2>
        <div className="row">
          <button className="btn" onClick={()=>{ localStorage.removeItem('vtn_token'); localStorage.removeItem('vtn_user'); window.location='/' }}>Logout</button>
        </div>
      </div>
      <div className="menu">
        <button className="btn" onClick={()=>nav('/select')}>Play</button>
        <button className="btn" onClick={()=>nav('/settings')}>Settings</button>
        <button className="btn" onClick={()=>window.close()}>Quit</button>
      </div>
    </div>
  );
}
