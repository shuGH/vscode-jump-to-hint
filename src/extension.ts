import * as vscode from 'vscode';
import * as _ from './common';
import * as util from './utility';
import * as pos from './position';
import * as code from './code';
import * as nav from './navigation';

export function activate(context: vscode.ExtensionContext) {
	let status: _.ExtensionStatus = {
		state: _.ExtensionState.NotActive,
		hintList: []
	};

	let wordCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.jumpByWord',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			console.log('jump by word')
			const setting = util.getUserSetting();
			jumpByWord(textEditor, edit, status, setting);
		}
	);

	let lineCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.jumpByLine',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			console.log('jump by line')
			const setting = util.getUserSetting();
			jumpByLine(textEditor, edit, status, setting);
		}
	);

	let undoCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.undo',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			undo(textEditor, edit, status);
		}
	);

	let cancelCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.cancel',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			cancel(textEditor, edit, status);
		}
	);

	// タイプイベント
	// @TODO: 他の拡張も登録していたら定義済みというエラーが出る、AceJumperではその場合はInputBoxを表示させているようだ、何かしら対策が必要
	let typeCommandDisposable = vscode.commands.registerCommand(
		'type',
		(event: { text: string }) => {
			switch (status.state) {
				case _.ExtensionState.NotActive:
					// そのままVsCodeに流す
					vscode.commands.executeCommand('default:type', event);
					break;
				default:
					const setting = util.getUserSetting();
					typeHintCharacter(status, setting, event.text);
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
	context.subscriptions.push(undoCommandDisposable);
	context.subscriptions.push(cancelCommandDisposable);
	context.subscriptions.push(typeCommandDisposable);
}

export function deactivate() { }

function jumpByWord(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting)
{
	util.updateState(status, _.ExtensionState.ActiveWordHint);
	pos.updatePositionByWord(textEditor, edit, status, setting);
	code.updateCode(textEditor, edit, status, setting);
	console.log(status);

	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function jumpByLine(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting)
{
	util.updateState(status, _.ExtensionState.ActiveLineHint);
	pos.updatePositionByLine(textEditor, edit, status, setting);
	code.updateCode(textEditor, edit, status, setting);
	console.log(status);

	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function typeHintCharacter(
	status: _.ExtensionStatus,
	setting: _.UserSetting, text: string)
{
	console.log(text);
}

function undo(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus)
{
	console.log('undo');
	// @TODO: 入力済みがなければキャンセル
	if (0) cancel(textEditor, edit, status);
}

function cancel(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus)
{
	console.log('cancel');
	util.updateState(status, _.ExtensionState.NotActive);
}
