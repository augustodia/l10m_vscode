const vscode = require("vscode");
const cp = require("child_process");
const path = require("path");

const CONFIG_SECTION = "l10m";
const COMMAND_KEY = "command";
const OUTPUT_CHANNEL_NAME = "l10m";

const outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);

function activate(context) {
  const watcher = vscode.workspace.createFileSystemWatcher("**/*.arb");
  const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

  watcher.onDidChange((uri) => handleArbFileChange(uri, workspaceRoot));

  context.subscriptions.push(watcher);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

function handleArbFileChange(uri, workspaceRoot) {
  try {
    const commandToRun = getCommandToRun();
    const commandParts = commandToRun.split(" ");

    const modulePath = getModulePath(commandParts);
    const generateRoot = !commandParts.includes("--no-generate-root");

    const arbFilePath = uri.fsPath;

    const isModulePath = arbFilePath.includes(modulePath);
    const isRootPath = arbFilePath.includes(path.join("lib", "l10n"));

    if (isRootPath && generateRoot) {
      const command = `${commandToRun} --generate-only-root`;
      executeCommand(command, workspaceRoot);
      return;
    }

    if (!isModulePath) {
      throw new Error("The arb file is not in the module path");
    }

    const featureName = getFeatureName(arbFilePath, workspaceRoot, modulePath);

    if (featureName) {
      const command = `${commandToRun} -g ${featureName} --generate-only-module`;
      executeCommand(command, workspaceRoot);
      return;
    }

    executeCommand(commandToRun, workspaceRoot);
  } catch (error) {
    logError(error);
  }
}

function getCommandToRun() {
  return vscode.workspace.getConfiguration(CONFIG_SECTION).get(COMMAND_KEY);
}

function getModulePath(commandParts) {
  const moduleArgIndex = commandParts.indexOf("-m");
  if (moduleArgIndex !== -1 && commandParts.length > moduleArgIndex + 1) {
    const modulePathInput = commandParts[moduleArgIndex + 1];
    const modulePathArray = modulePathInput.split(/[\\/]/);
    return path.join(...modulePathArray);
  }
  return path.join("lib", "modules");
}

function getFeatureName(arbFilePath, workspaceRoot, modulePath) {
  const relativePath = path.relative(
    path.join(workspaceRoot, modulePath),
    arbFilePath
  );
  const pathSegments = relativePath.split(path.sep);
  return pathSegments[0];
}

function executeCommand(command, workingDirectory) {
  outputChannel.appendLine(`Executing command: ${command}`);
  vscode.window.setStatusBarMessage(`Executing command: ${command}`, 5000);

  cp.exec(
    command,
    { cwd: workingDirectory, env: process.env },
    (error, stdout) => {
      if (error) {
        logCommandError(command, error);
        return;
      }

      logCommandSuccess(command, stdout);
    }
  );
}

function logCommandError(command, error) {
  const message = `Error while executing the command: ${command}. Error: ${error.message}`;
  outputChannel.appendLine(message);
  vscode.window.setStatusBarMessage(message, 5000);
  outputChannel.show(true);
}

function logCommandSuccess(command, stdout) {
  const message = `Command executed successfully: ${command}\nOutput: ${stdout}`;
  outputChannel.appendLine(message);
  vscode.window.setStatusBarMessage(
    `Command executed successfully: ${command}`,
    5000
  );
  outputChannel.show(true);
}

function logError(error) {
  const message = `Error: ${error.message}`;
  outputChannel.appendLine(message);
  vscode.window.setStatusBarMessage(message, 5000);
  outputChannel.show(true);
}

module.exports = {
  activate,
  deactivate,
  handleArbFileChange,
  outputChannel,
};
