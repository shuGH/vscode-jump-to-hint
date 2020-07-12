import * as vscode from 'vscode';
import * as _ from './common';
import * as util from './utility';
import * as pos from './position';
import * as code from './code';
import * as deco from './decoration';
import * as nav from './navigation';

export function activate(context: vscode.ExtensionContext) {
	let status = new _.ExtensionStatus();

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
			exit(textEditor, edit, status);
		}
	);

	// タイプイベント
	// @TODO: 他の拡張も登録していたら定義済みというエラーが出る、AceJumperではその場合はInputBoxを表示させているようだ、何かしら対策が必要
	// @TODO: 行儀として有効なときにコマンド登録して、Exit時に破棄しよう
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
					typeHintCharacter(textEditor, edit, status, setting, event.text);
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
	context.subscriptions.push(status);
}

export function deactivate() {}

function jumpByWord(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting)
{
	status.initialize();
	util.updateState(status, _.ExtensionState.ActiveLineHint);

	status.positionList = pos.getPositionListByWord(setting, textEditor);
	status.codeList = code.getCodeList(setting, status.positionList);
	status.foregroundDecoration = deco.getForegroundDecoration(setting);
	status.backgroundDecoration = deco.getBackgroundDecoration(setting);

	deco.applyDecoration(status, textEditor);

	console.log(status);
	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function jumpByLine(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting)
{
	status.initialize();
	util.updateState(status, _.ExtensionState.ActiveLineHint);

	status.positionList = pos.getPositionListByLine(setting, textEditor);
	status.codeList = code.getCodeList(setting, status.positionList);
	status.foregroundDecoration = deco.getForegroundDecoration(setting);
	status.backgroundDecoration = deco.getBackgroundDecoration(setting);

	deco.applyDecoration(status, textEditor);

	console.log(status);
	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function typeHintCharacter(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting, text: string)
{
	if (status.state == _.ExtensionState.NotActive) return;
	console.log(text);
}

function undo(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus)
{
	if (false) {
		console.log('undo');
	}
	else {
		exit(textEditor, edit, status);
	}
}

function exit(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus)
{
	console.log('exit');

	status.positionList = [];
	status.codeList = [];
	deco.applyDecoration(status, textEditor);

	util.updateState(status, _.ExtensionState.NotActive);
	status.finalize();
}
