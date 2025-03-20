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
	const functionCall = editor.document.getText(selection).trim();
	if (!functionCall) {
		vscode.window.showErrorMessage('Please select a function call to refactor.');
		return;
	}

	const baseIndent = ((editor) => {
		const position = editor.document.positionAt(editor.document.offsetAt(selection.start));
		const line = editor.document.lineAt(position.line);
		console.log("line:" + line.text);
		return line.text.match(/^\s*/)?.[0] || '';
	})(editor);
	// print indent
	console.log("s" + baseIndent + "e");

	// find function name, open ( and close )
	const functionName = functionCall.slice(0, functionCall.indexOf('(')).trim();
	if (!functionName) {
		vscode.window.showErrorMessage('Function name not found.');
		return;
	}
	const openParenthesis = functionCall.indexOf('(');
	const closeParenthesis = functionCall.indexOf(')');
	if(openParenthesis === -1 || closeParenthesis === -1) {
		vscode.window.showErrorMessage('Invalid function call.');
		return;
	}
	const parameters = functionCall.slice(openParenthesis + 1, closeParenthesis).trim();

	const lambdaExp = buildCppLambdaExp(functionName, parameters, baseIndent);
	if(!lambdaExp) return;
	vscode.window.showInformationMessage(`Refactoring function ${functionName} to lambda function.`);;
	editor.edit(editBuilder => {
		editBuilder.replace(selection, lambdaExp);
	});
	// print debug
	// console.log(lambdaExp);
}

function buildCppLambdaExp(functionName: string, parameters: string, baseIndent: string) {
	
	const text = (() => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return null;
		return editor.document.getText();
	})();
	if(!text) return null;

	const block = extractFunctionBlock(text, functionName, baseIndent);
	if(!block) return null;

	return `[] ${block.definition} ${block.indentedFunctionCode}(${parameters});`;
}

function extractFunctionBlock(text: string, functionName: string, baseIndent: string) {
	const functionRegex = new RegExp(`\\b${functionName}\\b[^\\{]*\\{`, 'm');
	const functionStart = text.search(functionRegex);
	if (functionStart === -1) {
		vscode.window.showErrorMessage(`Function ${functionName} not found.`);
		return;
	}

	const editor = vscode.window.activeTextEditor;
	if (!editor) return null;
	
	const definition = ((text: string, functionStart: number) => {
		const functionDefinitionStart = text.indexOf('(', functionStart);
		const functionDefinitionEnd = text.indexOf(')', functionStart);
		return text.slice(functionDefinitionStart, functionDefinitionEnd + 1);
	})(text, functionStart);

	// Use a stack to get the entire function block, including the enclosing braces
	let functionCode = ((text: string, functionStart: number) => {
		let braceIdx = text.indexOf('{', functionStart);
		if (braceIdx === -1) return null;
	
		let stack = ['{'];
		let i = braceIdx + 1;
	
		while (i < text.length && stack.length > 0) {
		if (text[i] === '{') stack.push('{');
			else if (text[i] === '}') stack.pop();
			i++;
		}
	
		if (stack.length === 0) {
		// 'i' is now right after the matching closing brace
			return text.substring(braceIdx, i);
		}
		return null;
	})(text, functionStart);

	const indentedFunctionCode = functionCode?.split('\n').map((line, idx) => idx === 0 ? line : baseIndent + line).join('\n');
	// print functionCode and indentedFunctionCode
	console.log(functionCode);
	console.log(indentedFunctionCode);
	return {definition, indentedFunctionCode};
}
  

// This method is called when your extension is deactivated
export function deactivate() {}
