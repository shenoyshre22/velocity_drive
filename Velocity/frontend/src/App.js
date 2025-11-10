import './style.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import Settings from './components/Settings';
import CarSelection from './components/CarSelection';
import Game from './components/Game';
import Results from './components/Results';
import api from './utils/api';

function App(){
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vtn_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(()=> {
    if (user) localStorage.setItem('vtn_user', JSON.stringify(user));
    else localStorage.removeItem('vtn_user');
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ user ? <Navigate to='/menu'/> : <Login setUser={setUser}/> } />
        <Route path="/menu" element={ user ? <Menu /> : <Navigate to="/" /> } />
        <Route path="/settings" element={ user ? <Settings /> : <Navigate to='/' /> } />
        <Route path="/select" element={ user ? <CarSelection /> : <Navigate to='/' /> } />
        <Route path="/game" element={ user ? <Game user={user} /> : <Navigate to='/' /> } />
        <Route path="/results" element={ user ? <Results /> : <Navigate to='/' /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
