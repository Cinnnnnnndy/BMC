import type { CSRDocument } from '../types';
import { SimView } from '../sim/SimView';

interface Props {
  csr: CSRDocument;
}

export function Simulator({ csr: _ }: Props) {
  return <SimView />;
}
