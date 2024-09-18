const assert = require("assert");
const vscode = require("vscode");
const myExtension = require("../extension");
const sinon = require("sinon");
const path = require("path");
const cp = require("child_process");

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Starting all tests.");

  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test("The extension should activate", async () => {
    const extensionId = "augustodia.flutter-l10m";
    const extension = vscode.extensions.getExtension(extensionId);
    assert.ok(extension, "The extension was not found");

    assert.ok(extension.isActive, "The extension was not activated");
  });

  test("handleArbFileChange executes the correct command in the module path", () => {
    sandbox.stub(vscode.window, "createOutputChannel").returns({
      appendLine: sandbox.stub(),
      show: sandbox.stub(),
    });
    sandbox.stub(vscode.workspace, "getConfiguration").returns({
      get: sandbox
        .stub()
        .withArgs("command")
        .returns("dart run l10m -m lib/modules"),
    });

    const outputChannelAppendLineStub = sandbox.stub(
      myExtension.outputChannel,
      "appendLine"
    );
    const setStatusBarMessageStub = sandbox.stub(
      vscode.window,
      "setStatusBarMessage"
    );

    const execStub = sandbox
      .stub(cp, "exec")
      .callsFake((command, options, callback) => {
        callback(null, "command output", "");
      });

    const workspaceRoot = "/path/to/workspace";
    const arbFileUri = vscode.Uri.file(
      path.join(workspaceRoot, "lib", "modules", "feature1", "file.arb")
    );

    myExtension.handleArbFileChange(arbFileUri, workspaceRoot);

    assert.ok(execStub.calledOnce);
    const expectedCommand =
      "dart run l10m -m lib/modules -g feature1 --generate-only-module";
    assert.strictEqual(execStub.firstCall.args[0], expectedCommand);

    assert.ok(outputChannelAppendLineStub.called);
    assert.ok(setStatusBarMessageStub.called);
  });

  test("handleArbFileChange executes the correct command in the root path", () => {
    sandbox.stub(vscode.window, "createOutputChannel").returns({
      appendLine: sandbox.stub(),
      show: sandbox.stub(),
    });
    sandbox.stub(vscode.workspace, "getConfiguration").returns({
      get: sandbox.stub().withArgs("command").returns("dart run l10m"),
    });

    const outputChannelAppendLineStub = sandbox.stub(
      myExtension.outputChannel,
      "appendLine"
    );
    const setStatusBarMessageStub = sandbox.stub(
      vscode.window,
      "setStatusBarMessage"
    );

    const execStub = sandbox
      .stub(cp, "exec")
      .callsFake((command, options, callback) => {
        callback(null, "command output", "");
      });

    const workspaceRoot = "/path/to/workspace";
    const arbFileUri = vscode.Uri.file(
      path.join(workspaceRoot, "lib", "l10n", "app_en.arb")
    );

    myExtension.handleArbFileChange(arbFileUri, workspaceRoot);

    assert.ok(execStub.calledOnce);
    const expectedCommand = "dart run l10m --generate-only-root";
    assert.strictEqual(execStub.firstCall.args[0], expectedCommand);

    assert.ok(outputChannelAppendLineStub.called);
    assert.ok(setStatusBarMessageStub.called);
  });

  test("handleArbFileChange handles errors appropriately", () => {
    sandbox.stub(vscode.window, "createOutputChannel").returns({
      appendLine: sandbox.stub(),
      show: sandbox.stub(),
    });
    sandbox.stub(vscode.workspace, "getConfiguration").returns({
      get: sandbox.stub().withArgs("command").returns("dart run l10m"),
    });

    const outputChannelAppendLineStub = sandbox.stub(
      myExtension.outputChannel,
      "appendLine"
    );
    const setStatusBarMessageStub = sandbox.stub(
      vscode.window,
      "setStatusBarMessage"
    );

    sandbox.stub(cp, "exec").callsFake((command, options, callback) => {
      callback(new Error("Execution error"), "", "");
    });

    const workspaceRoot = "/path/to/workspace";
    const arbFileUri = vscode.Uri.file(
      path.join(workspaceRoot, "lib", "modules", "feature1", "file.arb")
    );

    myExtension.handleArbFileChange(arbFileUri, workspaceRoot);

    assert.ok(outputChannelAppendLineStub.called);
    assert.ok(setStatusBarMessageStub.called);
    const errorMessage = `Error while executing the command: dart run l10m -g feature1 --generate-only-module. Error: Execution error`;
    assert.ok(outputChannelAppendLineStub.calledWithMatch(errorMessage));
  });
});
