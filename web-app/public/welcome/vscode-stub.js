// VS Code API stub for standalone web context
function acquireVsCodeApi() {
  return {
    postMessage: function(msg) {
      if (msg.command === 'openLink' && msg.url) {
        window.open(msg.url, '_blank', 'noopener,noreferrer');
      }
      // All other commands (openFile, newFile, update, workflowAction, etc.)
      // are no-ops in the web app context
    },
    getState: function() { return null; },
    setState: function() {},
  };
}

// FeatureDialog stub — feature dialog is not ported to the web app
var FeatureDialog = {
  init: function() {},
  show: function() {},
};
