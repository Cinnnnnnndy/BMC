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
const btnView25d   = document.getElementById('btn-view-25d');
const btnViewTop   = document.getElementById('btn-view-top');
const btnWire      = document.getElementById('btn-wire');
const btnReset     = document.getElementById('btn-reset');
const btnInfo      = document.getElementById('btn-info');

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
  new THREE.PlaneGeometry(4, 4),
  new THREE.MeshStandardMaterial({ color: 0xe3e9ee, roughness: 0.96, metalness: 0.0 })
);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -0.012;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

// Ground grid
const gridGround = new THREE.Group();
let gridMajor = new THREE.GridHelper(4, 4, 0xb8c6d8, 0xd7e0ea);
gridMajor.material.transparent = true;
gridMajor.material.opacity = 0.9;
let gridMinor = new THREE.GridHelper(4, 16, 0xdfe6ef, 0xe9eef5);
gridMinor.material.transparent = true;
gridMinor.material.opacity = 0.5;
gridGround.add(gridMinor, gridMajor);
scene.add(gridGround);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 1.08);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xfffcf5, 2.35);
dirLight.position.set(7.5, 4.2, 6.8);
dirLight.castShadow = true;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
dirLight.shadow.camera.left = -12;
dirLight.shadow.camera.right = 12;
dirLight.shadow.camera.top = 12;
dirLight.shadow.camera.bottom = -12;
dirLight.shadow.bias = -0.0002;
dirLight.shadow.normalBias = 0.02;
dirLight.shadow.radius = 5;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xddeaff, 0.85);
fillLight.position.set(-4.8, 2.9, -5.6);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xf8fbff, 0xe4eaf2, 0.42);
scene.add(hemiLight);

// ── Camera ──────────────────────────────────────────────────
const aspect = window.innerWidth / window.innerHeight;
const frustum = 1.4;
const camera = new THREE.OrthographicCamera(
  -frustum * aspect, frustum * aspect,
  frustum, -frustum,
  -100, 100
);

const VIEW_MODES = {
  oblique: {
    azimuth: Math.PI / 4,
    elevation: Math.atan(1 / Math.sqrt(2)),  // 35.26° true isometric
    targetYOffset: 0.18
  },
  top: {
    azimuth: Math.PI / 4,
    elevation: Math.PI / 2,
    targetYOffset: 0.02
  }
};
const CAM_DIST = 8;
const cameraTarget = new THREE.Vector3(0, 0, 0);
let cameraBaseHalfHeight = frustum;
let currentViewMode = 'oblique';
let cameraAzimuth = VIEW_MODES.oblique.azimuth;
let cameraElevation = VIEW_MODES.oblique.elevation;

function setIsoCameraPos() {
  camera.position.set(
    CAM_DIST * Math.cos(cameraElevation) * Math.sin(cameraAzimuth),
    CAM_DIST * Math.sin(cameraElevation),
    CAM_DIST * Math.cos(cameraElevation) * Math.cos(cameraAzimuth)
  );
  camera.lookAt(cameraTarget);
}

function updateCameraFrustum() {
  const viewportAspect = window.innerWidth / window.innerHeight;
  camera.top = cameraBaseHalfHeight;
  camera.bottom = -cameraBaseHalfHeight;
  camera.left = -cameraBaseHalfHeight * viewportAspect;
  camera.right = cameraBaseHalfHeight * viewportAspect;
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
  camera.zoom = currentZoom;
  camera.updateProjectionMatrix();
  const pct = Math.round(currentZoom * 100) + '%';
  zoomChip.textContent = pct;
  infoZoom.textContent = pct;
}

applyZoom(ZOOM_DEFAULT);

// ── Model ───────────────────────────────────────────────────
let modelRoot = null;
let wireframeOn = false;
const materials = new Set();

function fitCameraToObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const margin = 1.08;
  const corners = [
    new THREE.Vector3(box.min.x, box.min.y, box.min.z),
    new THREE.Vector3(box.min.x, box.min.y, box.max.z),
    new THREE.Vector3(box.min.x, box.max.y, box.min.z),
    new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    new THREE.Vector3(box.max.x, box.min.y, box.max.z),
    new THREE.Vector3(box.max.x, box.max.y, box.min.z),
    new THREE.Vector3(box.max.x, box.max.y, box.max.z)
  ];

  const view = VIEW_MODES[currentViewMode];
  cameraTarget.set(0, size.y * view.targetYOffset, 0);
  setIsoCameraPos();
  camera.updateMatrixWorld(true);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const corner of corners) {
    const projected = corner.clone().sub(center).applyMatrix4(camera.matrixWorldInverse);
    minX = Math.min(minX, projected.x);
    maxX = Math.max(maxX, projected.x);
    minY = Math.min(minY, projected.y);
    maxY = Math.max(maxY, projected.y);
  }

  const viewWidth = (maxX - minX) * margin;
  const viewHeight = (maxY - minY) * margin;
  const viewportAspect = window.innerWidth / window.innerHeight;
  cameraBaseHalfHeight = Math.max(viewHeight / 2, viewWidth / (2 * viewportAspect), 0.01);
  updateCameraFrustum();
  applyZoom(ZOOM_DEFAULT);
}

function updateGridGround(size) {
  const span = Math.max(size.x, size.z) * 0.8;
  const gridSize = Math.max(3, Math.ceil(span / 2) * 2);
  const majorDivisions = Math.max(2, Math.round(gridSize / 10));
  const minorDivisions = majorDivisions;

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
  btnView25d.classList.toggle('is-active', mode === 'oblique');
  btnViewTop.classList.toggle('is-active', mode === 'top');

  if (modelRoot) {
    fitCameraToObject(modelRoot);
    return;
  }

  setIsoCameraPos();
  updateCameraFrustum();
  applyZoom(ZOOM_DEFAULT);
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
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(m => materials.add(m.uuid));
      }
    });

    // Bounding box → center and land
    const box = new THREE.Box3().setFromObject(modelRoot);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());

    // Move model so bottom sits at y=0, centered in XZ
    modelRoot.position.set(-center.x, -box.min.y, -center.z);
    scene.add(modelRoot);

    updateGridGround(size);
    fitCameraToObject(modelRoot);

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

// ── Wheel zoom ───────────────────────────────────────────────
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.08 : 0.08;
  applyZoom(currentZoom + delta);
}, { passive: false });

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
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragStartAz = cameraAzimuth;
  dragStartEl = cameraElevation;
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  cameraAzimuth = dragStartAz - dx * DRAG_SENSITIVITY;
  cameraElevation = Math.min(EL_MAX, Math.max(EL_MIN, dragStartEl - dy * DRAG_SENSITIVITY));
  setIsoCameraPos();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = '';
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  canvas.style.cursor = '';
});

// ── Zoom chip click → reset ──────────────────────────────────
zoomChip.addEventListener('click', () => applyZoom(ZOOM_DEFAULT));

// ── Tool buttons ─────────────────────────────────────────────

btnView25d.addEventListener('click', () => {
  applyViewMode('oblique');
});

btnViewTop.addEventListener('click', () => {
  applyViewMode('top');
});

// Wireframe toggle
btnWire.addEventListener('click', () => {
  wireframeOn = !wireframeOn;
  btnWire.classList.toggle('is-active', wireframeOn);
  if (modelRoot) {
    modelRoot.traverse((obj) => {
      if (obj.isMesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(m => { m.wireframe = wireframeOn; });
      }
    });
  }
});

// Reset zoom
btnReset.addEventListener('click', () => {
  if (modelRoot) {
    fitCameraToObject(modelRoot);
    return;
  }
  applyZoom(ZOOM_DEFAULT);
});

// Info panel toggle
let inspectorVisible = true;
btnInfo.addEventListener('click', () => {
  inspectorVisible = !inspectorVisible;
  inspectorPanel.classList.toggle('is-hidden', !inspectorVisible);
  btnInfo.classList.toggle('is-active', inspectorVisible);
});
