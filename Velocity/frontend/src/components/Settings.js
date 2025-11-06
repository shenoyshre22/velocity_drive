import React, { useState, useEffect } from 'react';

export default function Settings(){
  const [volume,setVolume] = useState(()=> parseFloat(localStorage.getItem('vtn_volume') || '0.5'));
  const [car, setCar] = useState(()=> localStorage.getItem('vtn_car') || 'red');

  useEffect(()=> {
    localStorage.setItem('vtn_volume', volume);
  }, [volume]);

  useEffect(()=> {
    localStorage.setItem('vtn_car', car);
  }, [car]);

  return (
    <div className="container center">
      <h2>Settings</h2>
      <div style={{maxWidth:600, margin:'0 auto'}}>
        <div style={{marginBottom:12}}>
          <label className="small">Sound Volume: {Math.round(volume*100)}</label>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e=>setVolume(parseFloat(e.target.value))} style={{width:'100%'}}/>
        </div>
        <div>
          <label className="small">Preferred Car Color</label>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            {['red','blue','green','yellow','purple'].map(c => (
              <button key={c} className="btn" style={{background:c, color:'#001'}} onClick={()=>setCar(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
