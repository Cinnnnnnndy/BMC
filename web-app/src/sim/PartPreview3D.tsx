/**
 * PartPreview3D — small interactive 3D preview of a single CatalogPart.
 *
 * Used inside the CatalogBrowser detail pane. Auto-frames the part (works for
 * anything from a DIMM to a PSU) and renders it through CatalogPartModel, so it
 * exercises the exact same GLB-first / procedural-fallback pipeline the main
 * scene will use.
 */
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Bounds, Environment, ContactShadows } from '@react-three/drei';
import { CatalogPartModel } from './CatalogPartModel';
import type { CatalogPart } from './hardware-library';

export function PartPreview3D({
  part,
  height = 200,
}: {
  part: CatalogPart;
  height?: number;
}) {
  const hasGLB = !!part.glbModelPath;

  return (
    <div style={{ position: 'relative', width: '100%', height, background: '#0a0c12' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [3, 2.2, 3.4], fov: 32 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0a0c12']} />

        {/* Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#cfe0ff" />
        <Environment preset="warehouse" />

        {/* Auto-framed part */}
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <CatalogPartModel part={part} key={part.id} />
          </Bounds>
        </Suspense>

        {/* Soft ground shadow */}
        <ContactShadows position={[0, -0.9, 0]} opacity={0.45} scale={8} blur={2.4} far={3} />

        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={9}
          autoRotate
          autoRotateSpeed={0.45}
        />
      </Canvas>

      {/* Source badge */}
      <div style={{
        position: 'absolute', top: 8, left: 8,
        fontSize: 9, fontWeight: 600,
        padding: '2px 7px', borderRadius: 4,
        background: hasGLB ? 'rgba(52,211,153,0.15)' : 'rgba(148,163,184,0.12)',
        color: hasGLB ? '#34d399' : 'rgba(200,215,255,0.5)',
        border: `1px solid ${hasGLB ? 'rgba(52,211,153,0.35)' : 'rgba(148,163,184,0.25)'}`,
        pointerEvents: 'none',
      }}>
        {hasGLB ? '● 开源 GLB 模型' : '○ 程序化几何'}
      </div>

      {/* Drag hint */}
      <div style={{
        position: 'absolute', bottom: 8, right: 8,
        fontSize: 9, color: 'rgba(200,215,255,0.3)',
        pointerEvents: 'none',
      }}>
        拖动旋转 · 滚轮缩放
      </div>
    </div>
  );
}
