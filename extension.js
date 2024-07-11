const vscode = require("vscode");
const cp = require("child_process");

function executeCommand(command, rootPath) {
  cp.exec(command, { cwd: rootPath }, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage(
        `Erro ao executar o comando: ${error.message}`
      );
      return;
    }
    if (stderr) {
      vscode.window.showErrorMessage(`Erro ao executar o comando: ${stderr}`);
      return;
    }
    vscode.window.showInformationMessage(
      `Comando executado com sucesso: ${stdout}`
    );
  });
}

function activate(context) {
  // Cria um observador de arquivos para arquivos .arb
  let watcher = vscode.workspace.createFileSystemWatcher("**/*.arb");

  // Executa o comando quando um arquivo .arb é alterado
  watcher.onDidChange((uri) => {
    let commandToRun =
      "dart run l10m -t intl_pt.arb -m lib/features --no-generate-root";
    let commandParts = commandToRun.split(" ");

    let moduleArgIndex = commandParts.indexOf("--m");
    let modulePath =
      moduleArgIndex !== -1 ? commandParts[moduleArgIndex + 1] : "lib/modules";
    let arbPath = uri.path;

    let featureName = arbPath.split(`${modulePath}/`)[1].split("/")[0];

    let rootPath = vscode.workspace.workspaceFolders[0].uri.path;

    let isModulePath = arbPath.includes(modulePath);
    let isRootPath = arbPath.includes("lib/l10n");
    let generateRoot = !commandParts.includes("--no-generate-root");

    if (isRootPath && generateRoot) {
      executeCommand(`${commandToRun} --generate-only-root`, rootPath);
      return;
    }

    if (isModulePath && featureName) {
      executeCommand(
        `${commandToRun} -g ${featureName} --generate-only-module`,
        rootPath
      );
      return;
    }

    executeCommand(commandToRun, rootPath);
  });

  // Adiciona o observador ao contexto de subscrições da extensão
  context.subscriptions.push(watcher);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
