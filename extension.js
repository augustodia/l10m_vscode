const vscode = require("vscode");
const cp = require("child_process");
const path = require("path");

let outputChannel = vscode.window.createOutputChannel("l10m");

function executeCommand(command, rootPath) {
  cp.exec(
    command,
    { cwd: rootPath, env: process.env },
    (error, stdout, stderr) => {
      if (error) {
        outputChannel.appendLine(
          `Error while executing the command: ${command}. Error: ${error.message}`
        );

        vscode.window.showErrorMessage(
          `Error while executing the command: ${command}`,
          {
            detail: error.message,
          }
        );

        outputChannel.show();

        return;
      }

      vscode.window.showInformationMessage(
        `Command executed successfully: ${stdout}`
      );

      outputChannel.appendLine(`Command executed successfully: ${stdout}`);
      outputChannel.show();
    }
  );
}

function activate(context) {
  let watcher = vscode.workspace.createFileSystemWatcher("**/*.arb");

  watcher.onDidChange((uri) => {
    try {
      let commandToRun = vscode.workspace
        .getConfiguration("l10m")
        .get("command");
      let commandParts = commandToRun.split(" ");

      let moduleArgIndex = commandParts.indexOf("-m");
      let modulePath = path.join("lib", "modules");

      if (moduleArgIndex !== -1) {
        const modulePathArray = commandParts[moduleArgIndex + 1].split("/");
        modulePath = path.join(...modulePathArray);
      }

      let arbPath = uri.fsPath;

      let rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

      let isModulePath = arbPath.includes(modulePath);
      let isRootPath = arbPath.includes(path.join("lib", "l10n"));
      let generateRoot = !commandParts.includes("--no-generate-root");

      if (isRootPath && generateRoot) {
        executeCommand(`${commandToRun} --generate-only-root`, rootPath);
        return;
      }

      if (!arbPath.includes(modulePath))
        throw new Error("The arb file is not in the module path");

      let relativePath = path.relative(rootPath, arbPath);
      let featureName = relativePath.split(path.sep)[2];

      if (isModulePath && featureName) {
        executeCommand(
          `${commandToRun} -g ${featureName} --generate-only-module`,
          rootPath
        );
        return;
      }

      executeCommand(commandToRun, rootPath);
    } catch (error) {
      outputChannel.appendLine(`Error: ${error.message}`);

      vscode.window.showErrorMessage(error.message, {
        detail: error.message,
      });

      outputChannel.show();
    }
  });

  context.subscriptions.push(watcher);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
