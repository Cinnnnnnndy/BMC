/**
 * CatalogPartModel — reusable, canvas-agnostic renderer for a CatalogPart.
 *
 * Decision flow (the "open-source-model-first" pipeline):
 *   1. part.glbModelPath set?  → load the real GLB (KiCad / GrabCAD / OCP / Sketchfab)
 *   2. otherwise               → generate procedural geometry from dimensionsMM
 *
 * In BOTH cases the data-driven `renderStyle` (material preset + outline) is
 * applied, so a part's look can be refined from a verbal description without
 * editing this file.
 *
 * This component renders ONLY meshes (no <Canvas>), so it can be dropped into
 * the small catalog preview now and reused inside the main IsoCanvas later.
 */
import { Suspense, useMemo } from 'react';
import { useGLTF, RoundedBox, Edges } from '@react-three/drei';
import * as THREE from 'three';
import {
  toScene,
  resolveStyle,
  applyStatusToStyle,
  resolvePartModelUrl,
  type CatalogPart,
  type ResolvedStyle,
} from './hardware-library';

type PartStatus = 'normal' | 'warning' | 'error' | 'offline';

interface ModelProps {
  part: CatalogPart;
  status?: PartStatus;
  /** Override the resolved style (e.g., live editing from a UI) */
  styleOverride?: Partial<ResolvedStyle>;
}

// ─── Shared PBR material element from a resolved style ─────────────────────────
function StyledMaterial({ style }: { style: ResolvedStyle }) {
  const m = style.material;
  return (
    <meshPhysicalMaterial
      color={m.color}
      metalness={m.metalness}
      roughness={m.roughness}
      clearcoat={m.clearcoat}
      clearcoatRoughness={0.6}
      transparent={m.transparent}
      opacity={m.opacity}
      emissive={new THREE.Color(m.emissive)}
      emissiveIntensity={m.emissiveIntensity}
      envMapIntensity={0.7}
    />
  );
}

// ─── Procedural fallback: a rounded box sized from dimensionsMM ───────────────
function ProceduralModel({ part, style }: { part: CatalogPart; style: ResolvedStyle }) {
  const w = toScene(part.dimensionsMM.width);
  const h = toScene(part.dimensionsMM.height);
  const d = toScene(part.dimensionsMM.depth);
  const radius = Math.min(w, h, d) * 0.06;

  return (
    <group scale={style.scale}>
      <RoundedBox
        args={[w, h, d]}
        radius={radius}
        smoothness={3}
        castShadow={style.castShadow}
        receiveShadow={style.receiveShadow}
      >
        <StyledMaterial style={style} />
        {style.outline.enabled && (
          <Edges
            threshold={style.outline.edgeThresholdDeg}
            color={style.outline.color}
            lineWidth={style.outline.thickness}
          />
        )}
      </RoundedBox>
    </group>
  );
}

// ─── GLB model: load + apply material/outline overrides ───────────────────────
function GLBModel({ part, url, style }: { part: CatalogPart; url: string; style: ResolvedStyle }) {
  const { scene } = useGLTF(url);

  // Clone so multiple instances / restyling don't mutate the cached original.
  const cloned = useMemo(() => {
    const root = scene.clone(true);

    // Orientation fix for the downloaded model (one line per part in the catalog).
    // Applied here so the auto-fit box below is measured AFTER rotation.
    const r = part.modelRotationDeg;
    if (r) {
      root.rotation.set(
        (r[0] * Math.PI) / 180,
        (r[1] * Math.PI) / 180,
        (r[2] * Math.PI) / 180,
      );
      root.updateMatrixWorld(true);
    }

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = style.castShadow;
      mesh.receiveShadow = style.receiveShadow;

      // Only override the GLB's own materials when the part explicitly
      // requests a style (preset or fillColor). Otherwise keep authored look.
      const wantsOverride = !!(part.renderStyle?.material || part.renderStyle?.fillColor);
      if (wantsOverride) {
        const m = style.material;
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(m.color),
          metalness: m.metalness,
          roughness: m.roughness,
          clearcoat: m.clearcoat,
          transparent: m.transparent,
          opacity: m.opacity,
          emissive: new THREE.Color(m.emissive),
          emissiveIntensity: m.emissiveIntensity,
        });
      } else if (style.material.transparent) {
        // Still honor offline-style transparency on authored materials
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.transparent = true;
          mat.opacity = style.material.opacity;
        }
      }
    });
    return root;
  }, [scene, part.renderStyle, part.modelRotationDeg, style]);

  // Auto-fit: scale ANY downloaded model (metres / mm / arbitrary units) so its
  // largest dimension matches the part's real size, and recenter it at origin.
  // This means you can drop in a model at any scale and it "just works".
  const { offset, fit } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const targetMax = Math.max(
      toScene(part.dimensionsMM.width),
      toScene(part.dimensionsMM.height),
      toScene(part.dimensionsMM.depth),
    );
    const glbMax = Math.max(size.x, size.y, size.z) || 1;
    return { offset: center, fit: targetMax / glbMax };
  }, [cloned, part.dimensionsMM]);

  return (
    <group scale={style.scale * fit}>
      <primitive object={cloned} position={[-offset.x, -offset.y, -offset.z]} />
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export function CatalogPartModel({ part, status, styleOverride }: ModelProps) {
  const resolved = useMemo(() => {
    const base = applyStatusToStyle(resolveStyle(part), status);
    return { ...base, ...styleOverride };
  }, [part, status, styleOverride]);

  // Primary source: auto-detected file in models/ named "<part.id>.glb".
  // Fallback: an explicit glbModelPath on the part (legacy / external URL).
  const url = resolvePartModelUrl(part.id) ?? part.glbModelPath;

  if (url) {
    return (
      <Suspense fallback={<ProceduralModel part={part} style={resolved} />}>
        <GLBModel part={part} url={url} style={resolved} />
      </Suspense>
    );
  }

  return <ProceduralModel part={part} style={resolved} />;
}
