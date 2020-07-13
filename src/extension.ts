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
			subscribeTypeEvent(textEditor, edit, status);
		}
	);

	let lineCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.jumpByLine',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			console.log('jump by line')
			const setting = util.getUserSetting();
			jumpByLine(textEditor, edit, status, setting);
			subscribeTypeEvent(textEditor, edit, status);
		}
	);

	let undoCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.undo',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			undo(status);
		}
	);

	let cancelCommandDisposable = vscode.commands.registerTextEditorCommand(
		'jumpToHint.cancel',
		(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
			exit(status);
		}
	);

	let onDidChangeActiveDisposable = vscode.window.onDidChangeActiveTextEditor((ev) => {
		exit(status);
	});

	let onDidChangeVisibleRangesDisposable = vscode.window.onDidChangeTextEditorVisibleRanges((ev) => {
		exit(status);
	});

	context.subscriptions.push(wordCommandDisposable);
	context.subscriptions.push(lineCommandDisposable);
	context.subscriptions.push(undoCommandDisposable);
	context.subscriptions.push(cancelCommandDisposable);
	context.subscriptions.push(onDidChangeActiveDisposable);
	context.subscriptions.push(onDidChangeVisibleRangesDisposable);
	context.subscriptions.push(status);
}

export function deactivate() {}

// タイプイベントの購読
// @TODO: 他の拡張も登録していたら定義済みというエラーが出る、AceJumperではその場合はInputBoxを表示させているようだ、何かしら対策が必要
// @TODO: 行儀として有効なときにコマンド登録して、Exit時に破棄しよう
export function subscribeTypeEvent(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
) {
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
	)

	status.subscriptionList.push(typeCommandDisposable);
}

function jumpByWord(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting
) {
	status.initialize();
	util.updateState(status, _.ExtensionState.ActiveLineHint);

	status.targetEditor = textEditor;
	status.positionList = pos.getPositionListByWord(setting, status.targetEditor);
	status.codeList = code.getCodeList(setting, status.positionList);
	status.foregroundDecoration = deco.getForegroundDecoration(setting);
	status.backgroundDecoration = deco.getBackgroundDecoration(setting);

	deco.applyDecoration(status);

	console.log(status);
	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function jumpByLine(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting
) {
	status.initialize();
	util.updateState(status, _.ExtensionState.ActiveLineHint);

	status.targetEditor = textEditor;
	status.positionList = pos.getPositionListByLine(setting, status.targetEditor);
	status.codeList = code.getCodeList(setting, status.positionList);
	status.foregroundDecoration = deco.getForegroundDecoration(setting);
	status.backgroundDecoration = deco.getBackgroundDecoration(setting);

	deco.applyDecoration(status);

	console.log(status);
	vscode.window.showInformationMessage('Hello World from jump-to-hint!');
}

function typeHintCharacter(
	textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting, text: string
) {
	if (status.state == _.ExtensionState.NotActive) return;

	status.inputCode = nav.getInputCode(status.inputCode, text);
	if (nav.canNavigate(status.codeList, status.inputCode)) {
		nav.applyNavigation(status);
		exit(status);
	}
	else {
		deco.applyDecoration(status);
	}

	console.log(text);
}

function undo(status: _.ExtensionStatus) {
	if (nav.canUndoInputCode(status.inputCode)) {
		status.inputCode = nav.getUndoneInputCode(status.inputCode);
		deco.applyDecoration(status);
	}
	else {
		exit(status);
	}
}

function exit(status: _.ExtensionStatus) {
	console.log('exit');

	status.positionList = [];
	status.codeList = [];
	deco.applyDecoration(status);

	util.updateState(status, _.ExtensionState.NotActive);
	status.finalize();
}
