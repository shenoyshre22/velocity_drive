import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Results(){
  const nav = useNavigate();
  const loc = useLocation();
  const score = loc.state?.score ?? 0;
  const [best, setBest] = useState(null);

  useEffect(()=>{
    const getBest = async () => {
      try {
        const res = await API.get('/scores/best');
        setBest(res.data.bestScore);
      } catch (e) {
        console.warn('could not fetch best', e);
      }
    };
    getBest();
  }, []);

  return (
    <div className="container center">
      <h2>Race Results</h2>
      <div style={{fontSize:28, margin:8}}>Your Score: {score}</div>
      <div className="small">Best Score: {best ?? '—'}</div>
      <div style={{marginTop:16}}>
        <button className="btn" onClick={()=>nav('/menu')}>Play Again</button>
        <button className="btn" onClick={()=>window.close()}>Quit</button>
      </div>
    </div>
  );
}
