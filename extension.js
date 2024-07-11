const vscode = require("vscode");
const cp = require("child_process");

let outputChannel = vscode.window.createOutputChannel("l10m");
function executeCommand(command, rootPath) {
  cp.exec(command, { cwd: rootPath }, (error, stdout) => {
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
  });
}

function activate(context) {
  // Cria um observador de arquivos para arquivos .arb
  let watcher = vscode.workspace.createFileSystemWatcher("**/*.arb");

  // Executa o comando quando um arquivo .arb é alterado
  watcher.onDidChange((uri) => {
    try {
      let commandToRun = vscode.workspace
        .getConfiguration("l10m")
        .get("command");
      let commandParts = commandToRun.split(" ");

      let moduleArgIndex = commandParts.indexOf("-m");
      let modulePath =
        moduleArgIndex !== -1
          ? commandParts[moduleArgIndex + 1]
          : "lib/modules";
      let arbPath = uri.path;

      let rootPath = vscode.workspace.workspaceFolders[0].uri.path;

      let isModulePath = arbPath.includes(modulePath);
      let isRootPath = arbPath.includes("lib/l10n");
      let generateRoot = !commandParts.includes("--no-generate-root");

      if (isRootPath && generateRoot) {
        executeCommand(`${commandToRun} --generate-only-root`, rootPath);
        return;
      }

      if (!arbPath.includes(modulePath))
        throw new Error("The arb file is not in the module path");

      let featureName = arbPath.split(`${modulePath}/`)[1].split("/")[0];

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

      vscode.window.showErrorMessage(error, {
        detail: error.message,
      });

      outputChannel.show();
    }
  });

  // Adiciona o observador ao contexto de subscrições da extensão
  context.subscriptions.push(watcher);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
