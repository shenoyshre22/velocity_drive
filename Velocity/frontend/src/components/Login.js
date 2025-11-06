import React, { useState } from 'react';
import API from '../utils/api';

export default function Login({ setUser }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [isRegister,setIsRegister]=useState(false);
  const [err,setErr]=useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (isRegister) {
        const res = await API.post('/auth/register', { name, email, password });
        localStorage.setItem('vtn_token', res.data.token);
        localStorage.setItem('vtn_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      } else {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('vtn_token', res.data.token);
        localStorage.setItem('vtn_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (e) {
      setErr(e.response?.data?.msg || 'Server error');
    }
  };

  return (
    <div className="container center">
      <h1>Velocity Torque Nation</h1>
      <p className="small">Login or Register to save scores</p>
      <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:360, margin:'0 auto'}}>
        {isRegister && <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />}
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <div style={{display:'flex', gap:8}}>
          <button className="btn" type="submit">{isRegister ? 'Register' : 'Login'}</button>
          <button type="button" className="btn" onClick={()=>setIsRegister(!isRegister)}>{isRegister ? 'Have account? Login' : 'New? Register'}</button>
        </div>
        {err && <div style={{color:'#fca5a5'}}>{err}</div>}
        <div style={{marginTop:8}} className="small">This demo stores JWT in localStorage and requires a running backend with MongoDB.</div>
      </form>
    </div>
  );
}
