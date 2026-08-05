/* ==========================================================================
   SHIELDFORCE - THREE.JS 3D HERO CANVAS CONTROLLER
   3D Floating Shield, Particle Network, Radar Ground, Mouse Parallax
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060913, 0.025);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 18);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Create 3D Shield Mesh (Using Shape & ExtrudeGeometry)
  const shieldShape = new THREE.Shape();
  // Drawing shield silhouette
  shieldShape.moveTo(0, 3.2);
  shieldShape.bezierCurveTo(1.8, 3.2, 2.5, 2.5, 2.5, 1.2);
  shieldShape.bezierCurveTo(2.5, -1.0, 1.2, -2.5, 0, -3.4);
  shieldShape.bezierCurveTo(-1.2, -2.5, -2.5, -1.0, -2.5, 1.2);
  shieldShape.bezierCurveTo(-2.5, 2.5, -1.8, 3.2, 0, 3.2);

  const extrudeSettings = {
    steps: 2,
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.25,
    bevelSize: 0.2,
    bevelSegments: 6
  };

  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
  shieldGeo.center();

  // Shield Outer Metallic Material
  const shieldMat = new THREE.MeshStandardMaterial({
    color: 0x0F172A,
    metalness: 0.85,
    roughness: 0.2,
    wireframe: false
  });

  const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  
  // Wireframe Glowing Layer Overlay
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const wireframeMesh = new THREE.Mesh(shieldGeo, wireframeMat);
  wireframeMesh.scale.set(1.02, 1.02, 1.02);

  // Inner Emblem (Star / Security Badge Symbol inside Shield)
  const emblemGeo = new THREE.OctahedronGeometry(1.0, 0);
  const emblemMat = new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    emissive: 0xB45309,
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.1
  });
  const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
  emblemMesh.position.z = 0.4;

  const shieldGroup = new THREE.Group();
  shieldGroup.add(shieldMesh);
  shieldGroup.add(wireframeMesh);
  shieldGroup.add(emblemMesh);

  // Offset shield position for split-hero layout on desktop
  if (window.innerWidth > 992) {
    shieldGroup.position.set(4.5, 0, 0);
  } else {
    shieldGroup.position.set(0, 1.5, -4);
  }

  scene.add(shieldGroup);

  // 2. Floating Particle Constellation
  const particleCount = window.innerWidth > 768 ? 200 : 90;
  const particlesGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 35;
    particlePositions[i + 1] = (Math.random() - 0.5) * 35;
    particlePositions[i + 2] = (Math.random() - 0.5) * 20;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x38BDF8,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particlesGeo, particleMat);
  scene.add(particleSystem);

  // 3. Grid Ground Matrix (Radar Sweep)
  const gridHelper = new THREE.GridHelper(50, 40, 0x38BDF8, 0x1E293B);
  gridHelper.position.y = -6;
  gridHelper.material.opacity = 0.25;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // 4. Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x38BDF8, 3, 30);
  cyanLight.position.set(6, 6, 8);
  scene.add(cyanLight);

  const goldLight = new THREE.PointLight(0xF59E0B, 2.5, 30);
  goldLight.position.set(-6, -4, 5);
  scene.add(goldLight);

  const spotLight = new THREE.SpotLight(0xffffff, 2);
  spotLight.position.set(0, 10, 10);
  spotLight.angle = Math.PI / 4;
  scene.add(spotLight);

  // Mouse Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Clock for smooth animations
  const clock = new THREE.Clock();

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Mouse Target Interpolation
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Shield Motion
    shieldGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3 + targetX * 0.5;
    shieldGroup.rotation.x = Math.cos(elapsedTime * 0.4) * 0.15 - targetY * 0.3;
    shieldGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.35 + (window.innerWidth <= 992 ? 1.5 : 0);

    // Emblem Rotation
    emblemMesh.rotation.y = elapsedTime * 1.5;
    emblemMesh.rotation.z = elapsedTime * 0.8;

    // Particles subtle rotation
    particleSystem.rotation.y = elapsedTime * 0.05;
    particleSystem.rotation.x = elapsedTime * 0.03;

    // Grid slight motion
    gridHelper.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Window Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (window.innerWidth > 992) {
      shieldGroup.position.set(4.5, 0, 0);
    } else {
      shieldGroup.position.set(0, 1.5, -4);
    }
  });
});
