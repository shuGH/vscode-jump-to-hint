'use strict';

// ヒント位置

import * as vscode from 'vscode';
import * as _ from './common';

// ヒント位置を検索する
export function updatePositionByWord(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus, setting: _.UserSetting): boolean {
    return updatePosition(textEditor, edit, status, setting.common.wordRegExp);
}

// ヒント位置を検索する
export function updatePositionByLine(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus, setting: _.UserSetting): boolean {
    return updatePosition(textEditor, edit, status, setting.common.lineRegExp);
}

// ヒント位置を検索する
function updatePosition(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, status: _.ExtensionStatus, regExp: RegExp): boolean {
    if (!regExp) return false;

    let range = getTargetRange(textEditor);
    let positonList = getHintPositionList(textEditor, regExp, range);

    // 更新（初期化）
    status.hintList = [];
    positonList.forEach((p, i) => {
        status.hintList.push({
            pos: p,
            code: ''
        })
    });

    return true;
}

// ヒントの表示範囲を返す
function getTargetRange(textEditor: vscode.TextEditor): vscode.Range {
    const range = textEditor.visibleRanges;

    // 上下に1行膨らませる
    const startLine = Math.max(range[0].start.line - 1, 0);
    const endLine = Math.min(range[0].end.line + 1, textEditor.document.lineCount - 1);

    return new vscode.Range(
        new vscode.Position(startLine, range[0].start.character),
        new vscode.Position(endLine, range[0].end.character),
    );
}

// ヒント位置を返す
function getHintPositionList(textEditor: vscode.TextEditor, regExp: RegExp, range: vscode.Range): vscode.Position[] {
    if (!regExp) return [];
    if (!range) return [];

    let positonList: vscode.Position[] = [];

    // 範囲内の行を走査
    for (let i = range.start.line; i <= range.end.line; i++) {
        let line = textEditor.document.lineAt(i);
        let exec: RegExpExecArray | null;

        // exec()は最後のマッチ位置を保持しながら検索する
        while (!!(exec = regExp.exec(line.text))) {
            positonList.push(
                new vscode.Position(i, exec.index)
            );
        }
    }

    return positonList;
}
