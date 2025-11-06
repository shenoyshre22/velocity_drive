import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CARS = ['red','blue','green','yellow','purple'];

export default function CarSelection(){
  const nav = useNavigate();
  const [selected, setSelected] = useState(localStorage.getItem('vtn_car') || 'red');

  const start = () => {
    localStorage.setItem('vtn_car', selected);
    nav('/game');
  };

  return (
    <div className="container center">
      <h2>Choose your car</h2>
      <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:12}}>
        {CARS.map(c => (
          <div key={c} style={{textAlign:'center'}}>
            <div style={{width:120, height:60, background:c, borderRadius:8, marginBottom:8}} />
            <button className="btn" onClick={()=>setSelected(c)} style={{outline: selected===c ? '3px solid #fff' : 'none'}}>Select</button>
          </div>
        ))}
      </div>
      <div style={{marginTop:16}}>
        <button className="btn" onClick={start}>Continue</button>
      </div>
    </div>
  );
}
