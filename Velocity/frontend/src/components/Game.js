import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Game({ user }){
  const mountRef = useRef();
  const nav = useNavigate();
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x081226);
    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
    camera.position.set(0, 6, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5,10,7);
    scene.add(dir);

    // ground / track (simple ring)
    const track = new THREE.Mesh(
      new THREE.TorusGeometry(12, 2.2, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.7 })
    );
    track.rotation.x = Math.PI/2;
    scene.add(track);

    // player car (box)
    const playerColor = localStorage.getItem('vtn_car') || 'red';
    const colorMap = { red:0xff0000, blue:0x2b6cb0, green:0x16a34a, yellow:0xf59e0b, purple:0x7c3aed };
    const player = new THREE.Mesh(
      new THREE.BoxGeometry(1.6,0.6,3),
      new THREE.MeshStandardMaterial({ color: colorMap[playerColor] || 0xff0000 })
    );
    player.position.y = 0.5;
    scene.add(player);

    // AI cars
    const aiCars = [];
    for(let i=0;i<4;i++){
      const ai = new THREE.Mesh(
        new THREE.BoxGeometry(1.6,0.6,3),
        new THREE.MeshStandardMaterial({ color: Math.random()*0xffffff })
      );
      ai.position.y = 0.5;
      ai.userData = { angle: (i+1) * Math.PI/2 + 0.5 * i, speed: 0.01 + Math.random()*0.015 };
      scene.add(ai);
      aiCars.push(ai);
    }

    // simple controls
    let steer = 0;
    const keyDown = (e) => { if(e.key === 'ArrowLeft') steer = -1; if(e.key === 'ArrowRight') steer = 1; if(e.key === ' ') { /* boost */ } };
    const keyUp = (e) => { if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') steer = 0; };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // scoring: count laps by detecting angle wrap
    let playerAngle = 0;
    let laps = 0;
    const totalLaps = 1; // single lap for demo
    const startTime = Date.now();

    const animate = () => {
      // AI motion along torus center (approx circle)
      aiCars.forEach((ai, idx) => {
        ai.userData.angle += ai.userData.speed;
        const r = 12 + (idx-2)*0.6;
        ai.position.x = Math.cos(ai.userData.angle) * r;
        ai.position.z = Math.sin(ai.userData.angle) * r;
        ai.rotation.y = -ai.userData.angle;
      });

      // player movement controlled by steer
      // convert playerAngle to position on circle
      playerAngle += 0.02 + steer*0.01; // base forward + steering influence
      const pr = 12;
      player.position.x = Math.cos(playerAngle) * pr;
      player.position.z = Math.sin(playerAngle) * pr;
      player.rotation.y = -playerAngle;

      // camera follow
      const camOffset = new THREE.Vector3(Math.cos(playerAngle)*-6, 4, Math.sin(playerAngle)*-6);
      camera.position.lerp(new THREE.Vector3(player.position.x + camOffset.x, camOffset.y, player.position.z + camOffset.z), 0.07);
      camera.lookAt(player.position);

      // lap detection
      if (playerAngle > Math.PI*2) {
        laps += 1;
        playerAngle = playerAngle - Math.PI*2;
      }
      const progress = Math.min(1, (playerAngle % (Math.PI*2)) / (Math.PI*2));
      const timeTaken = (Date.now() - startTime)/1000;
      const computedScore = Math.max(0, Math.round(10000 * (progress + laps) - timeTaken*5));
      setScore(computedScore);

      renderer.render(scene, camera);
      if (laps >= totalLaps) {
        // finish
        setFinished(true);
      } else {
        requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(()=>{
    if (finished) {
      // save score to backend if logged in
      const send = async () => {
        try {
          await API.post('/scores', { score });
        } catch (e) {
          console.warn('Score save failed', e?.response?.data);
        } finally {
          nav('/results', { state: { score } });
        }
      };
      send();
    }
  }, [finished]);

  return (
    <div className="container">
      <div className="header">
        <h3>Race in progress</h3>
        <div className="row">
          <div className="small">Score: {score}</div>
        </div>
      </div>
      <div className="canvas-wrap" ref={mountRef} />
      <div style={{marginTop:12}} className="small">Controls: ArrowLeft & ArrowRight to steer. Finish a lap to complete.</div>
    </div>
  );
}
