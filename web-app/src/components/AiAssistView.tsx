import { withBase } from '../base';

export function AiAssistView() {
  return (
    <iframe
      src={withBase('ai-assist.html')}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="AI 助手"
    />
  );
}
