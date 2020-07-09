// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from './common';
import * as utility from './utility';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let setting: _.UserSetting = {
		common: {
			wordRegExp: new RegExp(''),
			lineRegExp: new RegExp(''),
			hintChars: []
		},
		type: {
			hintLengthType: _.HintLengthType.Variable,
			fixedHintLength: 2,
		},
		ui: {
			fontFamily: '',
			fontSize: 16,
			fontColor: '',
			backgroundColor: ''
		}
	};

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jump-to-hint" is now active!');

	utility.loadUserSetting(setting);
	console.log("UserSetting: ", 'Loaded.', setting);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let WordCommandDisposable = vscode.commands.registerCommand('jumpToHint.jumpByWord', () => {
		vscode.window.showInformationMessage('Hello World from jump-to-hint!');
	});

	let LineCommandDisposable = vscode.commands.registerCommand('jumpToHint.jumpByLine', () => {
		vscode.window.showInformationMessage('Hello World from jump-to-hint!');
	});

	context.subscriptions.push(WordCommandDisposable);
	context.subscriptions.push(LineCommandDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
