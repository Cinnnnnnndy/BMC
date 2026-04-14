export function getWebviewContent(webviewUri: { toString(): string }): string {
  const base = webviewUri.toString();
  const scriptUri = `${base}/index.js`;
  const styleUri = `${base}/index.css`;
  const csp = `default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' ${base}; style-src 'unsafe-inline' ${base};`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <link rel="stylesheet" href="${styleUri}">
  <title>CSR 拓扑编辑器</title>
</head>
<body>
  <div id="root"></div>
  <script src="${scriptUri}"></script>
</body>
</html>`;
}
