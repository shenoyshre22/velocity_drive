import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// This import path includes the ".js" at the end, which fixes the previous error
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// This is our 3D component. Its only job is to show the car.
const GameScene = () => {
    // useRef hook to get a reference to the div that will hold our 3D scene
    const mountRef = useRef(null);

    // useEffect hook to set up the scene when the component "mounts" (is added to the page)
    useEffect(() => {
        // --- Basic Scene Setup ---
        // 'current' points to the mounted div
        const currentMount = mountRef.current; 

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcccccc); // Light gray background
        scene.fog = new THREE.Fog(0xcccccc, 10, 30); // Fog for a nice effect

        // Camera
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(4, 3, 5); // Set camera position

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias for smooth edges
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.shadowMap.enabled = true; // Enable shadows
        currentMount.appendChild(renderer.domElement); // Add renderer canvas to our div

        // Orbit Controls (for rotating the view with the mouse)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Smooths out the rotation
        controls.target.set(0, 1, 0); // Make controls orbit around the car's center

        // --- Lighting ---
        // Soft ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // Directional light (like the sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true; // This light will cast shadows
        scene.add(directionalLight);

        // --- Ground Plane ---
        // A simple plane to act as the ground
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, side: THREE.DoubleSide });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate it to be flat
        ground.receiveShadow = true; // The ground will receive shadows from the car
        scene.add(ground);

        // --- Create the Car (This is your "car code"!) ---
        const car = new THREE.Group(); // We group all car parts together
        scene.add(car);

        // Materials
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x004080, roughness: 0.3, metalness: 0.5 }); // Nice blue metal
        const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.1, metalness: 0.8 }); // Dark, shiny glass
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 }); // Dark, rough rubber

        // Main body (a simple box)
        const mainBodyGeometry = new THREE.BoxGeometry(4, 1, 2); // width, height, depth
        const mainBody = new THREE.Mesh(mainBodyGeometry, bodyMaterial);
        mainBody.position.y = 1;
        mainBody.castShadow = true;
        car.add(mainBody);

        // Cabin (another box on top)
        const cabinGeometry = new THREE.BoxGeometry(2.2, 1, 1.8);
        const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
        cabin.position.y = 2.0; // Place it on top of the main body
        cabin.position.x = -0.1; // Slightly to the back
        cabin.castShadow = true;
        car.add(cabin);
        
        // Windows (a slightly larger box to simulate windows)
        const windowGeometry = new THREE.BoxGeometry(2.21, 0.8, 1.81); // Just barely bigger than cabin
        const windows = new THREE.Mesh(windowGeometry, windowMaterial);
        windows.position.y = 2.1; // Centered with the cabin
        windows.position.x = -0.1;
        windows.castShadow = true;
        car.add(windows);

        // Wheels (Cylinders)
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32); // radiusTop, radiusBottom, height, segments
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.x = Math.PI / 2; // Rotate them to be vertical
        wheel.castShadow = true;

        // We clone the wheel for all 4 positions
        const wheelPositions = [
            { x: 1.4, y: 0.5, z: 1 },  // Front-right
            { x: 1.4, y: 0.5, z: -1 }, // Front-left
            { x: -1.4, y: 0.5, z: 1 }, // Back-right
            { x: -1.4, y: 0.5, z: -1 }  // Back-left
        ];

        wheelPositions.forEach(pos => {
            const newWheel = wheel.clone();
            newWheel.position.set(pos.x, pos.y, pos.z);
            car.add(newWheel);
        });
        
        // --- Animation Loop ---
        // This function runs every frame
        const animate = () => {
            requestAnimationFrame(animate); // Loop the animation
            controls.update(); // Update controls for smooth damping
            renderer.render(scene, camera); // Render the scene
        };
        animate();

        // --- Handle Window Resize ---
        // This makes the scene responsive
        const handleResize = () => {
            if (currentMount) { // Check if the component is still mounted
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // --- Cleanup function ---
        // This runs when the component "unmounts" (is removed from the page)
        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) { // Check again
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []); // The empty array [] means this effect runs only once

    // This is what the component renders: a div that will be filled by our 3D scene
    // We make it take up the full screen
    return (
        <div
            ref={mountRef}
            style={{ width: '100vw', height: '100vh', display: 'block' }}
        />
    );
};

export default GameScene;