import * as vscode from 'vscode';

import { getWebviewContent } from './webviewContent';

export class CsrTopologyEditorProvider implements vscode.CustomReadonlyEditorProvider<vscode.CustomDocument> {
  static readonly viewType = 'csrTopologyEditor';

  constructor(private readonly _extensionUri: vscode.Uri) {}

  async openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken
  ): Promise<vscode.CustomDocument> {
    return { uri, dispose: () => {} };
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    const fileContent = await vscode.workspace.fs.readFile(document.uri);
    const initialContent = new TextDecoder().decode(fileContent);

    const webviewUri = webviewPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'web-app', 'dist')
    );

    webviewPanel.webview.html = getWebviewContent(webviewUri);

    webviewPanel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'getInitialContent':
          webviewPanel.webview.postMessage({
            type: 'initialContent',
            content: initialContent,
            uri: document.uri.toString(),
          });
          break;
        case 'saveContent':
          const edit = new vscode.WorkspaceEdit();
          const textDoc = await vscode.workspace.openTextDocument(document.uri);
          const fullRange = new vscode.Range(0, 0, textDoc.lineCount, 0);
          edit.replace(document.uri, fullRange, message.content);
          await vscode.workspace.applyEdit(edit);
          vscode.window.showInformationMessage('CSR 文件已保存');
          break;
        case 'openFile':
          try {
            const targetUri = vscode.Uri.parse(message.uri);
            const targetContent = await vscode.workspace.fs.readFile(targetUri);
            const json = JSON.parse(new TextDecoder().decode(targetContent));
            webviewPanel.webview.postMessage({
              type: 'eventDefLoaded',
              eventDef: json,
            });
          } catch (e) {
            webviewPanel.webview.postMessage({
              type: 'error',
              message: String(e),
            });
          }
          break;
        default:
          break;
      }
    });
  }
}
