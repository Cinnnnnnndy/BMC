import type { CSRDocument } from '../types';
import { SimView } from '../sim/SimView';
// Simulator-specific styles — only loaded when this chunk is first opened
import '../styles/simulator.css';

interface Props {
  csr: CSRDocument;
}

export function Simulator({ csr: _ }: Props) {
  return <SimView />;
}
