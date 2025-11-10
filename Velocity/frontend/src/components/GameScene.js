import * as THREE from 'three';
// Import your createCar function from the other file
import { createCar } from './CarModel.js';

// --- SCENE SETUP (BOILERPLATE) ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue
scene.fog = new THREE.Fog(0x87ceeb, 50, 150);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Enable shadows
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- LIGHTING ---
// Bright directional light for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
directionalLight.position.set(10, 20, 5);
directionalLight.castShadow = true;
// Configure shadow properties
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Soft ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// --- CREATE THE CAR ---
// We call your function to get the car model
const car = createCar();
scene.add(car);

// --- CREATE THE "INFINITE" ROAD ---
const roadSegments = [];
const SEGMENT_LENGTH = 30; // How long each piece of road is
const NUM_SEGMENTS = 10;   // How many pieces to cycle through
const ROAD_WIDTH = 8;

// Material for the road
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 }); // Dark green

// Create a function to make one road segment
function createRoadSegment() {
    const segment = new THREE.Group();

    // Road plane
    const roadGeometry = new THREE.PlaneGeometry(ROAD_WIDTH, SEGMENT_LENGTH);
    const roadPlane = new THREE.Mesh(roadGeometry, roadMaterial);
    roadPlane.rotation.x = -Math.PI / 2; // Lay it flat
    roadPlane.receiveShadow = true; // Allow shadows to be cast on it
    segment.add(roadPlane);

    // Grass plane
    const grassGeometry = new THREE.PlaneGeometry(ROAD_WIDTH * 10, SEGMENT_LENGTH); // Much wider grass
    const grassPlane = new THREE.Mesh(grassGeometry, grassMaterial);
    grassPlane.rotation.x = -Math.PI / 2;
    grassPlane.position.y = -0.01; // Slightly below the road
    grassPlane.receiveShadow = true;
    segment.add(grassPlane);
    
    scene.add(segment);
    return segment;
}

// Create the initial pool of road segments
for (let i = 0; i < NUM_SEGMENTS; i++) {
    const segment = createRoadSegment();
    // Position them one after another, moving "into" the screen (-Z)
    segment.position.z = -i * SEGMENT_LENGTH;
    roadSegments.push(segment);
}

// This is the total length of all segments combined
const totalRoadLength = NUM_SEGMENTS * SEGMENT_LENGTH;

// --- CAMERA SETUP ---
// Position the camera behind and above the car
const cameraOffset = new THREE.Vector3(0, 5, 10);

// --- ANIMATION LOOP ---
const carSpeed = 0.3;

function animate() {
    requestAnimationFrame(animate);

    // 1. Move the car forward
    // The car model faces -Z, so we decrement its Z position
    car.position.z -= carSpeed;

    // 2. Update the "infinite" road
    // Check each segment to see if it's moved behind the camera
    roadSegments.forEach(segment => {
        // We check if the segment's *back edge* is behind the camera
        // (camera.position.z is also moving, so we check relative to the car)
        const segmentBackEdge = segment.position.z + SEGMENT_LENGTH / 2;
        
        // If the segment is fully behind the car's *follow-camera*, move it to the front
        if (segmentBackEdge > car.position.z + SEGMENT_LENGTH) {
            // Move it from the back of the line to the front
            segment.position.z -= totalRoadLength;
        }
    });

    // 3. Update the camera to follow the car
    // It should stay at its offset *relative* to the car's new position
    camera.position.x = car.position.x + cameraOffset.x;
    camera.position.y = car.position.y + cameraOffset.y;
    camera.position.z = car.position.z + cameraOffset.z;

    // Always look at the car
    camera.lookAt(car.position);

    // 4. Render the scene
    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation!
animate();