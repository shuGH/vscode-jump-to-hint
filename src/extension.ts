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
import * as label from './label';
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

    let searchCommandDisposable = commands.registerTextEditorCommand(
        'jumpToHint.jumpBySearch',
        (textEditor: TextEditor, edit: TextEditorEdit) => {
            const setting = util.getUserSetting();
            jumpBySearch(textEditor, edit, status, setting);
            subscribeTypeEvent(textEditor, edit, status, setting);
            console.log('JumpToHint: Show hints by search.', status);
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
    context.subscriptions.push(searchCommandDisposable);
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

    status.targetEditorList = util.getTargetTextEditorList(setting);
    status.positionList = pos.getPositionListByWord(setting, status.targetEditorList);
    status.labelList = label.getLabelListByPosition(setting, status.positionList);
    status.foregroundDecorationList = deco.getForegroundDecorationList(setting, status.targetEditorList);
    status.backgroundDecorationList = deco.getBackgroundDecorationList(setting, status.targetEditorList);

    deco.applyDecoration(status);
}

function jumpByLine(
    textEditor: TextEditor, edit: TextEditorEdit, status: _.ExtensionStatus,
    setting: _.UserSetting
) {
    status.initialize();
    util.updateState(status, _.ExtensionState.ActiveLineHint);

    status.targetEditorList = util.getTargetTextEditorList(setting);
    status.positionList = pos.getPositionListByLine(setting, status.targetEditorList);
    status.labelList = label.getLabelListByPosition(setting, status.positionList);
    status.foregroundDecorationList = deco.getForegroundDecorationList(setting, status.targetEditorList);
    status.backgroundDecorationList = deco.getBackgroundDecorationList(setting, status.targetEditorList);

    deco.applyDecoration(status);
}

function jumpBySearch(
    textEditor: TextEditor, edit: TextEditorEdit, status: _.ExtensionStatus,
    setting: _.UserSetting
) {
    status.initialize();
    util.updateState(status, _.ExtensionState.ActiveSearchHint);

    status.targetEditorList = util.getTargetTextEditorList(setting);
    status.foregroundDecorationList = deco.getForegroundDecorationList(setting, status.targetEditorList);
    status.backgroundDecorationList = deco.getBackgroundDecorationList(setting, status.targetEditorList);
    status.highlightDecorationList = deco.getHighlightDecorationList(setting, status.targetEditorList);

    deco.applyDecoration(status);
}

function typeHintCharacter(status: _.ExtensionStatus, text: string) {
    if (status.state == _.ExtensionState.NotActive) return;
    console.log('JumpToHint: Input character.', text);

    status.inputLabel = nav.getInputText(status.inputLabel, text);
    tryNavigationOrApplyDecoration(status, false);
}

function setHintCharacter(status: _.ExtensionStatus, text: string) {
    if (status.state == _.ExtensionState.NotActive) return;
    console.log('JumpToHint: Input character.', text);

    switch (status.state) {
        case _.ExtensionState.ActiveWordHint:
            // 入力として扱う
            status.inputLabel = text;
            break;
        case _.ExtensionState.ActiveLineHint:
            // 入力として扱う
            status.inputLabel = text;
            break;
        case _.ExtensionState.ActiveSearchHint:
            // クエリと入力に分解する
            if (text.length >= status.inputQuery.length) {
                status.inputLabel = text.slice(status.inputQuery.length);
            }
            else {
                // クエリまでUndoした場合
                status.inputLabel = '';
                status.inputQuery = text;
            }
            break;
    }

    // Undoをしてinputが''の時は表示したまま
    tryNavigationOrApplyDecoration(status, false);
}

function tryNavigationOrApplyDecoration(status: _.ExtensionStatus, isExitEnabled: boolean): boolean {
    let capability = nav.getNavigationCapability(status.labelList, status.inputLabel);

    switch (capability) {
        case _.NavigationCapability.CanNavigate:
            console.log('JumpToHint: Navigate to hint.', status.inputLabel, status.inputQuery);
            switch (status.state) {
                case _.ExtensionState.ActiveWordHint:
                    nav.applyNavigationByPosition(status);
                    break;
                case _.ExtensionState.ActiveLineHint:
                    nav.applyNavigationByPosition(status);
                    break;
                case _.ExtensionState.ActiveSearchHint:
                    nav.applyNavigationByRange(status);
                    break;
            }
            exit(status);
            break;

        case _.NavigationCapability.Narrowed:
            console.log('JumpToHint: Update hint.', status);
            deco.applyDecoration(status);
            break;

        case _.NavigationCapability.NotMatch:
            switch (status.state) {
                case _.ExtensionState.ActiveWordHint:
                    if (isExitEnabled) {
                        exit(status);
                    }
                    else {
                        deco.applyDecoration(status);
                    }
                    break;
                case _.ExtensionState.ActiveLineHint:
                    if (isExitEnabled) {
                        exit(status);
                    }
                    else {
                        deco.applyDecoration(status);
                    }
                    break;
                case _.ExtensionState.ActiveSearchHint:
                    const setting = util.getUserSetting();
                    // Jumpできなかったので、入力をQueryとして扱う
                    status.inputQuery = nav.getInputText(status.inputQuery, status.inputLabel);
                    status.inputLabel = '';
                    status.rangeList = pos.getRangeListBySearch(setting, status.targetEditorList, status.inputQuery);
                    status.labelList = label.getLabelListByRange(setting, status.targetEditorList, status.rangeList);
                    console.log('JumpToHint: Update query.', status);
                    deco.applyDecoration(status);
                    break;
            }
            break;
    }

    return (capability == _.NavigationCapability.CanNavigate);
}

function cancel(status: _.ExtensionStatus) {
    console.log('JumpToHint: Cancel.');

    status.inputLabel = '';
    deco.applyDecoration(status);
}

function undo(status: _.ExtensionStatus) {
    console.log('JumpToHint: Undo.');

    if (status.inputLabel) {
        // undoできなかったらexit
        if (!nav.canUndoInputText(status.inputLabel)) {
            exit(status);
            return;
        }

        status.inputLabel = nav.getUndoneInputText(status.inputLabel);
        deco.applyDecoration(status);
    }
    else {
        // undoできなかったらexit
        if (!nav.canUndoInputText(status.inputQuery)) {
            exit(status);
            return;
        }

        const setting = util.getUserSetting();
        status.inputQuery = nav.getUndoneInputText(status.inputQuery);
        status.inputLabel = '';
        status.rangeList = pos.getRangeListBySearch(setting, status.targetEditorList, status.inputQuery);
        status.labelList = label.getLabelListByRange(setting, status.targetEditorList, status.rangeList);
        deco.applyDecoration(status);
    }
}

function exit(status: _.ExtensionStatus) {
    console.log('JumpToHint: Exit.');

    status.positionList = pos.getEmptyPositionList(status.targetEditorList);
    deco.applyDecoration(status);

    util.updateState(status, _.ExtensionState.NotActive);
    status.finalize();
}
