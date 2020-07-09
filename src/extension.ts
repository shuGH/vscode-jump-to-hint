import * as vscode from 'vscode';
import * as _ from './common';
import * as util from './utility';
import * as pos from './position';
import * as deco from './decoration';
import * as nav from './navigation';

export function activate(context: vscode.ExtensionContext) {
	let status: _.ExtensionStatus = {
		state: _.ExtensionState.NotActive
	};

	let wordCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.jumpByWord',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			const setting = util.getUserSetting();
			jumpByWord(textEditor, edit, setting, status);
		}
	);

	let lineCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.jumpByLine',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			const setting = util.getUserSetting();
			jumpByLine(textEditor, edit, setting, status);
		}
	);

	let undoCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.undo',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			const setting = util.getUserSetting();
			undo(textEditor, edit, setting, status);
		}
	);

	let cancelCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.cancel',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			const setting = util.getUserSetting();
			cancel(textEditor, edit, setting, status);
		}
	);

	// タイプイベント
	let typeCommandDisposable = vscode.commands.registerTextEditorCommand(
		'type',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, event: { text: string }) => {
			switch (status.state) {
				case _.ExtensionState.NotActive:
					// そのままVsCodeに流す
					vscode.commands.executeCommand('default:type', event);
					break;
				default:
					const setting = util.getUserSetting();
					typeHintCharacter(textEditor, edit, setting, status, event.text);
					break;
			}
		}
	);

	// window.onDidChangeActiveTextEditor(() => {
	// });
	// window.onDidChangeTextEditorVisibleRanges(() => {
	// });

	context.subscriptions.push(wordCommandDisposable);
	context.subscriptions.push(lineCommandDisposable);
	context.subscriptions.push(cancelCommandDisposable);
	context.subscriptions.push(typeCommandDisposable);
}

export function deactivate() { }

function jumpByWord(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, setting: _.UserSetting, status: _.ExtensionStatus) {
	updateState(status, _.ExtensionState.ActiveWordHint);
	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function jumpByLine(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, setting: _.UserSetting, status: _.ExtensionStatus) {
	updateState(status, _.ExtensionState.ActiveLineHint);
	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function typeHintCharacter(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, setting: _.UserSetting, status: _.ExtensionStatus, text: string) {
	console.log(text);
}

function undo(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, setting: _.UserSetting, status: _.ExtensionStatus) {
	console.log('undo');
}

function cancel(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, setting: _.UserSetting, status: _.ExtensionStatus) {
	console.log('cancel');
	updateState(status, _.ExtensionState.NotActive);
}

function updateState(status: _.ExtensionStatus, state: _.ExtensionState) {
	status.state = state;
	util.setContext(state == _.ExtensionState.NotActive ? false : true);
}
