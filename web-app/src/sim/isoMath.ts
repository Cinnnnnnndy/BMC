export const TILE_W = 64;
export const TILE_H = 32;
export const TILE_Z = 40;

export interface GridCoord {
  gx: number;
  gy: number;
  gz: number;
}

/**
 * Convert isometric grid coordinates to screen (pixel) coordinates.
 * x-axis goes right-down, y-axis goes left-down, z-axis goes up.
 */
export function gridToScreen(
  gx: number,
  gy: number,
  gz: number,
  offsetX = 0,
  offsetY = 0,
): { x: number; y: number } {
  return {
    x: (gx - gy) * (TILE_W / 2) + offsetX,
    y: (gx + gy) * (TILE_H / 2) - gz * TILE_Z + offsetY,
  };
}
