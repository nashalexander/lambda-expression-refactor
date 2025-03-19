// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { debug } from 'console';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lambda-function-refactor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('lambda-function-refactor.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Lambda Function Refactor!');
	});

	context.subscriptions.push(disposable);

	const refactorToLambda = vscode.commands.registerCommand('lambda-function-refactor.refactorToLambda', async () => {
		refactorToLambdaFunc();
	});
	context.subscriptions.push(refactorToLambda);
}

function refactorToLambdaFunc() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;

	const selection = editor.selection;
	const functionName = editor.document.getText(selection).trim();

	if (!functionName) {
		vscode.window.showErrorMessage('Please select a function name to refactor.');
		return;
	}
	else {
		const codeText = getFunctionCode(functionName);
		vscode.window.showInformationMessage(`Refactoring function ${functionName} to lambda function.`);
		const lambdaCode = `[] ${codeText?.functionCall} { ${codeText?.functionInnerCode} }`;
		// editor.edit(editBuilder => {
		// 	editBuilder.replace(selection, lambdaCode);
		// });
		// print debug
		console.log(lambdaCode);
	}
}

function getFunctionCode(functionName: string) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;

	const document = editor.document;
	const text = document.getText();
	const functionRegex = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
	const functionStart = text.search(functionRegex);
	if (functionStart === -1) {
		vscode.window.showErrorMessage(`Function ${functionName} not found.`);
		return;
	}
	const functionDefinitionEnd = text.indexOf('{', functionStart);
	const functionEnd = text.indexOf('}', functionStart);

	const functionCall = text.slice(functionStart, functionDefinitionEnd - 1);
	const functionInnerCode = text.slice(functionDefinitionEnd + 1, functionEnd - 1);
	return {functionCall, functionInnerCode};
}

// This method is called when your extension is deactivated
export function deactivate() {}
