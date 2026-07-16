import { withBase } from '../base';

export function BmcEnvView() {
  return (
    <iframe
      src={withBase('bmc-env.html')}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="BMC 环境管理"
    />
  );
}
