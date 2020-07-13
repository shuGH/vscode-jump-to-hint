import {
	ExtensionContext,
	TextEditor,
	TextEditorEdit,
	commands,
	window
} from 'vscode';
import * as _ from './common';
import * as util from './utility';
import * as pos from './position';
import * as code from './code';
import * as deco from './decoration';
import * as nav from './navigation';

export function activate(context: ExtensionContext) {
	let status = new _.ExtensionStatus();

	let wordCommandDisposable = commands.registerTextEditorCommand(
		'jumpToHint.jumpByWord',
		(textEditor: TextEditor, edit: TextEditorEdit) => {
			const setting = util.getUserSetting();
			jumpByWord(textEditor, edit, status, setting);
			subscribeTypeEvent(textEditor, edit, status, setting);
			console.log('JumpToHint: Show hints by word.', status);
		}
	);

	let lineCommandDisposable = commands.registerTextEditorCommand(
		'jumpToHint.jumpByLine',
		(textEditor: TextEditor, edit: TextEditorEdit) => {
			const setting = util.getUserSetting();
			jumpByLine(textEditor, edit, status, setting);
			subscribeTypeEvent(textEditor, edit, status, setting);
			console.log('JumpToHint: Show hints by line.', status);
		}
	);

	let undoCommandDisposable = commands.registerTextEditorCommand(
		'jumpToHint.undo',
		(textEditor: TextEditor, edit: TextEditorEdit) => {
			undo(status);
		}
	);

	let cancelCommandDisposable = commands.registerTextEditorCommand(
		'jumpToHint.cancel',
		(textEditor: TextEditor, edit: TextEditorEdit) => {
			exit(status);
		}
	);

	let onDidChangeActiveDisposable = window.onDidChangeActiveTextEditor((ev) => {
		exit(status);
	});

	let onDidChangeVisibleRangesDisposable = window.onDidChangeTextEditorVisibleRanges((ev) => {
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
function subscribeTypeEvent(
	textEditor: TextEditor, edit: TextEditorEdit, status: _.ExtensionStatus,
	setting: _.UserSetting
) {
	switch (setting.common.inputStyle) {
		case _.InputStyle.TypeEvent:
			// 他の拡張がtypeイベントを登録していたら定義済みというエラーが出る
			try {
				subscribeTypeEventByCommand(status);
			}
			catch (error) {
				// Other extention has registered 'type'.
				// https://github.com/Microsoft/vscode/issues/13441
				subscribeTypeEventByInputBox(status);
			}
			break;

		case _.InputStyle.InputBox:
			subscribeTypeEventByInputBox(status);
			break;
	}
}

function subscribeTypeEventByCommand(status: _.ExtensionStatus) {
	let typeCommandDisposable = commands.registerTextEditorCommand(
		'type',
		(textEditor: TextEditor, edit: TextEditorEdit, event: { text: string }) => {
			switch (status.state) {
				case _.ExtensionState.NotActive:
					// そのままVsCodeに流す
					commands.executeCommand('default:type', event);
					break;
				default:
					const setting = util.getUserSetting();
					typeHintCharacter(status, event.text);
					break;
			}
		}
	);

	status.subscriptionList.push(typeCommandDisposable);
}

function subscribeTypeEventByInputBox(status: _.ExtensionStatus) {
	status.inputBox = window.createInputBox();

	status.inputBox.prompt = '';
	status.inputBox.placeholder = 'Jump to...';
	status.inputBox.onDidChangeValue((text) => {
		const setting = util.getUserSetting();
		setHintCharacter(status, text);
	});
	status.inputBox.onDidAccept(() => {
		exit(status);
	});
	status.inputBox.onDidHide(() => {
		exit(status);
	})

	status.inputBox.show()
}

function jumpByWord(
	textEditor: TextEditor, edit: TextEditorEdit, status: _.ExtensionStatus,
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
}

function jumpByLine(
	textEditor: TextEditor, edit: TextEditorEdit, status: _.ExtensionStatus,
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
}

function typeHintCharacter(status: _.ExtensionStatus, text: string) {
	if (status.state == _.ExtensionState.NotActive) return;
	console.log('JumpToHint: Input code.', text);

	status.inputCode = nav.getInputCode(status.inputCode, text);
	tryNavigationOrApplyDecoration(status);
}

function setHintCharacter(status: _.ExtensionStatus, text: string) {
	if (status.state == _.ExtensionState.NotActive) return;
	console.log('JumpToHint: Input code.', text);

	status.inputCode = text;
	tryNavigationOrApplyDecoration(status);
}

function tryNavigationOrApplyDecoration(status: _.ExtensionStatus): boolean {
	let navigable = nav.canNavigate(status.codeList, status.inputCode);

	if (navigable) {
		console.log('JumpToHint: Navigate to hint.', status.inputCode);

		nav.applyNavigation(status);
		exit(status);
	}
	else {
		deco.applyDecoration(status);
	}

	return navigable;
}

function undo(status: _.ExtensionStatus) {
	if (nav.canUndoInputCode(status.inputCode)) {
		console.log('JumpToHint: Undo.');

		status.inputCode = nav.getUndoneInputCode(status.inputCode);
		deco.applyDecoration(status);
	}
	else {
		exit(status);
	}
}

function exit(status: _.ExtensionStatus) {
	console.log('JumpToHint: Exit.');

	status.positionList = [];
	status.codeList = [];
	deco.applyDecoration(status);

	util.updateState(status, _.ExtensionState.NotActive);
	status.finalize();
}
