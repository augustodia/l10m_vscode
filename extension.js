
const vscode = require('vscode');
const fs = require('fs');

// Função para logar eventos em um arquivo JSON
function logEvent(eventType, data) {
    const logPath = `${vscode.workspace.rootPath}/eventLog.json`;
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, eventType, data };

    // Lê o arquivo de log atual, adiciona a nova entrada, e salva novamente
    fs.readFile(logPath, (err, content) => {
        let logs = [];
        if (!err) {
            logs = JSON.parse(content);
        }
        logs.push(logEntry);

        fs.writeFile(logPath, JSON.stringify(logs, null, 2), err => {
            if (err) {
                return console.error(`Falha ao escrever no log: ${err}`);
            }
        });
    });
}

function activate(context) {
    // Monitora a transição entre arquivos
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            const data = {
                fileName: editor.document.fileName,
            }

            logEvent('FileTransition', data);
        }
    }, null, context.subscriptions);

    // Monitora a criação de arquivos e pastas
    vscode.workspace.onDidCreateFiles(event => {
        event.files.forEach(file => {
        const isDirectory = fs.lstatSync(file.fsPath).isDirectory();
            const data = {
                fileName: file.fsPath,
                isDirectory,
            }
            logEvent('FileCreation', data);
        });
    });

    // Monitora mudanças nos documentos
    vscode.workspace.onDidChangeTextDocument(event => {
        const isLog = event.document.uri.includes('eventLog.json')

        if(isLog) return;

        const data = {
            fileName: event.document.fileName,
            contentChanges: event.contentChanges,
        }
        
        logEvent('DocumentChange', data);
    });

    // Monitora a exclusão de arquivos e pastas
    vscode.workspace.onDidDeleteFiles(event => {
        event.files.forEach(file => {
            const isDirectory = fs.lstatSync(file.fsPath).isDirectory();
            const data = {
                fileName: file.fsPath,
                isDirectory,
            }
            logEvent('FileDeletion', data);
        });
    });

    vscode.workspace.onDidRenameFiles(event => {
        event.files.forEach(file => {
            const isDirectory = fs.lstatSync(file.newUri.fsPath).isDirectory();

            const data = {
                oldFileName: file.oldUri.fsPath,
                newFileName: file.newUri.fsPath,
                isDirectory
            }
            logEvent('FileRename', data);
        });
    })
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
