import type { ReactNode } from 'react';
import type { BoardMaterial, ServerPart } from './simulatorParts';

interface Props {
  part: ServerPart;
  children: ReactNode;
}

/** 建筑轴侧体块：顶面 + 两向挤出，模拟等轴测中的“板厚” */
export function SimulatorBoardPrism({ part, children }: Props) {
  const d = part.depth;
  const mat = part.material as BoardMaterial;
  return (
    <div
      className={`sim-board-prism sim-board-mat--${mat}`}
      style={{ '--prism-depth': `${d}px` } as React.CSSProperties}
    >
      <div className="sim-board-top">
        {children}
      </div>
      <div className="sim-board-side sim-board-side--s" aria-hidden />
      <div className="sim-board-side sim-board-side--w" aria-hidden />
    </div>
  );
}
