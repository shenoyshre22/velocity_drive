import React from 'react';
import GameScene from './GameScene'; // Import the 3D scene we created

// You can also import other UI components here, like a pause button or score display
// import UILayer from './UILayer'; 

const Game = ({ user }) => {
  return (
    <div className="game-container">
      {/* This renders your 3D car scene */}
      <GameScene />
      
      {/* --- OPTIONAL --- */}
      {/* You can add your game UI (like speed, score, pause) 
          as a separate component on top of the 3D scene. 
          This is a very common and good pattern.
      */}
      {/* <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
        <p>Player: {user.username}</p>
        <p>Score: 0</p>
      </div> 
      */}
    </div>
  );
};

export default Game;