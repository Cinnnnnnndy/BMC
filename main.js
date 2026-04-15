import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ── DOM refs ────────────────────────────────────────────────
const canvas       = document.getElementById('three-canvas');
const loading      = document.getElementById('loading');
const statusText   = document.getElementById('status-text');
const statusChip   = document.getElementById('status-chip');
const zoomChip     = document.getElementById('zoom-chip');
const infoZoom     = document.getElementById('info-zoom');
const infoSize     = document.getElementById('info-size');
const infoMeshes   = document.getElementById('info-meshes');
const infoMaterials= document.getElementById('info-materials');
const inspectorPanel = document.getElementById('inspector-panel');
const btnViewSwitch = document.getElementById('btn-view-switch');
const btnLibBoards  = document.getElementById('btn-lib-boards');
const btnLibChips   = document.getElementById('btn-lib-chips');
const btnLibConnectors = document.getElementById('btn-lib-connectors');
const btnZoomFit    = document.getElementById('btn-zoom-fit');
const btnZoomIn     = document.getElementById('btn-zoom-in');
const btnZoomOut    = document.getElementById('btn-zoom-out');
const lightPanel      = document.getElementById('light-panel');
const btnLightToggle  = document.getElementById('btn-light-toggle');
const sliderIntensity = document.getElementById('light-intensity');
const sliderAzimuth   = document.getElementById('light-azimuth');
const sliderElevation = document.getElementById('light-elevation');
const valIntensity    = document.getElementById('light-intensity-val');
const valAzimuth      = document.getElementById('light-azimuth-val');
const valElevation    = document.getElementById('light-elevation-val');
const cameraPanel          = document.getElementById('camera-panel');
const btnCameraToggle      = document.getElementById('btn-camera-toggle');
const sliderCameraAzimuth  = document.getElementById('camera-azimuth');
const valCameraAzimuth     = document.getElementById('camera-azimuth-val');
const sliderCameraElevation = document.getElementById('camera-elevation');
const valCameraElevation   = document.getElementById('camera-elevation-val');

// ── Renderer ────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ── Scene ───────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f9fc);

const groundPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 16),
  new THREE.MeshStandardMaterial({ color: 0xe3e9ee, roughness: 0.96, metalness: 0.0 })
);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -0.012;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

// Ground grid
const gridGround = new THREE.Group();
let gridMajor = new THREE.GridHelper(16, 32, 0xb8c6d8, 0xd7e0ea);
gridMajor.material.transparent = true;
gridMajor.material.opacity = 0.9;
let gridMinor = new THREE.GridHelper(16, 128, 0xdfe6ef, 0xe9eef5);
gridMinor.material.transparent = true;
gridMinor.material.opacity = 0.5;
gridGround.add(gridMinor, gridMajor);
scene.add(gridGround);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 1.08);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.castShadow = true;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.left = -120;
dirLight.shadow.camera.right = 120;
dirLight.shadow.camera.top = 120;
dirLight.shadow.camera.bottom = -120;
dirLight.shadow.bias = -0.001;
dirLight.shadow.normalBias = 0.02;
dirLight.shadow.radius = 2;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

const helper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(helper);

// Light control state
const LIGHT_DIST = 80;
const lightParams = { intensity: 3.0, azimuth: 330, elevation: 12 };

function updateDirLight() {
  const az = THREE.MathUtils.degToRad(lightParams.azimuth);
  const el = THREE.MathUtils.degToRad(lightParams.elevation);
  dirLight.position.set(
    LIGHT_DIST * Math.cos(el) * Math.sin(az),
    LIGHT_DIST * Math.sin(el),
    LIGHT_DIST * Math.cos(el) * Math.cos(az)
  );
  dirLight.intensity = lightParams.intensity;
  renderer.shadowMap.needsUpdate = true;
}
updateDirLight();

// ==================== 新增 ====================
window.directionalLight = dirLight;
window.THREE = THREE;
console.log("✅ directionalLight 和 THREE 已暴露");

const fillLight = new THREE.DirectionalLight(0xddeaff, 0.85);
fillLight.position.set(-4.8, 2.9, -5.6);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemiLight);

// ── Camera ──────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(18, window.innerWidth / window.innerHeight, 0.1, 1000);

const VIEW_MODES = {
  oblique: {
    azimuth: THREE.MathUtils.degToRad(151),
    elevation: THREE.MathUtils.degToRad(48),
    targetYOffset: 0.5
  },
  top: {
    azimuth: Math.PI / 4,
    elevation: Math.PI / 2,
    targetYOffset: 0.02,
    targetXOffset: 0.6,
    zoom: 0.75
  }
};
const VIEW_DISTANCE_SCALE = 5.5 / 8;
let cameraDistance = 5.5;
let baseDistance = 5.5;
const cameraTarget = new THREE.Vector3(0, 0, 0);
let currentViewMode = 'oblique';
let cameraAzimuth = VIEW_MODES.oblique.azimuth;
let cameraElevation = VIEW_MODES.oblique.elevation;

function setIsoCameraPos() {
  camera.position.set(
    cameraDistance * Math.cos(cameraElevation) * Math.sin(cameraAzimuth) + 0.5,
    cameraDistance * Math.sin(cameraElevation) - 0.3,
    cameraDistance * Math.cos(cameraElevation) * Math.cos(cameraAzimuth) + 0.5
  );
  camera.lookAt(cameraTarget);
}

function updateCameraFrustum() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

setIsoCameraPos();
updateCameraFrustum();

let currentZoom = 1.0;
const ZOOM_MIN = 0.65;
const ZOOM_MAX = 3.0;
const ZOOM_DEFAULT = 1.0;

function applyZoom(z) {
  currentZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
  cameraDistance = baseDistance / currentZoom;
  setIsoCameraPos();
  const pct = Math.round(currentZoom * 100) + '%';
  zoomChip.textContent = pct;
  infoZoom.textContent = pct;
}

applyZoom(ZOOM_DEFAULT);

// ── Model ───────────────────────────────────────────────────
let modelRoot = null;
const materials = new Set();

function fitCameraToObject(object) {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const margin = 1.08;

  cameraTarget.copy(center);

  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  const aspect = window.innerWidth / window.innerHeight;
  const halfFovY = Math.tan(fovRad / 2);
  baseDistance = (sphere.radius / halfFovY) * Math.max(1, 1 / aspect) * margin * VIEW_DISTANCE_SCALE;

  applyZoom(ZOOM_DEFAULT);
}

function fitShadowCameraToScene(light, scene) {
  const box = new THREE.Box3();
  scene.traverse((obj) => { if (obj.isMesh) box.expandByObject(obj); });
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const r = Math.max(size.x, size.y, size.z) * 0.75;
  light.shadow.camera.left   = -r;
  light.shadow.camera.right  =  r;
  light.shadow.camera.top    =  r;
  light.shadow.camera.bottom = -r;
  light.shadow.camera.far    = light.position.length() + r * 2;
  light.shadow.camera.updateProjectionMatrix();
}

function updateGridGround(size) {
  const span = Math.max(size.x, size.z) * 3.2;
  const gridSize = Math.max(12, Math.ceil(span / 2) * 2);
  const majorDivisions = Math.max(8, Math.round(gridSize / 10) * 4);
  const minorDivisions = majorDivisions * 2;

  gridGround.remove(gridMajor, gridMinor);
  gridMajor.geometry.dispose();
  gridMinor.geometry.dispose();

  gridMajor = new THREE.GridHelper(gridSize, majorDivisions, 0xffffff, 0xffffff);
  gridMajor.material.transparent = true;
  gridMajor.material.opacity = 0.5;
  gridMinor = new THREE.GridHelper(gridSize, minorDivisions, 0xffffff, 0xffffff);
  gridMinor.material.transparent = true;
  gridMinor.material.opacity = 0.5;

  gridGround.add(gridMinor, gridMajor);
  gridGround.position.y = -0.002;
  gridGround.position.x = 0;
  gridGround.position.z = 0;

  groundPlane.geometry.dispose();
  groundPlane.geometry = new THREE.PlaneGeometry(gridSize, gridSize);
}

function applyViewMode(mode) {
  currentViewMode = mode;
  cameraAzimuth = VIEW_MODES[mode].azimuth;
  cameraElevation = VIEW_MODES[mode].elevation;

  if (modelRoot) {
    fitCameraToObject(modelRoot);
    if (mode === 'top') {
      cameraTarget.x += VIEW_MODES.top.targetXOffset;
      applyZoom(VIEW_MODES.top.zoom);
    }
    return;
  }

  setIsoCameraPos();
  updateCameraFrustum();
  applyZoom(mode === 'top' ? VIEW_MODES.top.zoom : ZOOM_DEFAULT);
}

const loader = new GLTFLoader();
loader.load(
  '../boards.glb',
  (gltf) => {
    modelRoot = gltf.scene;

    // Collect mesh/material stats
    let meshCount = 0;
    modelRoot.traverse((obj) => {
      if (obj.isMesh) {
        meshCount++;
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.frustumCulled = false;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        const newMats = mats.map(m => {
          const phys = new THREE.MeshPhysicalMaterial({
            color: m.color ? m.color.clone() : new THREE.Color(0xdddddd),
            map: m.map || null,
            roughness: 0.82,
            metalness: 0.15,
            clearcoat: 0.2,
            clearcoatRoughness: 0.9,
          });
          if (m.normalMap) {
            phys.normalMap = m.normalMap;
            phys.normalScale = new THREE.Vector2(0.35, 0.35);
          }
          if (m.transparent && m.opacity < 1) {
            phys.transparent = true;
            phys.opacity = m.opacity;
            phys.alphaTest = 0.5;
          }
          materials.add(phys.uuid);
          return phys;
        });
        obj.material = Array.isArray(obj.material) ? newMats : newMats[0];
      }
    });

    // Apply rotation first, then compute bounding box with transforms applied
    modelRoot.rotation.y = Math.PI;
    scene.add(modelRoot);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(modelRoot);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());

    // Move model so bottom sits at y=0, centered in XZ
    modelRoot.position.set(-center.x, -box.min.y, -center.z);

    updateGridGround(size);
    fitCameraToObject(modelRoot);
    fitShadowCameraToScene(dirLight, scene);
    renderer.shadowMap.needsUpdate = true;

    // Inspector info (size in mm, assuming model is in meters)
    const toMM = v => Math.round(v * 1000);
    infoSize.textContent = `${toMM(size.x)} × ${toMM(size.z)} × ${toMM(size.y)} mm`;
    infoMeshes.textContent = String(meshCount);
    infoMaterials.textContent = String(materials.size);

    // Status chip → loaded
    statusText.textContent = 'Loaded';
    statusChip.style.cssText = '';

    // Dismiss loading
    loading.classList.add('fade-out');
    setTimeout(() => loading.remove(), 450);
  },
  undefined,
  (err) => {
    console.error(err);
    statusText.textContent = 'Load failed';
    statusChip.style.background = '#fef2f2';
    statusChip.style.borderColor = '#fca5a5';
    statusChip.style.color = '#b91c1c';
    statusChip.querySelector('.status-chip__dot').style.background = '#b91c1c';
    loading.textContent = 'Failed to load cpu.glb';
  }
);

// ── Render loop ─────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// ── Resize ──────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  updateCameraFrustum();
});

// wheel zoom disabled

// ── Mouse drag orbit ─────────────────────────────────────────
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartAz = 0;
let dragStartEl = 0;
const DRAG_SENSITIVITY = 0.005;
const EL_MIN = 0.09;   // ~5°
const EL_MAX = Math.PI / 2 - 0.09;  // ~85°

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragStartAz = cameraAzimuth;
  dragStartEl = cameraElevation;
  canvas.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  cameraAzimuth = dragStartAz - dx * DRAG_SENSITIVITY;
  cameraElevation = Math.min(EL_MAX, Math.max(EL_MIN, dragStartEl + dy * DRAG_SENSITIVITY));
  setIsoCameraPos();
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  canvas.style.cursor = '';
});

// ── Zoom chip click → reset ──────────────────────────────────
zoomChip.addEventListener('click', () => {
  if (modelRoot) {
    fitCameraToObject(modelRoot);
    return;
  }
  applyZoom(ZOOM_DEFAULT);
});

// ── Tool buttons ─────────────────────────────────────────────

btnViewSwitch.addEventListener('click', () => {
  applyViewMode(currentViewMode === 'oblique' ? 'top' : 'oblique');
});

// Zoom fit / reset
btnZoomFit.addEventListener('click', () => {
  if (modelRoot) {
    fitCameraToObject(modelRoot);
    return;
  }
  applyZoom(ZOOM_DEFAULT);
});

btnZoomIn.addEventListener('click', () => applyZoom(currentZoom + 0.15));
btnZoomOut.addEventListener('click', () => applyZoom(currentZoom - 0.15));

function openLibrary(name) {
  statusText.textContent = `${name} library opened`;
  statusChip.style.cssText = '';
}

btnLibBoards.addEventListener('click', () => openLibrary('Boards'));
btnLibChips.addEventListener('click', () => openLibrary('Chips'));
btnLibConnectors.addEventListener('click', () => openLibrary('Connectors'));

// Keep inspector toggle on status chip
let inspectorVisible = true;
statusChip.addEventListener('click', () => {
  inspectorVisible = !inspectorVisible;
  inspectorPanel.classList.toggle('is-hidden', !inspectorVisible);
});

// ── Light panel ───────────────────────────────────────────
let lightPanelOpen = true;
btnLightToggle.addEventListener('click', () => {
  lightPanelOpen = !lightPanelOpen;
  lightPanel.classList.toggle('is-collapsed', !lightPanelOpen);
});

sliderIntensity.addEventListener('input', () => {
  lightParams.intensity = parseFloat(sliderIntensity.value);
  valIntensity.textContent = lightParams.intensity.toFixed(1);
  updateDirLight();
});

sliderAzimuth.addEventListener('input', () => {
  lightParams.azimuth = parseInt(sliderAzimuth.value, 10);
  valAzimuth.textContent = lightParams.azimuth + '°';
  updateDirLight();
});

sliderElevation.addEventListener('input', () => {
  lightParams.elevation = parseInt(sliderElevation.value, 10);
  valElevation.textContent = lightParams.elevation + '°';
  updateDirLight();
});

// ── Camera panel ──────────────────────────────────────────
let cameraPanelOpen = true;
btnCameraToggle.addEventListener('click', () => {
  cameraPanelOpen = !cameraPanelOpen;
  cameraPanel.classList.toggle('is-collapsed', !cameraPanelOpen);
});

function syncCameraSlider() {
  const deg = Math.round(THREE.MathUtils.radToDeg(cameraAzimuth) % 360);
  const norm = ((deg % 360) + 360) % 360;
  sliderCameraAzimuth.value = norm;
  valCameraAzimuth.textContent = norm + '°';
  const elDeg = Math.round(THREE.MathUtils.radToDeg(cameraElevation));
  sliderCameraElevation.value = elDeg;
  valCameraElevation.textContent = elDeg + '°';
}

sliderCameraAzimuth.addEventListener('input', () => {
  cameraAzimuth = THREE.MathUtils.degToRad(parseInt(sliderCameraAzimuth.value, 10));
  valCameraAzimuth.textContent = sliderCameraAzimuth.value + '°';
  setIsoCameraPos();
});

sliderCameraElevation.addEventListener('input', () => {
  cameraElevation = THREE.MathUtils.degToRad(parseInt(sliderCameraElevation.value, 10));
  valCameraElevation.textContent = sliderCameraElevation.value + '°';
  setIsoCameraPos();
});

syncCameraSlider();

// ── Debug (console helpers) ─────────────────────────────────
window.debug = {
  get pos() { return camera.position.clone(); },
  get target() { return cameraTarget.clone(); },
  get azimuth() { return cameraAzimuth; },
  get elevation() { return THREE.MathUtils.radToDeg(cameraElevation); },
  get zoom() { return currentZoom; },
  get distance() { return cameraDistance; },
  setAzimuth(deg) { cameraAzimuth = THREE.MathUtils.degToRad(deg); setIsoCameraPos(); },
  setElevation(deg) { cameraElevation = THREE.MathUtils.degToRad(deg); setIsoCameraPos(); },
  setZoom(z) { applyZoom(z); },
};
// 把这些也暴露到全局，控制台就能用了
window.THREE = THREE;
window.directionalLight = directionalLight;   // 顺便把光源也暴露（后面调阴影用）