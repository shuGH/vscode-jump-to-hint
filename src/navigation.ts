'use strict';

// 入力処理

import {
    Selection, window, TextEditor, Position
} from 'vscode';
import * as _ from './common';

export function applyNavigationByPosition(status: _.ExtensionStatus): boolean {
    return applyNavigation(status.inputLabel, status.targetEditorList, status.labelList, status.positionList);
}

export function applyNavigationByRange(status: _.ExtensionStatus): boolean {
    // ヒント位置に変換する
    let positionList = status.rangeList.map((l, i) => {
        return l.map((r) => { return r.start; });
    });
    return applyNavigation(status.inputLabel, status.targetEditorList, status.labelList, positionList);
}

function applyNavigation(inputLabel: string, targetEditorList: TextEditor[], labelList: string[][], positionList: Position[][]): boolean {
    for (let i = 0; i <= labelList.length; i++) {
        let list = labelList[i];

        // 一致するものがあるか
        let index = list.indexOf(inputLabel);
        if (index < 0) continue;

        let pos = positionList[i][index];
        if (!pos) return false;
        let target = targetEditorList[i];
        if (!target) return false;

        // フォーカス移動
        const selection = new Selection(
            pos.line, pos.character, pos.line, pos.character,
        );
        target.selection = selection;
        window.showTextDocument(target.document, target.viewColumn);
        break;
    }

    return true;
}

// 入力コードを更新する
export function getInputText(oldInputText: string, newText: string): string {
    return oldInputText += newText;
}

//　入力コードをUndoする
export function getUndoneInputText(inputText: string): string {
    if (inputText == '') return '';
    return inputText.slice(0, -1);
}

// ジャンプできるか
export function getNavigationCapability(labelList: string[][], inputLabel: string): _.NavigationCapability {
    if (!inputLabel) return _.NavigationCapability.NotMatch;

    // 完全一致するものがあるか
    let f = false;
    labelList.forEach((l) => {
        f = f || (l.indexOf(inputLabel) >= 0);
    });
    if (f) return _.NavigationCapability.CanNavigate;

    // 先頭から一致するものがあるか
    let re = new RegExp('^' + inputLabel + '.*', 'i');
    labelList.forEach((l) => {
        l.forEach((label) => {
            f = f || (re.test(label));
        });
    });
    if (f) return _.NavigationCapability.Narrowed;

    return _.NavigationCapability.NotMatch;
}

// Undoできるか
export function canUndoInputText(inputText: string): boolean {
    return (inputText.length >= 1);
}
