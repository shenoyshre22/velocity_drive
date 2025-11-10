import * as THREE from 'three';

// --- This function creates your car model ---
// We export it so other files (like GameScene.js) can use it
export const createCar = () => {
    const car = new THREE.Group();

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x004080, roughness: 0.3, metalness: 0.5 });
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.1, metalness: 0.8 });
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

    // Main body
    const mainBodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const mainBody = new THREE.Mesh(mainBodyGeometry, bodyMaterial);
    mainBody.position.y = 1;
    mainBody.castShadow = true;
    car.add(mainBody);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(2.2, 1, 1.8);
    const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
    cabin.position.y = 2.0;
    cabin.position.x = -0.1;
    cabin.castShadow = true;
    car.add(cabin);
    
    // Windows
    const windowGeometry = new THREE.BoxGeometry(2.21, 0.8, 1.81);
    const windows = new THREE.Mesh(windowGeometry, windowMaterial);
    windows.position.y = 2.1;
    windows.position.x = -0.1;
    windows.castShadow = true;
    car.add(windows);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.x = Math.PI / 2;
    wheel.castShadow = true;

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

    // We set the car's base position so its wheels are at y=0
    car.position.y = 0.5;

    // --- FIX ---
    // Rotate the entire car model 90 degrees to face the -Z direction (down the road)
    car.rotation.y = -Math.PI / 2; 
    // --- END FIX ---

    return car;
}