const path = require("path");
const { runTests } = require("@vscode/test-electron");

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../"); // Caminho para a extensão
    const extensionTestsPath = path.resolve(__dirname, "./suite/index"); // Caminho para os testes

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    console.error("Falha ao executar os testes");
    console.error(err);
    process.exit(1);
  }
}

main();
