import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

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

// Ground grid — shader-based (anti-aliased, no WebGL line artifacts)
const gridMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 16),
  new THREE.ShaderMaterial({
    uniforms: {
      majorSpacing: { value: 1.0 },
      majorColor:   { value: new THREE.Color(0xb8c6d8) },
      majorOpacity: { value: 0.7 },
    },
    vertexShader: `
      varying vec2 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float majorSpacing;
      uniform vec3  majorColor;
      uniform float majorOpacity;
      varying vec2 vWorldPos;

      float gridLine(vec2 pos, float spacing) {
        vec2 d = fwidth(pos / spacing) * 1.5;
        vec2 g = abs(fract(pos / spacing - 0.5) - 0.5) / d;
        return 1.0 - clamp(min(g.x, g.y), 0.0, 1.0);
      }

      void main() {
        float major = gridLine(vWorldPos, majorSpacing);
        float alpha = major * majorOpacity;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(majorColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  })
);
gridMesh.rotation.x = -Math.PI / 2;
gridMesh.position.y = -0.002;
scene.add(gridMesh);

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
dirLight.shadow.normalBias = 0;
dirLight.shadow.radius = 2;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

const helper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(helper);

// Light control state
const LIGHT_DIST = 80;
const lightParams = { intensity: 3.2, azimuth: 330, elevation: 12 };

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

// ── Post-processing composer (silhouette outline) ────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Always-on black outline for all boards
const _dpr = window.devicePixelRatio;
const outlinePassAll = new OutlinePass(
  new THREE.Vector2(window.innerWidth * _dpr, window.innerHeight * _dpr), scene, camera
);
outlinePassAll.edgeStrength = 0.8;
outlinePassAll.edgeGlow = 0;
outlinePassAll.edgeThickness = 1.0;
outlinePassAll.pulsePeriod = 0;
outlinePassAll.visibleEdgeColor.set(0x000000);
outlinePassAll.hiddenEdgeColor.set(0x000000);
outlinePassAll.selectedObjects = [];
composer.addPass(outlinePassAll);

// Selected board — blue accent outline on top
const outlinePassSelected = new OutlinePass(
  new THREE.Vector2(window.innerWidth * _dpr, window.innerHeight * _dpr), scene, camera
);
outlinePassSelected.edgeStrength = 8;
outlinePassSelected.edgeGlow = 0;
outlinePassSelected.edgeThickness = 4.0;
outlinePassSelected.pulsePeriod = 0;
const selColor = new THREE.Color(0x0035D3).convertSRGBToLinear();
outlinePassSelected.visibleEdgeColor.copy(selColor);
outlinePassSelected.hiddenEdgeColor.copy(selColor);
outlinePassSelected.selectedObjects = [];
composer.addPass(outlinePassSelected);

composer.addPass(new OutputPass());

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
const selectableObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentOutline = null;

// Board-level state
const boards = [];
let selectedBoard = null;

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

function clearOutline() {
  if (!currentOutline) return;
  scene.remove(currentOutline);
  currentOutline = null;
}

function addOutline(mesh) {
  clearOutline();

  const outline = mesh.clone();
  outline.material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.BackSide,
    depthTest: false
  });

  const thickness = 0.015;
  outline.scale.setScalar(1 + thickness);
  outline.position.copy(mesh.position);
  outline.quaternion.copy(mesh.quaternion);
  outline.userData.original = mesh;

  if (mesh.parent) {
    mesh.parent.add(outline);
  } else {
    scene.add(outline);
  }
  currentOutline = outline;
}

function updateGridGround(size) {
  const span = Math.max(size.x, size.z) * 3.2;
  const gridSize = Math.max(12, Math.ceil(span / 2) * 2);
  const majorDivisions = Math.max(8, Math.round(gridSize / 10) * 4);
  const majorStep = gridSize / majorDivisions;

  gridMesh.geometry.dispose();
  gridMesh.geometry = new THREE.PlaneGeometry(gridSize, gridSize);
  gridMesh.material.uniforms.majorSpacing.value = majorStep;

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

// ── Board detection & highlighting ──────────────────────────
const BOARD_NAMES = ['IO Board', 'BMC Board', 'IO Board', 'Extension Board', 'Base Board', 'Rear Board', 'HDD Board'];

function findBoardGroups(root) {
  const hasMesh = (node) => { let ok = false; node.traverse(o => { if (o.isMesh) ok = true; }); return ok; };
  const direct = root.children.filter(hasMesh);
  if (direct.length >= 5) return direct;
  const deeper = [];
  root.children.forEach(c => c.children.forEach(gc => { if (hasMesh(gc)) deeper.push(gc); }));
  return deeper.length >= 5 ? deeper : direct;
}

function makeGroundLabel(name) {
  const dpr = 2;
  const H = 44 * dpr;
  const fontSize = 24 * dpr;
  const padX = 16 * dpr;
  const radius = 10 * dpr;

  const offscreen = document.createElement('canvas');
  const ctx = offscreen.getContext('2d');
  ctx.font = `700 ${fontSize}px Inter, sans-serif`;
  const textW = ctx.measureText(name).width;
  offscreen.width = textW + padX * 2;
  offscreen.height = H;

  ctx.font = `700 ${fontSize}px Inter, sans-serif`;
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(0, 0, offscreen.width, H, radius);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, padX, H / 2);

  const texture = new THREE.CanvasTexture(offscreen);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const aspect = offscreen.width / offscreen.height;
  const worldH = 0.018;
  const worldW = worldH * aspect;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(worldW, worldH),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.05 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.renderOrder = 2;
  return plane;
}

function getMeshes(group) {
  const list = [];
  group.traverse(o => { if (o.isMesh) list.push(o); });
  return list;
}

function setupBoards(root) {
  scene.updateMatrixWorld(true);
  const groups = findBoardGroups(root);
  console.log(`[Boards] Found ${groups.length} groups`);

  const items = groups.map(group => {
    const box = new THREE.Box3().setFromObject(group);
    return { group, box, center: box.getCenter(new THREE.Vector3()) };
  });

  // Sort by world X asc (left→right), same column → Y desc (top first)
  items.sort((a, b) => {
    const dx = a.center.x - b.center.x;
    if (Math.abs(dx) > 0.02) return dx;
    return b.center.y - a.center.y;
  });

  const allMeshes = [];

  items.forEach((item, i) => {
    const name = BOARD_NAMES[i] || `Board ${i + 1}`;
    const { box, center } = item;
    const meshes = getMeshes(item.group);
    allMeshes.push(...meshes);

    // Ground label (canvas texture, lies flat with perspective)
    const label = makeGroundLabel(name);
    // Position at near edge of board footprint (min.z side = camera-facing)
    label.position.set(center.x, 0.001, box.min.z - 0.01);
    scene.add(label);

    boards.push({ group: item.group, box, center, name, meshes, label });
    console.log(`[Boards] ${i}: "${name}" x=${center.x.toFixed(3)} y=${center.y.toFixed(3)} z=${center.z.toFixed(3)}`);
  });

  // Feed all board meshes to the always-on outline pass
  outlinePassAll.selectedObjects = allMeshes;
  window.debug.boards = boards;
}


const loader = new GLTFLoader();
loader.load(
  './boards.glb',
  (gltf) => {
    modelRoot = gltf.scene;
    selectableObjects.length = 0;

    // Collect mesh/material stats
    let meshCount = 0;
    modelRoot.traverse((obj) => {
      if (obj.isMesh) {
        meshCount++;
        selectableObjects.push(obj);
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
    setupBoards(modelRoot);

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
  composer.render();
}
animate();

// ── Resize ──────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  const dpr = window.devicePixelRatio;
  renderer.setSize(w, h);
  composer.setSize(w * dpr, h * dpr);
  outlinePassAll.setSize(w * dpr, h * dpr);
  outlinePassSelected.setSize(w * dpr, h * dpr);
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
window.directionalLight = dirLight;

const rendererCanvas = renderer.domElement;
rendererCanvas.addEventListener('mousemove', (event) => {
  if (!modelRoot || selectableObjects.length === 0 || boards.length === 0) return;

  const rect = rendererCanvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(selectableObjects, true);

  if (intersects.length === 0) {
    outlinePassSelected.selectedObjects = [];
    return;
  }

  const hit = intersects[0].object;
  const board = boards.find(b => {
    let found = false;
    b.group.traverse(o => { if (o === hit) found = true; });
    return found;
  });

  outlinePassSelected.selectedObjects = board ? board.meshes : [];
});
