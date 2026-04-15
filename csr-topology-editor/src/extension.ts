import * as vscode from 'vscode';

import { CsrTopologyEditorProvider } from './editorProvider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new CsrTopologyEditorProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      CsrTopologyEditorProvider.viewType,
      provider,
      {
        webviewOptions: { retainContextWhenHidden: true },
        supportsMultipleEditorsPerDocument: false,
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('csrTopology.openEditor', () => {
      vscode.commands.executeCommand(
        'vscode.openWith',
        vscode.window.activeTextEditor?.document.uri,
        CsrTopologyEditorProvider.viewType
      );
    })
  );
}

export function deactivate() {}
