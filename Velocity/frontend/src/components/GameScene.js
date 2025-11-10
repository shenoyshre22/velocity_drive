import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
// Import your createCar function from the other file
import { createCar } from './CarModel.js'; // Assuming CarModel.js is in the same folder

// This component will manage the Three.js canvas
const GameScene = () => {
    // useRef will give us a reference to a DOM element (our mount point)
    const mountRef = useRef(null);

    // useEffect runs once after the component mounts
    useEffect(() => {
        // --- SCENE SETUP (BOILERPLATE) ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb); // Sky blue
        scene.fog = new THREE.Fog(0x87ceeb, 50, 150);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Enable shadows
        renderer.shadowMap.enabled = true;

        // Get the current mount point (our div)
        const currentMount = mountRef.current;
        // Append the renderer's canvas to our mount point
        currentMount.appendChild(renderer.domElement);

        // --- LIGHTING ---
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
        directionalLight.position.set(10, 20, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // --- CREATE THE CAR ---
        const car = createCar();
        scene.add(car);

        // --- CREATE THE "INFINITE" ROAD ---
        const roadSegments = [];
        const SEGMENT_LENGTH = 30; // How long each piece of road is
        const NUM_SEGMENTS = 10;   // How many pieces to cycle through
        const ROAD_WIDTH = 8;

        const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });

        function createRoadSegment() {
            const segment = new THREE.Group();
            const roadGeometry = new THREE.PlaneGeometry(ROAD_WIDTH, SEGMENT_LENGTH);
            const roadPlane = new THREE.Mesh(roadGeometry, roadMaterial);
            roadPlane.rotation.x = -Math.PI / 2;
            roadPlane.receiveShadow = true;
            segment.add(roadPlane);

            const grassGeometry = new THREE.PlaneGeometry(ROAD_WIDTH * 10, SEGMENT_LENGTH);
            const grassPlane = new THREE.Mesh(grassGeometry, grassMaterial);
            grassPlane.rotation.x = -Math.PI / 2;
            grassPlane.position.y = -0.01;
            grassPlane.receiveShadow = true;
            segment.add(grassPlane);
            
            scene.add(segment);
            return segment;
        }

        for (let i = 0; i < NUM_SEGMENTS; i++) {
            const segment = createRoadSegment();
            segment.position.z = -i * SEGMENT_LENGTH;
            roadSegments.push(segment);
        }

        const totalRoadLength = NUM_SEGMENTS * SEGMENT_LENGTH;

        // --- CAMERA SETUP ---
        const cameraOffset = new THREE.Vector3(0, 5, 10);

        // --- ANIMATION LOOP ---
        const carSpeed = 0.3;
        let animationFrameId; // To store the requestAnimationFrame ID

        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            // Move the car
            car.position.z -= carSpeed;

            // Update the road
            roadSegments.forEach(segment => {
                const segmentBackEdge = segment.position.z + SEGMENT_LENGTH / 2;
                if (segmentBackEdge > car.position.z + SEGMENT_LENGTH) {
                    segment.position.z -= totalRoadLength;
                }
            });

            // Update the camera
            camera.position.x = car.position.x + cameraOffset.x;
            camera.position.y = car.position.y + cameraOffset.y;
            camera.position.z = car.position.z + cameraOffset.z;
            camera.lookAt(car.position);

            renderer.render(scene, camera);
        }

        animate(); // Start the loop

        // --- Handle Window Resize ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // --- CLEANUP ---
        // This function runs when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            // Check if currentMount is still valid before trying to remove the child
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            // Dispose of Three.js objects to free up memory (optional but good practice)
            scene.traverse(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
        };

    }, []); // The empty array [] means this useEffect runs only once (on mount)

    // Finally, we return the div that Three.js will attach its canvas to
    return (
        <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
    );
};

export default GameScene;